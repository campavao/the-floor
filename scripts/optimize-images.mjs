/**
 * Shrink the images in public/images to something sensible to serve.
 *
 * The originals were straight camera or download resolution -- one Pop Divas
 * shot was 4024x6048 and 28 MB, for a picture the game never renders larger
 * than a screen. Every byte of that goes over Vercel's data transfer
 * allowance, and the projector loads several images per round.
 *
 * This caps the longest edge and re-encodes, keeping the original file format
 * so nothing in app/data.ts has to change.
 *
 * 2048px is deliberate rather than "as small as possible". The projector
 * renders `h-full w-auto max-w-full`, so on a 1080p screen an image can be
 * asked to fill 1920px of width. 2048 clears that, so nothing is ever
 * upscaled on a normal display.
 *
 * Safe to re-run: an image is only rewritten when the result is actually
 * smaller, so already-optimised files are left untouched.
 *
 *   node scripts/optimize-images.mjs           # rewrite images in place
 *   node scripts/optimize-images.mjs --dry-run # report what would change
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// libvips keeps decoded inputs (and their file handles) in an operation
// cache. Since this script rewrites each file in place, a held handle means
// the next open fails -- on Windows that surfaces as "UNKNOWN: unknown
// error, open". Reading into a buffer first means no handle is ever held.
sharp.cache(false);

const ROOT = path.join(process.cwd(), "public", "images");
const MAX_EDGE = 2048;
const JPEG_QUALITY = 90;
const CONCURRENCY = 8;
const DRY_RUN = process.argv.includes("--dry-run");

const KNOWN = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const mb = (bytes) => (bytes / 1048576).toFixed(1);

/** Run `fn` over `items`, `limit` at a time. */
async function mapPool(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        out[index] = await fn(items[index], index);
      }
    })
  );
  return out;
}

/**
 * Re-encode into the same container the file already uses, so the filename
 * never changes. Keyed on the format sniffed from the bytes rather than the
 * extension: a few files are JPEGs named .png, and re-encoding those as real
 * PNGs would balloon them.
 */
function encode(pipeline, format) {
  if (format === "png") {
    // Palette quantisation is lossy but at quality 95 it is invisible on this
    // kind of artwork and dramatically smaller. If it somehow comes out
    // larger, the caller keeps the original anyway.
    return pipeline.png({ compressionLevel: 9, effort: 7, palette: true, quality: 95 }).toBuffer();
  }
  if (format === "webp") return pipeline.webp({ quality: 82 }).toBuffer();
  if (format === "gif") return pipeline.gif().toBuffer();
  return pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
}

const files = walk(ROOT);
const problems = [];
const wins = [];
let done = 0;

const results = await mapPool(files, CONCURRENCY, async (file) => {
  const ext = path.extname(file).toLowerCase();
  const original = fs.statSync(file).size;

  if (++done % 250 === 0) process.stderr.write(`  ...${done}/${files.length}\n`);

  if (!KNOWN.has(ext)) {
    problems.push(`${path.relative(ROOT, file)} :: not an image, left alone`);
    return { before: original, after: original };
  }

  try {
    const input = fs.readFileSync(file);
    const meta = await sharp(input).metadata();
    const output = await encode(
      sharp(input).rotate().resize(MAX_EDGE, MAX_EDGE, {
        fit: "inside",
        withoutEnlargement: true,
      }),
      meta.format
    );

    // Re-running must be a no-op, so an image that is already within the cap
    // is only rewritten when that actually saves bytes. An oversized one is
    // always rewritten: the point is the dimension cap, and a handful of
    // images re-encode very slightly larger while shedding most of their
    // pixels.
    const oversized = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE;
    if (!oversized && output.length >= original) {
      return { before: original, after: original };
    }

    if (!DRY_RUN) fs.writeFileSync(file, output);
    wins.push({
      file: path.relative(ROOT, file).split(path.sep).join("/"),
      original,
      output: output.length,
      dims: `${meta.width}x${meta.height}`,
    });
    return { before: original, after: output.length };
  } catch (error) {
    problems.push(`${path.relative(ROOT, file)} :: ${error.message}`);
    return { before: original, after: original };
  }
});

const before = results.reduce((sum, r) => sum + r.before, 0);
const after = results.reduce((sum, r) => sum + r.after, 0);

console.log(DRY_RUN ? "\nDRY RUN -- nothing written\n" : "");
console.log(`images        ${files.length}`);
console.log(`rewritten     ${wins.length}`);
console.log(`left as-is    ${files.length - wins.length - problems.length}`);
console.log(`before        ${mb(before)} MB`);
console.log(`after         ${mb(after)} MB`);
console.log(
  `saved         ${mb(before - after)} MB  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`
);

if (wins.length) {
  console.log("\nbiggest reductions:");
  wins
    .sort((a, b) => b.original - b.output - (a.original - a.output))
    .slice(0, 10)
    .forEach((w) =>
      console.log(
        `  ${mb(w.original).padStart(6)} MB -> ${mb(w.output).padStart(5)} MB  ${w.dims.padEnd(11)} ${w.file}`
      )
    );
}

if (problems.length) {
  console.log(`\nnot processed (${problems.length}):`);
  problems.forEach((p) => console.log(`  ${p}`));
}
