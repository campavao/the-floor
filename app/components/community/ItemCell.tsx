/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

import type { CommunityItem } from "@/lib/community/types";

export type CellStatus =
  | "waiting"
  | "searching"
  | "uploading"
  | "ready"
  | "empty"
  | "error";

/** One square of the grid: the item, its picture, and what to do about it. */
export default function ItemCell({
  item,
  status,
  message,
  canShuffle,
  onShuffle,
  onSearch,
  onEdit,
  onRemove,
}: {
  item: CommunityItem;
  status: CellStatus;
  message?: string;
  canShuffle: boolean;
  onShuffle: () => void;
  onSearch: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const busy = status === "searching" || status === "uploading";

  /**
   * Retry a freshly-uploaded image that isn't being served yet.
   *
   * Objects go into R2 over the S3 API, but the public URL is a separate edge
   * that can still 404 for a moment afterwards -- so the grid would show a
   * broken image immediately after an edit and stay broken until a reload. The
   * cache-buster matters: without it the retry just re-reads the cached 404.
   */
  const [attempt, setAttempt] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAttempt(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.imageUrl]);

  const onImageError = () => {
    if (attempt >= 3) return;
    timerRef.current = setTimeout(
      () => setAttempt((previous) => previous + 1),
      600 * (attempt + 1)
    );
  };

  const src =
    item.imageUrl && attempt > 0
      ? `${item.imageUrl}${item.imageUrl.includes("?") ? "&" : "?"}retry=${attempt}`
      : item.imageUrl;

  return (
    <div className="bg-gray-900/60 border border-[#00d4ff]/40 rounded-lg overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-black flex items-center justify-center">
        {src ? (
          <img
            src={src}
            alt={item.name}
            loading="lazy"
            onError={onImageError}
            // Must match the editor, which loads the same URL with
            // crossOrigin="anonymous". The browser caches the CORS mode
            // alongside the response, so a plain load here poisons the cache
            // for the editor: it gets the cached non-CORS copy back and can't
            // read the pixels, and "Edit" fails on every image that has
            // already been displayed.
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-white/30 text-sm px-2 text-center">
            {status === "error" ? "No image" : "—"}
          </span>
        )}

        {busy && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-[#00d4ff] text-sm animate-pulse">
              {status === "searching" ? "Searching…" : "Saving…"}
            </span>
          </div>
        )}

        <button
          onClick={onRemove}
          disabled={busy}
          title="Remove this item"
          aria-label={`Remove ${item.name}`}
          className="absolute top-1 right-1 w-6 h-6 rounded bg-black/70 text-white/70 hover:text-white hover:bg-red-600/80 text-sm leading-none disabled:opacity-40"
        >
          ×
        </button>
      </div>

      <div className="p-2 flex flex-col gap-2">
        <p className="font-semibold text-sm text-white truncate" title={item.name}>
          {item.name}
        </p>

        {message && (
          <p
            className={`text-[11px] leading-tight ${
              status === "error" ? "text-red-300" : "text-white/50"
            }`}
          >
            {message}
          </p>
        )}

        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={onShuffle}
            disabled={busy || !canShuffle}
            title="Try the next search result"
            className="text-[11px] py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-40"
          >
            Next
          </button>
          <button
            onClick={onSearch}
            disabled={busy}
            title="Search for a different image"
            className="text-[11px] py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-40"
          >
            Find
          </button>
          <button
            onClick={onEdit}
            disabled={busy || !item.imageUrl}
            title="Crop or erase text and watermarks"
            className="text-[11px] py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-40"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
