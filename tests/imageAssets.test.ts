import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { IMAGES_DIR, listImageFiles } from "./helpers/publicImages";

/**
 * Ceilings for anything committed to public/images.
 *
 * The projector renders `h-full w-auto max-w-full`, so a 1080p screen can ask
 * for 1920px of width -- 2048 covers that without ever upscaling. Anything
 * beyond it is bytes nobody sees, paid for on every load.
 */
const MAX_EDGE = 2048;
const MAX_BYTES = 3 * 1024 * 1024;

/** Formats a browser will actually render. */
const WEB_FORMATS = new Set(["jpeg", "png", "webp", "gif", "avif"]);

// Note: ~66 files have an extension that disagrees with their contents,
// mostly JPEGs named .png. Browsers sniff image bytes so these render fine,
// and correcting them would mean either renaming files (and every reference
// in data.ts) or re-encoding photos as real PNGs, which would make them far
// larger. Left alone deliberately -- what matters is that they decode, which
// the tests above cover.

type Probe = {
  file: string;
  bytes: number;
  format?: string;
  width?: number;
  height?: number;
  error?: string;
};

const probes: Probe[] = await Promise.all(
  listImageFiles().map(async (file): Promise<Probe> => {
    const full = path.join(IMAGES_DIR, file);
    const bytes = fs.statSync(full).size;
    try {
      const meta = await sharp(full).metadata();
      return {
        file,
        bytes,
        format: meta.format,
        width: meta.width,
        height: meta.height,
      };
    } catch (error) {
      return { file, bytes, error: (error as Error).message };
    }
  })
);

describe("everything in public/images is a usable web image", () => {
  it("decodes", () => {
    // public/images/disney-characters/cinderella.jpg was a JPEG XL codestream
    // wearing a .jpg name. It existed, so a file-exists check passed it, but
    // Chrome cannot decode JPEG XL and it rendered as a broken image.
    const undecodable = probes
      .filter((p) => p.error)
      .map((p) => `${p.file} :: ${p.error}`);

    expect(undecodable, "not decodable as an image").toEqual([]);
  });

  it("is in a format browsers render", () => {
    const unsupported = probes
      .filter((p) => p.format && !WEB_FORMATS.has(p.format))
      .map((p) => `${p.file} :: ${p.format}`);

    expect(unsupported).toEqual([]);
  });
});

describe("images are sized for the screen, not the camera", () => {
  it(`has no image longer than ${MAX_EDGE}px on either edge`, () => {
    const huge = probes
      .filter((p) => Math.max(p.width ?? 0, p.height ?? 0) > MAX_EDGE)
      .map((p) => `${p.file} :: ${p.width}x${p.height}`)
      .sort();

    expect(
      huge,
      `Run: node scripts/optimize-images.mjs -- it caps the longest edge at ${MAX_EDGE}px in place.`
    ).toEqual([]);
  });

  it(`has no image heavier than ${MAX_BYTES / 1024 / 1024} MB`, () => {
    const heavy = probes
      .filter((p) => p.bytes > MAX_BYTES)
      .map((p) => `${p.file} :: ${(p.bytes / 1048576).toFixed(1)} MB`)
      .sort();

    expect(
      heavy,
      "Run: node scripts/optimize-images.mjs before committing large artwork."
    ).toEqual([]);
  });
});
