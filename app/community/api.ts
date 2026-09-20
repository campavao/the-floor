"use client";

import { fetchAndShrink } from "@/lib/community/clientImage";
import type { ImageResult } from "@/lib/community/search";
import type {
  CommunityCategorySummary,
  CommunityCategoryView,
  CommunityItem,
  ModerationRow,
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
  sort: "top" | "new" = "top",
  offset = 0
): Promise<{ categories: CommunityCategorySummary[]; hasMore: boolean }> =>
  fetch(
    `/api/community/categories?sort=${sort}&offset=${offset}`
  ).then(unwrap);

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

export const deleteCategory = (id: string): Promise<{ deleted: boolean }> =>
  fetch(`/api/community/categories/${id}`, { method: "DELETE" }).then(unwrap);

/* ------------------------------------------------------------------ admin */

export const getAdminSession = (): Promise<{
  admin: boolean;
  configured: boolean;
}> => fetch("/api/community/admin/session").then(unwrap);

export const signInAsAdmin = (secret: string): Promise<{ admin: boolean }> =>
  postJson("/api/community/admin/session", { secret });

export const signOutAsAdmin = (): Promise<{ admin: boolean }> =>
  fetch("/api/community/admin/session", { method: "DELETE" }).then(unwrap);

export const listForModeration = (): Promise<{ categories: ModerationRow[] }> =>
  fetch("/api/community/admin/categories").then(unwrap);

/** Admin only. Hide a category from every listing, or put it back. */
export const setCategoryHidden = (
  id: string,
  hidden: boolean
): Promise<{ category: CommunityCategoryView }> =>
  postJson(`/api/community/categories/${id}/moderate`, { hidden });

const creditFields = (form: FormData, credit: ImageResult["credit"]) => {
  form.append("creditSource", credit.source);
  if (credit.sourceUrl) form.append("creditSourceUrl", credit.sourceUrl);
  if (credit.author) form.append("creditAuthor", credit.author);
  if (credit.license) form.append("creditLicense", credit.license);
};

/**
 * Attach a search result, downloading it in the browser where possible.
 *
 * Both sources send permissive CORS headers, so the bytes come straight from
 * the visitor to Commons or Openverse rather than through us. That matters:
 * pulling fifty images per category from a single Vercel IP got the server
 * rate-limited (HTTP 429) on almost every request. It also means we upload a
 * shrunken ~130 KB WebP instead of the server downloading the multi-megabyte
 * original.
 *
 * The server path stays as a fallback for anything the browser can't fetch,
 * and re-encodes whatever arrives either way.
 */
export const attachImageFromResult = async (
  categoryId: string,
  itemId: string,
  result: ImageResult,
  signal?: AbortSignal
): Promise<{ item: CommunityItem }> => {
  const form = new FormData();
  form.append("itemId", itemId);
  creditFields(form, result.credit);

  try {
    const shrunk = await fetchAndShrink(result.fullUrl, signal);
    form.append("file", shrunk, "image.webp");
  } catch {
    form.append("sourceUrl", result.fullUrl);
  }

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
