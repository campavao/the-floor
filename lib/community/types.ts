/** Shapes shared between the community API routes and the pages that call them. */

export type CategoryStatus = "draft" | "published";

export type CommunityItem = {
  id: string;
  /** The answer a player shouts. */
  name: string;
  alternatives: string[];
  /** Storage key, kept so we can delete the object when the image is replaced. */
  imageKey: string | null;
  imageUrl: string | null;
  width: number | null;
  height: number | null;
  /** Where the image came from, shown as attribution on the category page. */
  credit: ImageCredit | null;
};

export type ImageCredit = {
  source: string;
  sourceUrl: string | null;
  author: string | null;
  license: string | null;
};

export type CommunityCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  status: CategoryStatus;
  items: CommunityItem[];
  upvotes: number;
  downvotes: number;
  reportCount: number;
  /** Set once reports pass the threshold; hidden categories drop out of listings. */
  hiddenAt: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

/** A record plus the caller's relationship to it. Never leaks `authorKey`. */
export type CommunityCategoryView = CommunityCategoryRecord & {
  isOwner: boolean;
  /** Signed in with the admin secret -- see `lib/community/admin.ts`. */
  isAdmin: boolean;
  /** Owner or admin: may replace images, drop items, or delete the category. */
  canEdit: boolean;
  myVote: -1 | 0 | 1;
};

/** The trimmed shape the browse list needs -- no items, so no 50-image payload. */
export type CommunityCategorySummary = {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  /** First few images, for the card's thumbnail strip. */
  previewImageUrls: string[];
  upvotes: number;
  downvotes: number;
  score: number;
  publishedAt: string | null;
  myVote: -1 | 0 | 1;
  isOwner: boolean;
};

/**
 * One row of the admin's moderation list. Everything, including drafts and
 * hidden categories, with the numbers an admin decides on -- and nothing that
 * identifies the author, because there's nothing to identify them by.
 */
export type ModerationRow = {
  id: string;
  name: string;
  status: CategoryStatus;
  itemCount: number;
  previewImageUrls: string[];
  upvotes: number;
  downvotes: number;
  reportCount: number;
  hiddenAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type ListOptions = {
  sort: "top" | "new";
  limit: number;
  offset: number;
};
