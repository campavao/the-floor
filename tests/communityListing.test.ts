import { describe, expect, it } from "vitest";

import { toListing, toOwnRow, toSummary, type StoredCategory } from "../lib/community/db";
import type { CommunityItem } from "../lib/community/types";

/**
 * Lists carry a count and four thumbnails instead of the items themselves.
 * The Postgres version computes these in SQL (scripts/verify-schema-sql.mjs
 * checks it against a real database); this pins the same contract for the
 * dev repo and the API shapes built on top.
 */

const item = (i: number, withImage: boolean): CommunityItem => ({
  alternatives: [],
  credit: null,
  height: withImage ? 600 : null,
  id: `item-${i}`,
  imageKey: withImage ? `categories/c/item-${i}.webp` : null,
  imageUrl: withImage ? `https://img.example/item-${i}.webp` : null,
  name: `Item ${i}`,
  width: withImage ? 800 : null,
});

const category: StoredCategory = {
  authorKey: "secret-author-key",
  createdAt: "2026-11-01T00:00:00.000Z",
  downvotes: 1,
  hiddenAt: null,
  id: "c",
  // Items 0 and 3 have no picture yet.
  items: Array.from({ length: 10 }, (_, i) => item(i, i !== 0 && i !== 3)),
  language: "pl",
  name: "Ten things",
  publishedAt: "2026-11-02T00:00:00.000Z",
  reportCount: 0,
  slug: "ten-things",
  status: "published",
  updatedAt: "2026-11-03T00:00:00.000Z",
  upvotes: 4,
};

describe("toListing", () => {
  it("counts every item and keeps the first four pictures in order", () => {
    const listing = toListing(category);
    expect(listing.itemCount).toBe(10);
    expect(listing.previewImageUrls).toEqual([
      "https://img.example/item-1.webp",
      "https://img.example/item-2.webp",
      "https://img.example/item-4.webp",
      "https://img.example/item-5.webp",
    ]);
  });

  it("drops the items themselves", () => {
    expect("items" in toListing(category)).toBe(false);
  });

  it("feeds the browse card and the owner's list unchanged", () => {
    const listing = toListing(category);
    expect(toSummary(listing, 1, false)).toMatchObject({
      itemCount: 10,
      language: "pl",
      myVote: 1,
      previewImageUrls: listing.previewImageUrls,
      score: 3,
    });
    const own = toOwnRow(listing);
    expect(own.itemCount).toBe(10);
    // Neither shape may carry the owner token.
    expect(JSON.stringify(toSummary(listing, 0, true))).not.toContain("secret-author-key");
    expect(JSON.stringify(own)).not.toContain("secret-author-key");
  });
});
