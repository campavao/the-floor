import { randomUUID } from "node:crypto";

/** URL-safe id. Short enough to read in a path, long enough not to guess. */
export const newId = (): string => randomUUID().replace(/-/g, "").slice(0, 16);

/**
 * A random per-browser key. Used for "did you already vote" and "is this your
 * draft" -- set server-side in an httpOnly cookie so a client can't just claim
 * to be someone else, which is how the previous attempt handled voting.
 */
export const newVoterKey = (): string => randomUUID();

export const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "category";

/** Storage key for one item's image. Content-hashed so it can be cached forever. */
export const imageKey = (
  categoryId: string,
  itemId: string,
  hash: string
): string => `categories/${categoryId}/${itemId}-${hash}.webp`;
