"use client";

import { LIMITS } from "./config";

/**
 * Fetch and shrink a chosen image in the browser, before it ever reaches us.
 *
 * The server used to download every image itself. Fifty downloads, three at a
 * time, all from one Vercel IP is exactly the shape of traffic Wikimedia
 * rate-limits, and it did: nearly every cell came back "HTTP 429". Doing it
 * here spreads the requests across the people actually using the tool, where
 * fetching fifty pictures looks like browsing a gallery rather than scraping.
 *
 * It also shrinks the upload from megabytes to ~130 KB, which is most of the
 * bandwidth this feature would otherwise spend.
 *
 * Commons and Openverse both serve images with `Access-Control-Allow-Origin: *`
 * so the canvas can read them back. Anything that doesn't -- a pasted link from
 * an arbitrary host -- still goes through the server. The server re-encodes
 * whatever arrives regardless: nothing about this is trusted.
 */

export class ClientImageFailed extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientImageFailed";
  }
}

export async function fetchAndShrink(
  url: string,
  signal?: AbortSignal
): Promise<Blob> {
  let response: Response;
  try {
    response = await fetch(url, { mode: "cors", signal });
  } catch {
    // Almost always a missing CORS header. The caller falls back to the server.
    throw new ClientImageFailed("Couldn't fetch that image from the browser.");
  }

  if (!response.ok) {
    throw new ClientImageFailed(`That image returned HTTP ${response.status}.`);
  }

  const blob = await response.blob();
  if (blob.size > LIMITS.maxSourceImageBytes) {
    throw new ClientImageFailed("That image is too large.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob);
  } catch {
    throw new ClientImageFailed("That file isn't an image we can read.");
  }

  try {
    if (Math.max(bitmap.width, bitmap.height) < LIMITS.minSourceImageEdge) {
      throw new ClientImageFailed(
        `Only ${bitmap.width}x${bitmap.height} — too small for a big screen.`
      );
    }

    // Never enlarge: upscaling a thumbnail passes a dimension check while still
    // looking like mush on a TV.
    const scale = Math.min(
      1,
      LIMITS.storedImageMaxEdge / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new ClientImageFailed("Couldn't open a canvas.");
    context.drawImage(bitmap, 0, 0, width, height);

    const shrunk = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", LIMITS.storedImageQuality / 100)
    );
    if (!shrunk) throw new ClientImageFailed("Couldn't re-encode that image.");

    return shrunk;
  } finally {
    bitmap.close();
  }
}
