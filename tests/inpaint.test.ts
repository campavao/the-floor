import { describe, expect, it } from "vitest";

import {
  dilateMask,
  eraseRegion,
  inpaint,
  smoothWithin,
} from "../lib/community/inpaint";

type Rgb = [number, number, number];

/** A solid image, so anything that leaks through the fill is obvious. */
const solid = (width: number, height: number, colour: Rgb) => {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    pixels[i * 4] = colour[0];
    pixels[i * 4 + 1] = colour[1];
    pixels[i * 4 + 2] = colour[2];
    pixels[i * 4 + 3] = 255;
  }
  return pixels;
};

const paint = (
  pixels: Uint8ClampedArray,
  width: number,
  rect: { x: number; y: number; w: number; h: number },
  colour: Rgb
) => {
  for (let y = rect.y; y < rect.y + rect.h; y += 1) {
    for (let x = rect.x; x < rect.x + rect.w; x += 1) {
      const offset = (y * width + x) * 4;
      pixels[offset] = colour[0];
      pixels[offset + 1] = colour[1];
      pixels[offset + 2] = colour[2];
    }
  }
};

const maskRect = (
  width: number,
  height: number,
  rect: { x: number; y: number; w: number; h: number }
) => {
  const mask = new Uint8Array(width * height);
  for (let y = rect.y; y < rect.y + rect.h; y += 1) {
    for (let x = rect.x; x < rect.x + rect.w; x += 1) {
      mask[y * width + x] = 1;
    }
  }
  return mask;
};

const at = (pixels: Uint8ClampedArray, width: number, x: number, y: number): Rgb => {
  const offset = (y * width + x) * 4;
  return [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
};

describe("erasing a watermark", () => {
  const W = 40;
  const H = 40;
  const BACKGROUND: Rgb = [30, 90, 200];
  const WATERMARK: Rgb = [255, 255, 255];
  const rect = { x: 15, y: 15, w: 10, h: 10 };

  it("replaces the mark with the surrounding image, not a blend of itself", () => {
    const pixels = solid(W, H, BACKGROUND);
    paint(pixels, W, rect, WATERMARK);

    eraseRegion(pixels, maskRect(W, H, rect), W, H);

    // Dead centre is the hardest pixel -- furthest from any real image data.
    const [r, g, b] = at(pixels, W, 20, 20);
    expect(Math.abs(r - BACKGROUND[0])).toBeLessThan(6);
    expect(Math.abs(g - BACKGROUND[1])).toBeLessThan(6);
    expect(Math.abs(b - BACKGROUND[2])).toBeLessThan(6);
  });

  it("beats blurring the masked area", () => {
    // The previous tool averaged the masked pixels together, which keeps the
    // watermark's own brightness in the result. This is that comparison.
    const inpainted = solid(W, H, BACKGROUND);
    paint(inpainted, W, rect, WATERMARK);
    eraseRegion(inpainted, maskRect(W, H, rect), W, H);

    const blurred = solid(W, H, BACKGROUND);
    paint(blurred, W, rect, WATERMARK);
    smoothWithin(blurred, maskRect(W, H, rect), W, H, 6);

    const error = (pixels: Uint8ClampedArray) =>
      Math.abs(at(pixels, W, 20, 20)[0] - BACKGROUND[0]);

    expect(error(inpainted)).toBeLessThan(error(blurred));
  });

  it("leaves everything outside the mask untouched", () => {
    const pixels = solid(W, H, BACKGROUND);
    paint(pixels, W, rect, WATERMARK);
    paint(pixels, W, { x: 0, y: 0, w: 5, h: 5 }, [10, 10, 10]);

    eraseRegion(pixels, maskRect(W, H, rect), W, H);

    expect(at(pixels, W, 2, 2)).toEqual([10, 10, 10]);
    expect(at(pixels, W, 39, 39)).toEqual(BACKGROUND);
  });

  it("carries a gradient through the hole rather than flattening it", () => {
    const pixels = new Uint8ClampedArray(W * H * 4);
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        const offset = (y * W + x) * 4;
        // Horizontal ramp: 0 on the left, ~255 on the right.
        pixels[offset] = Math.round((x / (W - 1)) * 255);
        pixels[offset + 1] = 128;
        pixels[offset + 2] = 128;
        pixels[offset + 3] = 255;
      }
    }
    paint(pixels, W, rect, [255, 0, 0]);

    eraseRegion(pixels, maskRect(W, H, rect), W, H);

    const left = at(pixels, W, 16, 20)[0];
    const right = at(pixels, W, 23, 20)[0];
    expect(right).toBeGreaterThan(left);
  });

  it("copes with a mask running off the edge of the image", () => {
    const pixels = solid(W, H, BACKGROUND);
    const edge = { x: 0, y: 0, w: 6, h: 6 };
    paint(pixels, W, edge, WATERMARK);

    expect(() => eraseRegion(pixels, maskRect(W, H, edge), W, H)).not.toThrow();

    const [r] = at(pixels, W, 1, 1);
    expect(Math.abs(r - BACKGROUND[0])).toBeLessThan(20);
  });

  it("does nothing when the mask is empty", () => {
    const pixels = solid(W, H, BACKGROUND);
    const before = new Uint8ClampedArray(pixels);

    inpaint(pixels, new Uint8Array(W * H), W, H);

    expect(Array.from(pixels)).toEqual(Array.from(before));
  });
});

describe("dilateMask", () => {
  it("grows by one ring per pass", () => {
    const mask = new Uint8Array(9);
    mask[4] = 1; // centre of a 3x3

    expect(dilateMask(mask, 3, 3, 0)).toBe(mask);
    expect(Array.from(dilateMask(mask, 3, 3, 1))).toEqual([
      0, 1, 0, 1, 1, 1, 0, 1, 0,
    ]);
    expect(Array.from(dilateMask(mask, 3, 3, 2))).toEqual([
      1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]);
  });

  it("does not mutate the mask it was given", () => {
    const mask = new Uint8Array([0, 1, 0, 0]);
    dilateMask(mask, 2, 2, 1);
    expect(Array.from(mask)).toEqual([0, 1, 0, 0]);
  });
});
