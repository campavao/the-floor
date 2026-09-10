/**
 * Erasing text, logos and watermarks out of a photo, in the browser.
 *
 * The approach is the one OpenCV calls INPAINT_TELEA, simplified: walk inward
 * from the edge of the painted region one ring at a time, and give each pixel a
 * distance-weighted average of the neighbours that are already known. Because
 * it only ever reads from *outside* the mask (or from pixels already
 * reconstructed), the thing being erased never contributes to its own
 * replacement.
 *
 * That is the whole difference from averaging or blurring the masked area,
 * which smears the watermark rather than removing it -- you get a grey ghost in
 * the shape of the logo. This propagates the surrounding image inward instead.
 *
 * It's very good on the backgrounds watermarks usually sit on (sky, skin,
 * gradients, blurred bokeh) and only passable across hard edges or strong
 * texture, which is why the editor also offers a crop -- often the better tool.
 */

export type InpaintOptions = {
  /** How far to grow the mask first. Brush edges are soft; this catches halos. */
  dilate?: number;
  /** Neighbourhood radius sampled for each pixel. */
  radius?: number;
};

const DEFAULTS = { dilate: 2, radius: 4 } as const;

/** Grows the mask by `amount` pixels using a square structuring element. */
export function dilateMask(
  mask: Uint8Array,
  width: number,
  height: number,
  amount: number
): Uint8Array {
  if (amount <= 0) return mask;

  let current = mask;
  for (let pass = 0; pass < amount; pass += 1) {
    const next = new Uint8Array(current.length);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (current[y * width + x]) {
          next[y * width + x] = 1;
          continue;
        }
        // 4-neighbourhood is enough per pass and keeps corners from ballooning.
        if (
          (x > 0 && current[y * width + x - 1]) ||
          (x < width - 1 && current[y * width + x + 1]) ||
          (y > 0 && current[(y - 1) * width + x]) ||
          (y < height - 1 && current[(y + 1) * width + x])
        ) {
          next[y * width + x] = 1;
        }
      }
    }
    current = next;
  }
  return current;
}

/**
 * Orders every masked pixel by how many rings it sits inside the mask, so the
 * fill can work from the boundary inward. Ring 1 touches known pixels.
 */
const ringsInward = (
  mask: Uint8Array,
  width: number,
  height: number
): number[][] => {
  const depth = new Int32Array(mask.length).fill(-1);
  const rings: number[][] = [];

  let frontier: number[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!mask[index]) continue;

      // Only an in-bounds unmasked neighbour counts. The image border is not a
      // source of colour, so a mask running off the edge starts its rings from
      // whichever side actually has pixels to copy from.
      const touchesKnown =
        (x > 0 && !mask[index - 1]) ||
        (x < width - 1 && !mask[index + 1]) ||
        (y > 0 && !mask[index - width]) ||
        (y < height - 1 && !mask[index + width]);

      if (touchesKnown) {
        depth[index] = 0;
        frontier.push(index);
      }
    }
  }

  while (frontier.length > 0) {
    rings.push(frontier);
    const next: number[] = [];

    for (const index of frontier) {
      const x = index % width;
      const y = (index - x) / width;

      const neighbours = [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y < height - 1 ? index + width : -1,
      ];

      for (const neighbour of neighbours) {
        if (neighbour < 0) continue;
        if (!mask[neighbour] || depth[neighbour] !== -1) continue;
        depth[neighbour] = depth[index] + 1;
        next.push(neighbour);
      }
    }

    frontier = next;
  }

  return rings;
};

/**
 * Fills every pixel marked in `mask` from its surroundings.
 *
 * `pixels` is RGBA, modified in place and also returned. `mask` is one byte per
 * pixel; non-zero means "erase this".
 */
export function inpaint(
  pixels: Uint8ClampedArray,
  mask: Uint8Array,
  width: number,
  height: number,
  options: InpaintOptions = {}
): Uint8ClampedArray {
  const radius = Math.max(1, options.radius ?? DEFAULTS.radius);

  // Callers that already grew the mask pass `dilate: 0` so it isn't grown twice.
  const grown = dilateMask(
    mask,
    width,
    height,
    options.dilate ?? DEFAULTS.dilate
  );
  if (!grown.some(Boolean)) return pixels;

  // `known` starts as the untouched image and gains pixels as we fill inward,
  // so later rings can build on earlier ones.
  const known = new Uint8Array(grown.length);
  for (let i = 0; i < grown.length; i += 1) known[i] = grown[i] ? 0 : 1;

  for (const ring of ringsInward(grown, width, height)) {
    // Read every pixel in a ring before writing any, so pixels in the same ring
    // don't seed each other and drag the fill sideways.
    const writes: Array<[number, number, number, number, number]> = [];

    for (const index of ring) {
      const x = index % width;
      const y = (index - x) / width;

      let totalWeight = 0;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let dy = -radius; dy <= radius; dy += 1) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;

        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          if (dx === 0 && dy === 0) continue;

          const neighbour = ny * width + nx;
          if (!known[neighbour]) continue;

          // Inverse square distance: near pixels dominate, so a gradient keeps
          // its direction instead of flattening to the local mean.
          const weight = 1 / (dx * dx + dy * dy);
          const offset = neighbour * 4;

          totalWeight += weight;
          r += pixels[offset] * weight;
          g += pixels[offset + 1] * weight;
          b += pixels[offset + 2] * weight;
          a += pixels[offset + 3] * weight;
        }
      }

      if (totalWeight > 0) {
        writes.push([
          index,
          r / totalWeight,
          g / totalWeight,
          b / totalWeight,
          a / totalWeight,
        ]);
      }
    }

    for (const [index, r, g, b, a] of writes) {
      const offset = index * 4;
      pixels[offset] = r;
      pixels[offset + 1] = g;
      pixels[offset + 2] = b;
      pixels[offset + 3] = a;
      known[index] = 1;
    }
  }

  return pixels;
}

/**
 * Softens the seam where the filled region meets the original, which is where
 * the repair is most visible. Only touches pixels inside the mask.
 */
export function smoothWithin(
  pixels: Uint8ClampedArray,
  mask: Uint8Array,
  width: number,
  height: number,
  passes = 1
): Uint8ClampedArray {
  for (let pass = 0; pass < passes; pass += 1) {
    const source = new Uint8ClampedArray(pixels);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        if (!mask[index]) continue;

        let count = 0;
        const sums = [0, 0, 0, 0];

        for (let dy = -1; dy <= 1; dy += 1) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) continue;
          for (let dx = -1; dx <= 1; dx += 1) {
            const nx = x + dx;
            if (nx < 0 || nx >= width) continue;

            const offset = (ny * width + nx) * 4;
            sums[0] += source[offset];
            sums[1] += source[offset + 1];
            sums[2] += source[offset + 2];
            sums[3] += source[offset + 3];
            count += 1;
          }
        }

        const offset = index * 4;
        for (let channel = 0; channel < 4; channel += 1) {
          pixels[offset + channel] = sums[channel] / count;
        }
      }
    }
  }

  return pixels;
}

/** The whole repair: grow the mask, fill inward, then soften the seam. */
export function eraseRegion(
  pixels: Uint8ClampedArray,
  mask: Uint8Array,
  width: number,
  height: number,
  options: InpaintOptions = {}
): Uint8ClampedArray {
  const grown = dilateMask(
    mask,
    width,
    height,
    options.dilate ?? DEFAULTS.dilate
  );

  inpaint(pixels, grown, width, height, { ...options, dilate: 0 });
  return smoothWithin(pixels, grown, width, height, 1);
}
