/**
 * Mirror public/images into the R2 bucket so production serves the curated
 * category images from R2 instead of from Vercel.
 *
 * Every image a round shows is a CDN request and its bytes are Fast Data
 * Transfer, both metered on Vercel. R2 charges nothing for egress, so the same
 * files cost nothing there. public/images stays the source of truth -- it is
 * what contributors edit, what the tests check and what local dev serves --
 * and this copies it across as part of `npm run build`.
 *
 * Runs only for production builds on Vercel (VERCEL_ENV=production) with
 * R2_PUBLIC_BASE_URL set: exactly the builds where next.config.ts points image
 * URLs at R2. Preview builds keep serving from /images so a pull request can
 * never overwrite an image production is showing. Any failure fails the build,
 * because a deployment pointing at images that never arrived is worse than no
 * deployment.
 *
 * Uploads only what is missing or changed, comparing each file's MD5 with the
 * object's ETag (which is the MD5 for a single-part upload), so an unchanged
 * build costs one listing and no uploads. Objects are never deleted: an older
 * deployment, or an instant rollback, may still reference them.
 *
 *   node scripts/sync-curated-images.mjs            # what `npm run build` runs
 *   node --env-file=.env.local scripts/sync-curated-images.mjs --force
 *                                                    # sync from anywhere
 *   ... --dry-run                                    # report, upload nothing
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { AwsClient } from "aws4fetch";

const ROOT = path.join(process.cwd(), "public");
const PREFIX = "images/";
const CONCURRENCY = 8;
const ATTEMPTS = 3;
const CACHE_CONTROL = "public, max-age=604800";
const FORCE = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");

const CONTENT_TYPES = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const env = (name) => process.env[name]?.trim() || undefined;

if (!FORCE && (env("VERCEL_ENV") !== "production" || !env("R2_PUBLIC_BASE_URL"))) {
  console.log("[curated-images] not a production build with R2; serving from /images");
  process.exit(0);
}

const REQUIRED = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"];
const missing = REQUIRED.filter((name) => !env(name));
if (missing.length) {
  console.error(
    `[curated-images] R2_PUBLIC_BASE_URL is set, so images will load from R2, ` +
      `but the upload needs: ${missing.join(", ")}`
  );
  process.exit(1);
}

const client = new AwsClient({
  accessKeyId: env("R2_ACCESS_KEY_ID"),
  region: "auto",
  secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
  service: "s3",
});

const bucketUrl = `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com/${env("R2_BUCKET")}`;
const objectUrl = (key) =>
  `${bucketUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;

const decodeXml = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Every object under PREFIX, as key -> MD5 (unquoted ETag). */
async function listRemote() {
  const etags = new Map();
  let token;

  do {
    const url = new URL(bucketUrl);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("prefix", PREFIX);
    url.searchParams.set("max-keys", "1000");
    if (token) url.searchParams.set("continuation-token", token);

    const response = await client.fetch(url.toString());
    if (!response.ok) {
      throw new Error(`R2 refused the listing (HTTP ${response.status})`);
    }
    const xml = await response.text();

    // Block by block, for the reason given in lib/community/storage.ts.
    for (const chunk of xml.split("<Contents>").slice(1)) {
      const block = chunk.split("</Contents>")[0];
      const key = block.match(/<Key>([^<]+)<\/Key>/)?.[1];
      const etag = block.match(/<ETag>([^<]+)<\/ETag>/)?.[1];
      if (key && etag) {
        etags.set(decodeXml(key), decodeXml(etag).replace(/"/g, ""));
      }
    }

    token = /<IsTruncated>true<\/IsTruncated>/.test(xml)
      ? xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1]
      : undefined;
  } while (token);

  return etags;
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

async function upload(file) {
  const body = new Uint8Array(fs.readFileSync(file.full));
  const contentType =
    CONTENT_TYPES[path.extname(file.full).toLowerCase()] ?? "application/octet-stream";

  for (let attempt = 1; ; attempt++) {
    const response = await client.fetch(objectUrl(file.key), {
      body,
      headers: {
        "Cache-Control": CACHE_CONTROL,
        "Content-Length": String(body.byteLength),
        "Content-Type": contentType,
      },
      method: "PUT",
    });
    if (response.ok) return;

    const detail = await response.text().catch(() => "");
    if (attempt >= ATTEMPTS) {
      throw new Error(`R2 rejected ${file.key} (HTTP ${response.status}): ${detail}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
  }
}

/** Run `fn` over `items`, `limit` at a time. */
async function mapPool(items, limit, fn) {
  let cursor = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (cursor < items.length) await fn(items[cursor++]);
    })
  );
}

const started = Date.now();
const remote = await listRemote();

const local = walk(path.join(ROOT, "images"))
  .filter((full) => !path.basename(full).startsWith("."))
  .map((full) => ({
    full,
    key: path.relative(ROOT, full).split(path.sep).join("/"),
    md5: createHash("md5").update(fs.readFileSync(full)).digest("hex"),
  }));

const pending = local.filter((file) => remote.get(file.key) !== file.md5);
const bytes = pending.reduce((sum, file) => sum + fs.statSync(file.full).size, 0);

console.log(
  `[curated-images] ${local.length} local, ${remote.size} in R2, ` +
    `${pending.length} to upload (${(bytes / 1048576).toFixed(1)} MB)` +
    (DRY_RUN ? " -- dry run" : "")
);

if (!DRY_RUN) {
  let done = 0;
  await mapPool(pending, CONCURRENCY, async (file) => {
    await upload(file);
    done++;
    if (done % 250 === 0) console.log(`[curated-images] ${done}/${pending.length}`);
  });
  console.log(
    `[curated-images] synced in ${((Date.now() - started) / 1000).toFixed(1)}s`
  );
}
