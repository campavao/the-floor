import fs from "node:fs";
import path from "node:path";

export const PUBLIC_DIR = path.join(process.cwd(), "public");
export const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

/**
 * Every file under `dir`, as POSIX-style paths relative to it, with the exact
 * casing the filesystem reports.
 *
 * We read directories rather than asking `fs.existsSync` whether a specific
 * path exists. On Windows and macOS the filesystem is case-insensitive, so
 * `existsSync("images/fruits/apple.png")` happily returns true even when the
 * file is really `images/Fruits/Apples.png` -- which is precisely the bug this
 * suite exists to catch. Vercel builds on case-sensitive Linux, so that
 * mismatch is a production 404 that never reproduces locally.
 *
 * Comparing against real directory entries makes these tests behave the same
 * on a laptop as they do in CI.
 */
export function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];

  const walk = (current: string, prefix: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(current, entry.name), rel);
      } else {
        out.push(rel);
      }
    }
  };

  if (fs.existsSync(dir)) walk(dir, "");
  return out.sort();
}

/** Immediate subdirectory names of `dir`, exact case. */
export function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

/** Every image path under public/images, e.g. "fruits/apple.png". */
export function listImageFiles(): string[] {
  return listFilesRecursive(IMAGES_DIR);
}

/** Category folder names under public/images, e.g. "fruits". */
export function listImageFolders(): string[] {
  return listDirs(IMAGES_DIR);
}

/**
 * Paths that differ only by case. Git can hold both, but a Windows or macOS
 * working tree cannot -- checkout silently drops one and reports the other as
 * deleted. Pure so it can be exercised with synthetic input on any platform.
 */
export function findCaseCollisions(paths: string[]): string[] {
  const seen = new Map<string, string>();
  const collisions: string[] = [];

  for (const p of paths) {
    const key = p.toLowerCase();
    const first = seen.get(key);
    if (first && first !== p) collisions.push(`${first} <-> ${p}`);
    else seen.set(key, p);
  }

  return collisions;
}
