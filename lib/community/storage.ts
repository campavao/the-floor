import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { AwsClient } from "aws4fetch";

import { NotConfigured, isProduction, r2Config } from "./config";

export type ImageStore = {
  /** Writes the object and returns the URL a browser should load it from. */
  put(key: string, body: Buffer, contentType: string): Promise<string>;
  remove(key: string): Promise<void>;
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
      const response = await client.fetch(objectUrl(key), {
        method: "PUT",
        body: new Uint8Array(body),
        headers: {
          "Content-Type": contentType,
          // Keys are content-hashed, so a given URL's bytes never change.
          "Cache-Control": "public, max-age=31536000, immutable",
        },
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
      // user's save because cleanup didn't work is worse.
      await client
        .fetch(objectUrl(key), { method: "DELETE" })
        .catch(() => undefined);
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
