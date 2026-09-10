import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { AwsClient } from "aws4fetch";

import { NotConfigured, isProduction, r2Config } from "./config";

export type StoredObject = { key: string; uploadedAt: Date };

export type ImageStore = {
  /** Writes the object and returns the URL a browser should load it from. */
  put(key: string, body: Buffer, contentType: string): Promise<string>;
  remove(key: string): Promise<void>;
  /**
   * Everything in the store. Used by the cleanup job to find objects nothing
   * points at, so it must be complete -- a truncated listing is fine (those
   * objects are simply not considered) but a silently partial one is not.
   */
  list(): Promise<StoredObject[]>;
  describe(): string;
};

/**
 * Cloudflare R2 over its S3 API.
 *
 * R2 is the reason this feature can exist without a bill: 10 GB of storage on
 * the free tier and, unlike every other option, no egress charge at all. A
 * category is ~50 images at ~120 KB, so that's well over a thousand of them,
 * and the projector can pull images all night without moving the needle.
 *
 * aws4fetch rather than @aws-sdk/client-s3 -- it's a few KB and all we need is
 * a signed PUT and DELETE.
 */
const r2Store = (config: NonNullable<ReturnType<typeof r2Config>>): ImageStore => {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const objectUrl = (key: string) =>
    `${config.endpoint}/${config.bucket}/${encodeURI(key)}`;

  return {
    async put(key, body, contentType) {
      const bytes = new Uint8Array(body);

      const response = await client.fetch(objectUrl(key), {
        method: "PUT",
        body: bytes,
        // Next.js wraps global fetch, and the wrapper doesn't carry over the
        // Content-Length that plain fetch infers from a sized body -- so the
        // request goes out chunked and R2's S3 API rejects it with 411
        // MissingContentLength. Bare Node gets this right, which is why it
        // only shows up once the code runs inside a route.
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(bytes.byteLength),
          // Keys are content-hashed, so a given URL's bytes never change.
          "Cache-Control": "public, max-age=31536000, immutable",
        },
        // Uploads are not something to serve from a cache.
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `R2 rejected the upload (HTTP ${response.status}): ${await response
            .text()
            .catch(() => "")}`
        );
      }

      return `${config.publicBaseUrl}/${encodeURI(key)}`;
    },

    async remove(key) {
      // Best effort. A leaked object costs a fraction of a cent; failing a
      // user's save because cleanup didn't work is worse. The cleanup job
      // sweeps up whatever this misses.
      await client
        .fetch(objectUrl(key), { method: "DELETE" })
        .catch(() => undefined);
    },

    async list() {
      const objects: StoredObject[] = [];
      let token: string | undefined;

      do {
        const url = new URL(`${config.endpoint}/${config.bucket}`);
        url.searchParams.set("list-type", "2");
        url.searchParams.set("max-keys", "1000");
        if (token) url.searchParams.set("continuation-token", token);

        const response = await client.fetch(url.toString());
        if (!response.ok) {
          throw new Error(`R2 refused the listing (HTTP ${response.status})`);
        }

        const xml = await response.text();
        for (const entry of xml.matchAll(
          /<Contents>[\s\S]*?<Key>([^<]+)<\/Key>[\s\S]*?<LastModified>([^<]+)<\/LastModified>[\s\S]*?<\/Contents>/g
        )) {
          objects.push({ key: entry[1], uploadedAt: new Date(entry[2]) });
        }

        token = /<IsTruncated>true<\/IsTruncated>/.test(xml)
          ? xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1]
          : undefined;
      } while (token);

      return objects;
    },

    describe: () => `Cloudflare R2 (${config.bucket})`,
  };
};

/**
 * Writes into `public/community-dev/` so the whole flow works on a fresh clone
 * with no accounts and no env vars. Dev only -- see `imageStore()`.
 */
const localStore = (): ImageStore => {
  const root = path.join(process.cwd(), "public", "community-dev");
  const safe = (key: string) => {
    const resolved = path.resolve(root, key);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
      throw new Error(`Refusing to write outside the dev store: ${key}`);
    }
    return resolved;
  };

  return {
    async put(key, body) {
      const file = safe(key);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, body);
      return `/community-dev/${key}`;
    },

    async remove(key) {
      await unlink(safe(key)).catch(() => undefined);
    },

    async list() {
      const walk = async (dir: string): Promise<StoredObject[]> => {
        const entries = await readdir(dir, { withFileTypes: true }).catch(
          () => []
        );

        const found = await Promise.all(
          entries.map(async (entry) => {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) return walk(full);

            const info = await stat(full);
            return [
              {
                key: path.relative(root, full).split(path.sep).join("/"),
                uploadedAt: info.mtime,
              },
            ];
          })
        );

        return found.flat();
      };

      return walk(root);
    },

    describe: () => "local disk (public/community-dev)",
  };
};

let cached: ImageStore | undefined;

export const imageStore = (): ImageStore => {
  if (cached) return cached;

  const config = r2Config();
  if (config) {
    cached = r2Store(config);
    return cached;
  }

  if (isProduction()) {
    throw new NotConfigured(
      "Community image storage isn't set up on this deployment yet. It needs " +
        "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET " +
        "and R2_PUBLIC_BASE_URL."
    );
  }

  cached = localStore();
  return cached;
};
