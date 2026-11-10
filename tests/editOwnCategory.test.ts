import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { InvalidInput, parseCategoryPatch } from "../lib/community/validate";
import type { CommunityItem } from "../lib/community/types";

/**
 * Editing a saved category. The property that matters most: an edit to the
 * words must never cost anyone a picture, because the route deletes the image
 * of any item that falls out of the list.
 */

const item = (id: string, name: string, withImage = true): CommunityItem => ({
  id,
  name,
  alternatives: [],
  imageKey: withImage ? `categories/c/${id}-hash.webp` : null,
  imageUrl: withImage ? `https://img.example/${id}.webp` : null,
  width: withImage ? 800 : null,
  height: withImage ? 600 : null,
  credit: null,
});

const existing = [item("a", "Apple"), item("b", "Banana")];

describe("parseCategoryPatch", () => {
  it("accepts a rename on its own and leaves the items alone", () => {
    const patch = parseCategoryPatch({ name: "  Better   name " }, existing);
    expect(patch).toEqual({ name: "Better name" });
  });

  it("renames an item and keeps its picture", () => {
    const patch = parseCategoryPatch(
      {
        items: [
          { id: "a", name: "Green apple", alternatives: ["Granny Smith"] },
          { id: "b", name: "Banana" },
        ],
      },
      existing
    );

    expect(patch.name).toBeUndefined();
    expect(patch.items?.[0]).toMatchObject({
      id: "a",
      name: "Green apple",
      alternatives: ["Granny Smith"],
      imageKey: existing[0].imageKey,
      imageUrl: existing[0].imageUrl,
    });
  });

  it("adds a new item with no picture, whatever the client claims", () => {
    const patch = parseCategoryPatch(
      {
        items: [
          { id: "a", name: "Apple" },
          { id: "b", name: "Banana" },
          { name: "Cherry", imageUrl: "https://evil.example/x.png" },
        ],
      },
      existing
    );

    expect(patch.items).toHaveLength(3);
    expect(patch.items?.[2]).toMatchObject({
      name: "Cherry",
      imageKey: null,
      imageUrl: null,
    });
    expect(patch.items?.[2].id).not.toBe("");
  });

  it("refuses two items with the same name instead of dropping one", () => {
    expect(() =>
      parseCategoryPatch(
        {
          items: [
            { id: "a", name: "Apple" },
            { id: "b", name: "apple" },
          ],
        },
        existing
      )
    ).toThrow(InvalidInput);
  });

  it("refuses a patch that changes nothing", () => {
    expect(() => parseCategoryPatch({}, existing)).toThrow(InvalidInput);
  });

  it("refuses a name that is too short", () => {
    expect(() => parseCategoryPatch({ name: " " }, existing)).toThrow(
      InvalidInput
    );
  });
});

describe("the dev repo", () => {
  let workdir: string;
  let previousCwd: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    workdir = await mkdtemp(path.join(tmpdir(), "floor-edit-own-"));
    process.chdir(workdir);
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await rm(workdir, { recursive: true, force: true });
  });

  /** Fresh module per test: the repo memoises and captures the cwd. */
  const load = async () => {
    vi.resetModules();
    const db = await import("../lib/community/db");
    return { repo: db.repo(), toOwnRow: db.toOwnRow };
  };

  it("renames a category and its slug without touching the items", async () => {
    const { repo } = await load();
    const created = await repo.create({
      name: "Fruit",
      items: existing,
      authorKey: "me",
    });

    const renamed = await repo.rename(created.id, "Fruits of the World");

    expect(renamed).toMatchObject({
      name: "Fruits of the World",
      slug: "fruits-of-the-world",
      items: existing,
      authorKey: "me",
    });
    expect((await repo.get(created.id))?.name).toBe("Fruits of the World");
  });

  it("answers undefined for a category that isn't there", async () => {
    const { repo } = await load();
    expect(await repo.rename("nope", "Anything")).toBeUndefined();
  });

  it("lists an author's drafts and published categories, and nobody else's", async () => {
    const { repo, toOwnRow } = await load();
    const draft = await repo.create({
      name: "Mine, unfinished",
      items: existing,
      authorKey: "me",
    });
    const live = await repo.create({
      name: "Mine, live",
      items: existing,
      authorKey: "me",
    });
    await repo.publish(live.id);
    await repo.create({ name: "Theirs", items: existing, authorKey: "them" });

    const rows = (await repo.listByAuthor("me")).map(toOwnRow);

    expect(rows.map((row) => row.id).sort()).toEqual([draft.id, live.id].sort());
    expect(rows.find((row) => row.id === draft.id)?.status).toBe("draft");
    expect(rows.find((row) => row.id === live.id)?.status).toBe("published");
    // The author's own list must not carry the admin's numbers or the key.
    for (const row of rows) {
      expect(row).not.toHaveProperty("reportCount");
      expect(row).not.toHaveProperty("authorKey");
    }
  });
});
