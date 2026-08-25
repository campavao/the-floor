import { describe, expect, it } from "vitest";

import {
  CATEGORY_METADATA,
  type ImageExample,
  type TextExample,
} from "../app/data";
import {
  PUBLIC_DIR,
  findCaseCollisions,
  listFilesRecursive,
  listImageFiles,
  listImageFolders,
} from "./helpers/publicImages";

type Example = ImageExample | TextExample;

const entries = Object.entries(CATEGORY_METADATA) as Array<
  [string, (typeof CATEGORY_METADATA)[keyof typeof CATEGORY_METADATA]]
>;

const isImageExample = (e: Example): e is ImageExample =>
  "image" in e && typeof e.image === "string";

const isTextExample = (e: Example): e is TextExample =>
  "text" in e && typeof e.text === "string";

/** Categories that show pictures, as opposed to text prompts like Math. */
const imageCategories = entries.filter(([, meta]) =>
  (meta.examples as Example[]).some(isImageExample)
);

/** Categories that show a written prompt, like Math or Time Tables. */
const textCategories = entries.filter(([, meta]) =>
  (meta.examples as Example[]).some(isTextExample)
);

/** Every "<folder>/<image>" a category asks the browser to load. */
const imageRefs = imageCategories.flatMap(([category, meta]) =>
  (meta.examples as Example[]).filter(isImageExample).map((example) => ({
    category,
    ref: `${meta.folder}/${example.image}`,
  }))
);

describe("category images resolve on a case-sensitive filesystem", () => {
  // Vercel builds on Linux. Windows and macOS are case-insensitive, so a
  // mismatch between data.ts and the files on disk looks fine locally and
  // 404s only in production. These checks compare against real directory
  // entries rather than asking fs.existsSync, so they fail identically
  // everywhere -- including on the maintainer's Windows machine.

  it("every image category has a folder in public/images with matching case", () => {
    const folders = new Set(listImageFolders());
    const missing = imageCategories
      .filter(([, meta]) => !folders.has(meta.folder))
      .map(([category, meta]) => `${category} -> public/images/${meta.folder}`);

    expect(missing, "folder not found -- check the exact casing").toEqual([]);
  });

  it("every referenced image exists with that exact filename", () => {
    const onDisk = new Set(listImageFiles());
    const broken = imageRefs
      .filter(({ ref }) => !onDisk.has(ref))
      .map(({ category, ref }) => `${category}: public/images/${ref}`)
      .sort();

    expect(
      broken,
      "Referenced in app/data.ts but not on disk under that exact name. " +
        "Add the file or fix the reference -- a filename that differs only " +
        "by case still 404s on Vercel."
    ).toEqual([]);
  });

  it("has no paths under public/ that differ only by case", () => {
    // Two such paths cannot coexist in a Windows or macOS working tree, which
    // makes the repo impossible to check out cleanly and can silently stage
    // deletions. public/images/Fruits vs fruits used to do exactly this.
    expect(
      findCaseCollisions(listFilesRecursive(PUBLIC_DIR)),
      "case-colliding paths under public/"
    ).toEqual([]);
  });

  it("would flag a Fruits/fruits style collision", () => {
    // A Windows or macOS filesystem cannot physically hold both paths, so the
    // check above can never fail locally. Exercise the detector directly to
    // prove it still works everywhere.
    expect(
      findCaseCollisions([
        "images/fruits/apple.png",
        "images/Fruits/apple.png",
      ])
    ).toEqual(["images/fruits/apple.png <-> images/Fruits/apple.png"]);
    expect(findCaseCollisions(["a/b.png", "a/c.png"])).toEqual([]);
  });
});

describe("category metadata is well formed", () => {
  it.each(entries)("%s has a name, folder and examples", (_category, meta) => {
    expect(meta.name.trim()).not.toBe("");
    expect(meta.folder.trim()).not.toBe("");
    expect(meta.examples.length).toBeGreaterThan(0);
  });

  it("uses lowercase kebab-case folder names", () => {
    // The convention documented on the contribute page.
    const offenders = entries
      .filter(([, meta]) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.folder))
      .map(([category, meta]) => `${category} -> "${meta.folder}"`);

    expect(offenders).toEqual([]);
  });

  it("does not mix image and text examples within one category", () => {
    const mixed = entries
      .filter(([, meta]) => {
        const examples = meta.examples as Example[];
        return examples.some(isImageExample) && !examples.every(isImageExample);
      })
      .map(([category]) => category);

    expect(mixed, "a category must be all images or all text").toEqual([]);
  });

  it.each(imageCategories)(
    "%s has no duplicate example names",
    (_category, meta) => {
      const names = (meta.examples as Example[]).map((e) =>
        e.name.trim().toLowerCase()
      );
      expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
    }
  );

  it.each(textCategories)("%s asks each prompt only once", (_category, meta) => {
    // In a text category `name` is the answer, so it repeats by design --
    // Math reaches 9 four different ways. The prompt is what must be unique.
    const prompts = (meta.examples as Example[])
      .filter(isTextExample)
      .map((e) => e.text.trim().toLowerCase());
    expect(prompts.filter((p, i) => prompts.indexOf(p) !== i)).toEqual([]);
  });

  it.each(imageCategories)("%s reuses no image file", (_category, meta) => {
    const images = (meta.examples as Example[])
      .filter(isImageExample)
      .map((e) => e.image);
    expect(images.filter((img, i) => images.indexOf(img) !== i)).toEqual([]);
  });

  it.each(entries)("%s has usable example names", (_category, meta) => {
    const blank = (meta.examples as Example[]).filter(
      (e) => typeof e.name !== "string" || e.name.trim() === ""
    );
    expect(blank).toEqual([]);
  });

  it.each(entries)("%s has clean alternatives", (_category, meta) => {
    for (const example of meta.examples as Example[]) {
      expect(
        Array.isArray(example.alternatives),
        `${example.name}: alternatives must be an array`
      ).toBe(true);

      const alts = example.alternatives.map((a) => a.trim().toLowerCase());
      expect(
        alts.filter((a) => a === ""),
        `${example.name}: empty alternative`
      ).toEqual([]);
      expect(
        alts.filter((a, i) => alts.indexOf(a) !== i),
        `${example.name}: duplicate alternative`
      ).toEqual([]);
    }
  });
});

describe("the category registry", () => {
  it("has unique, non-empty keys", () => {
    const keys = Object.keys(CATEGORY_METADATA);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.filter((k) => k.trim() === "")).toEqual([]);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("points every entry at a distinct folder", () => {
    const folders = entries.map(([, meta]) => meta.folder);
    const dupes = folders.filter((f, i) => folders.indexOf(f) !== i);
    expect(dupes, "two categories share one folder").toEqual([]);
  });
});
