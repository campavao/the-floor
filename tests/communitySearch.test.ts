import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * Search runs on the server so it reaches past the first page of results.
 * Exercised against the dev repo, which keeps its data in the working
 * directory.
 */

let workdir: string;
let previousCwd: string;

beforeEach(async () => {
  previousCwd = process.cwd();
  workdir = await mkdtemp(path.join(tmpdir(), "floor-search-"));
  process.chdir(workdir);
});

afterEach(async () => {
  process.chdir(previousCwd);
  await rm(workdir, { recursive: true, force: true });
});

const load = async () => {
  vi.resetModules();
  const db = await import("../lib/community/db");
  return db.repo();
};

const names = (rows: Array<{ name: string }>) => rows.map((row) => row.name).sort();

describe("searching community categories", () => {
  it("matches part of the name, ignoring case, among published ones only", async () => {
    const repo = await load();

    for (const name of ["NBA Teams", "NFL Teams", "Board Games"]) {
      const created = await repo.create({ authorKey: "a", items: [], name });
      await repo.publish(created.id);
    }
    await repo.create({ authorKey: "a", items: [], name: "Draft Teams" });

    const found = await repo.list({ limit: 24, offset: 0, query: "teams", sort: "top" });
    expect(names(found)).toEqual(["NBA Teams", "NFL Teams"]);
  });

  it("treats a blank search as no search", async () => {
    const repo = await load();

    for (const name of ["Alpha", "Beta"]) {
      const created = await repo.create({ authorKey: "a", items: [], name });
      await repo.publish(created.id);
    }

    const found = await repo.list({ limit: 24, offset: 0, query: "   ", sort: "new" });
    expect(names(found)).toEqual(["Alpha", "Beta"]);
  });

  it("pages within the results rather than the whole pool", async () => {
    const repo = await load();

    for (const name of ["Cat 1", "Dog 1", "Cat 2", "Dog 2", "Cat 3"]) {
      const created = await repo.create({ authorKey: "a", items: [], name });
      await repo.publish(created.id);
    }

    const first = await repo.list({ limit: 2, offset: 0, query: "cat", sort: "top" });
    const second = await repo.list({ limit: 2, offset: 2, query: "cat", sort: "top" });

    expect(first).toHaveLength(2);
    expect(names([...first, ...second])).toEqual(["Cat 1", "Cat 2", "Cat 3"]);
  });
});
