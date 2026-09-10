import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm, writeFile, mkdir, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { LIMITS } from "../lib/community/config";

/**
 * The cleanup job's two decisions -- "is this draft stale" and "is this object
 * orphaned" -- are the ones that can destroy someone's work if they're wrong,
 * so they're exercised directly against the dev repo and store rather than
 * mocked.
 */

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000);
const daysAgo = (days: number) => hoursAgo(days * 24);

let workdir: string;
let previousCwd: string;

beforeEach(async () => {
  previousCwd = process.cwd();
  workdir = await mkdtemp(path.join(tmpdir(), "floor-cleanup-"));
  process.chdir(workdir);
});

afterEach(async () => {
  process.chdir(previousCwd);
  await rm(workdir, { recursive: true, force: true });
});

/**
 * Fresh modules per test: both the repo and the store memoise their instance,
 * and that instance captures the working directory at first use.
 */
const load = async () => {
  vi.resetModules();
  const db = await import("../lib/community/db");
  const storage = await import("../lib/community/storage");
  return { repo: db.repo(), store: storage.imageStore() };
};

const writeObject = async (key: string, age: Date) => {
  const file = path.join(workdir, "public", "community-dev", key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, "x");
  await utimes(file, age, age);
};

describe("finding abandoned drafts", () => {
  it("returns drafts older than the cutoff, oldest first", async () => {
    const { repo } = await load();

    const old = await repo.create({ name: "Old", items: [], authorKey: "a" });
    const older = await repo.create({ name: "Older", items: [], authorKey: "a" });
    const fresh = await repo.create({ name: "Fresh", items: [], authorKey: "a" });

    // Backdate by rewriting updatedAt the way the passage of time would.
    const file = path.join(workdir, ".community-dev", "db.json");
    const data = JSON.parse(await import("node:fs").then((fs) => fs.readFileSync(file, "utf8")));
    const at = (id: string, when: Date) => {
      data.categories.find((c: { id: string }) => c.id === id).updatedAt =
        when.toISOString();
    };
    at(old.id, daysAgo(8));
    at(older.id, daysAgo(30));
    at(fresh.id, daysAgo(1));
    await writeFile(file, JSON.stringify(data));

    const cutoff = daysAgo(LIMITS.abandonedDraftDays).toISOString();
    const stale = await repo.listStaleDrafts(cutoff, 50);

    expect(stale.map((c: { name: string }) => c.name)).toEqual(["Older", "Old"]);
  });

  it("never returns a published category, however old", async () => {
    const { repo } = await load();

    const published = await repo.create({ name: "Live", items: [], authorKey: "a" });
    await repo.publish(published.id);

    const file = path.join(workdir, ".community-dev", "db.json");
    const fs = await import("node:fs");
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.categories[0].updatedAt = daysAgo(400).toISOString();
    await writeFile(file, JSON.stringify(data));

    expect(await repo.listStaleDrafts(new Date().toISOString(), 50)).toEqual([]);
  });

  it("respects the limit", async () => {
    const { repo } = await load();
    for (let i = 0; i < 5; i += 1) {
      await repo.create({ name: `Draft ${i}`, items: [], authorKey: "a" });
    }
    const stale = await repo.listStaleDrafts(new Date(Date.now() + 1000).toISOString(), 3);
    expect(stale).toHaveLength(3);
  });
});

describe("collecting referenced image keys", () => {
  it("gathers keys across every category and ignores items without one", async () => {
    const { repo } = await load();

    const category = await repo.create({
      name: "Mixed",
      items: [
        { id: "1", name: "A", alternatives: [], imageKey: "k/a.webp", imageUrl: "u", width: null, height: null, credit: null },
        { id: "2", name: "B", alternatives: [], imageKey: null, imageUrl: null, width: null, height: null, credit: null },
      ],
      authorKey: "a",
    });

    await repo.create({
      name: "Second",
      items: [
        { id: "3", name: "C", alternatives: [], imageKey: "k/c.webp", imageUrl: "u", width: null, height: null, credit: null },
      ],
      authorKey: "b",
    });

    const keys = await repo.allImageKeys();
    expect([...keys].sort()).toEqual(["k/a.webp", "k/c.webp"]);
    expect(keys.has(category.id)).toBe(false);
  });

  it("is empty when nothing has images, rather than throwing", async () => {
    const { repo } = await load();
    await repo.create({ name: "Bare", items: [], authorKey: "a" });
    expect([...(await repo.allImageKeys())]).toEqual([]);
  });
});

describe("listing stored objects", () => {
  it("reports keys relative to the store root, with modification times", async () => {
    const { store } = await load();
    await writeObject("categories/abc/one.webp", hoursAgo(48));
    await writeObject("categories/abc/two.webp", hoursAgo(1));

    const objects = await store.list();
    expect(objects.map((o: { key: string }) => o.key).sort()).toEqual([
      "categories/abc/one.webp",
      "categories/abc/two.webp",
    ]);

    const old = objects.find((o: { key: string }) => o.key.endsWith("one.webp"));
    expect(old).toBeDefined();
    expect(Date.now() - old!.uploadedAt.getTime()).toBeGreaterThan(40 * 3600_000);
  });

  it("is empty for a store that has never been written to", async () => {
    const { store } = await load();
    expect(await store.list()).toEqual([]);
  });
});

describe("deciding what counts as an orphan", () => {
  /** The predicate the cleanup route applies, kept in step with it. */
  const orphans = (
    objects: Array<{ key: string; uploadedAt: Date }>,
    referenced: Set<string>
  ) => {
    const graceCutoff = Date.now() - LIMITS.orphanGraceHours * 3600_000;
    return objects.filter(
      (object) =>
        !referenced.has(object.key) && object.uploadedAt.getTime() < graceCutoff
    );
  };

  it("spares anything a category still points at", () => {
    const objects = [{ key: "live.webp", uploadedAt: daysAgo(30) }];
    expect(orphans(objects, new Set(["live.webp"]))).toEqual([]);
  });

  it("spares a recent upload even with nothing pointing at it yet", () => {
    // The object is written before the row that references it, so a fresh
    // unreferenced object is normal, not garbage.
    const objects = [{ key: "inflight.webp", uploadedAt: hoursAgo(1) }];
    expect(orphans(objects, new Set())).toEqual([]);
  });

  it("collects an old unreferenced object", () => {
    const objects = [{ key: "leaked.webp", uploadedAt: daysAgo(3) }];
    expect(orphans(objects, new Set()).map((o) => o.key)).toEqual(["leaked.webp"]);
  });

  it("uses the grace window boundary, not a rounded day", () => {
    const justInside = hoursAgo(LIMITS.orphanGraceHours - 1);
    const justOutside = hoursAgo(LIMITS.orphanGraceHours + 1);

    expect(orphans([{ key: "a", uploadedAt: justInside }], new Set())).toEqual([]);
    expect(
      orphans([{ key: "b", uploadedAt: justOutside }], new Set()).map((o) => o.key)
    ).toEqual(["b"]);
  });

  it("would delete nothing if the reference set somehow contained everything", () => {
    const objects = [
      { key: "a", uploadedAt: daysAgo(10) },
      { key: "b", uploadedAt: daysAgo(10) },
    ];
    expect(orphans(objects, new Set(["a", "b"]))).toEqual([]);
  });
});
