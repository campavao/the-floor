"use client";

import type { ImageResult } from "@/lib/community/search";
import type {
  CommunityCategorySummary,
  CommunityCategoryView,
  CommunityItem,
} from "@/lib/community/types";

/** The message from the API if it sent one, so the UI never says "Error 400". */
const unwrap = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error ?? `Request failed (HTTP ${response.status})`);
  }
  return body;
};

const postJson = (path: string, payload: unknown) =>
  fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);

export type DraftItemInput = { name: string; alternatives?: string[] };

export const suggestItems = (
  name: string,
  count = 50
): Promise<{ items: Array<{ name: string; alternatives: string[] }> }> =>
  postJson("/api/community/suggest", { name, count });

export const createDraft = (
  name: string,
  items: DraftItemInput[]
): Promise<{ id: string; name: string; items: CommunityItem[] }> =>
  postJson("/api/community/categories", { name, items });

export const saveItems = (
  id: string,
  items: Array<Pick<CommunityItem, "id" | "name" | "alternatives">>
): Promise<{ category: CommunityCategoryView }> =>
  fetch(`/api/community/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  }).then(unwrap);

export const publishCategory = (
  id: string
): Promise<{ category: CommunityCategoryView }> =>
  postJson(`/api/community/categories/${id}/publish`, {});

export const getCategory = (
  id: string
): Promise<{ category: CommunityCategoryView }> =>
  fetch(`/api/community/categories/${id}`).then(unwrap);

export const listCategories = (
  sort: "top" | "new" = "top"
): Promise<{ categories: CommunityCategorySummary[]; hasMore: boolean }> =>
  fetch(`/api/community/categories?sort=${sort}`).then(unwrap);

export const voteOnCategory = (
  id: string,
  direction: -1 | 0 | 1
): Promise<{ upvotes: number; downvotes: number; myVote: -1 | 0 | 1 }> =>
  postJson(`/api/community/categories/${id}/vote`, { direction });

export const reportCategory = (
  id: string,
  reason: string
): Promise<{ reported: boolean; hidden: boolean }> =>
  postJson(`/api/community/categories/${id}/report`, { reason });

/**
 * Hand the server a URL and let it do the fetching.
 *
 * The browser can't download most of these itself -- the hosts don't send CORS
 * headers -- and doing it server-side is also what lets us size-check and
 * re-encode before anything reaches storage.
 */
export const attachImageFromResult = (
  categoryId: string,
  itemId: string,
  result: ImageResult,
  signal?: AbortSignal
): Promise<{ item: CommunityItem }> => {
  const form = new FormData();
  form.append("itemId", itemId);
  form.append("sourceUrl", result.fullUrl);
  form.append("creditSource", result.credit.source);
  if (result.credit.sourceUrl) form.append("creditSourceUrl", result.credit.sourceUrl);
  if (result.credit.author) form.append("creditAuthor", result.credit.author);
  if (result.credit.license) form.append("creditLicense", result.credit.license);

  return fetch(`/api/community/categories/${categoryId}/images`, {
    method: "POST",
    body: form,
    signal,
  }).then(unwrap);
};

export const attachImageFromUrl = (
  categoryId: string,
  itemId: string,
  sourceUrl: string
): Promise<{ item: CommunityItem }> => {
  const form = new FormData();
  form.append("itemId", itemId);
  form.append("sourceUrl", sourceUrl);
  form.append("creditSource", "Pasted link");
  form.append("creditSourceUrl", sourceUrl);

  return fetch(`/api/community/categories/${categoryId}/images`, {
    method: "POST",
    body: form,
  }).then(unwrap);
};

export const attachImageFile = (
  categoryId: string,
  itemId: string,
  file: File | Blob,
  credit = "Uploaded"
): Promise<{ item: CommunityItem }> => {
  const form = new FormData();
  form.append("itemId", itemId);
  form.append("file", file, "image");
  form.append("creditSource", credit);

  return fetch(`/api/community/categories/${categoryId}/images`, {
    method: "POST",
    body: form,
  }).then(unwrap);
};

export const detachImage = (
  categoryId: string,
  itemId: string
): Promise<{ item: CommunityItem }> =>
  fetch(
    `/api/community/categories/${categoryId}/images?itemId=${encodeURIComponent(itemId)}`,
    { method: "DELETE" }
  ).then(unwrap);
