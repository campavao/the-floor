/* eslint-disable @next/next/no-img-element */
"use client";

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

  return (
    <div className="bg-gray-900/60 border border-[#00d4ff]/40 rounded-lg overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-black flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
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
