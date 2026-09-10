/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LIMITS } from "@/lib/community/config";
import {
  SOURCE_LABELS,
  searchForItem,
  searchImages,
  type ImageResult,
  type ImageSource,
} from "@/lib/community/search";

import FloorButton from "../FloorButton";

/**
 * Pick a picture for one item.
 *
 * The search itself runs here in the browser against Commons and Openverse --
 * both keyless and CORS-enabled -- so browsing results costs nothing. Only the
 * one that gets chosen is sent to the server.
 */
export default function ImagePicker({
  itemName,
  categoryName,
  initialQuery,
  onPick,
  onPickUrl,
  onPickFile,
  onClose,
}: {
  itemName: string;
  categoryName: string;
  initialQuery: string;
  onPick: (result: ImageResult) => void;
  onPickUrl: (url: string) => void;
  onPickFile: (file: File) => void;
  onClose: () => void;
}) {
  const [source, setSource] = useState<ImageSource>("commons");
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [pastedUrl, setPastedUrl] = useState("");

  const requestRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (
      nextQuery: string,
      nextSource: ImageSource,
      { withFallback = false } = {}
    ) => {
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;

      setStatus("loading");
      setError("");

      const options = {
        source: nextSource,
        minEdge: LIMITS.minSourceImageEdge,
        signal: controller.signal,
      };

      try {
        // Opening the picker falls back to the bare item name, so a category
        // whose name isn't a searchable term doesn't show an empty grid. A
        // typed search is taken literally.
        const found = withFallback
          ? await searchForItem(itemName, categoryName, options)
          : await searchImages(nextQuery, options);

        if (controller.signal.aborted) return;
        setResults(found);
        setStatus("idle");
      } catch (caught) {
        if (controller.signal.aborted) return;
        setError(caught instanceof Error ? caught.message : "Search failed.");
        setStatus("error");
      }
    },
    [categoryName, itemName]
  );

  useEffect(() => {
    run(initialQuery, "commons", { withFallback: true });
    return () => requestRef.current?.abort();
  }, [initialQuery, run]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border-2 border-[#00d4ff] rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4 border-b border-[#00d4ff]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold" style={{ color: "#00d4ff" }}>
              Pick an image for “{itemName}”
            </h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-2xl leading-none px-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") run(query, source);
              }}
              placeholder="Search terms"
              className="flex-1 bg-gray-800 text-white p-2 rounded border border-[#00d4ff]/60 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            />
            <select
              value={source}
              onChange={(event) => {
                const next = event.target.value as ImageSource;
                setSource(next);
                run(query, next);
              }}
              className="bg-gray-800 text-white p-2 rounded border border-[#00d4ff]/60"
            >
              {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              onClick={() => run(query, source)}
            >
              Search
            </FloorButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {status === "loading" && (
            <p className="text-white/60 text-center py-12">Searching…</p>
          )}

          {status === "error" && (
            <p className="text-red-300 text-center py-12">{error}</p>
          )}

          {status === "idle" && results.length === 0 && (
            <div className="text-white/60 text-center py-12 flex flex-col gap-2">
              <p>
                Nothing at least {LIMITS.minSourceImageEdge}px came back for
                that.
              </p>
              <p className="text-sm">
                Commons and Openverse are strong on animals, food, places and
                public figures, and thin on branded or pop-culture things. For
                those, paste a link or upload a file below.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => onPick(result)}
                className="group relative bg-gray-900 rounded overflow-hidden border-2 border-transparent hover:border-[#00d4ff] focus:border-[#00d4ff] focus:outline-none"
                title={result.title}
              >
                <img
                  src={result.thumbUrl}
                  alt={result.title}
                  loading="lazy"
                  className="w-full h-32 object-contain bg-black"
                />
                <span className="block text-[11px] text-white/60 px-2 py-1 truncate">
                  {result.width}×{result.height}
                  {result.credit.license ? ` · ${result.credit.license}` : ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#00d4ff]/40 flex flex-col sm:flex-row gap-2">
          <input
            value={pastedUrl}
            onChange={(event) => setPastedUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && pastedUrl.trim()) {
                onPickUrl(pastedUrl.trim());
              }
            }}
            placeholder="…or paste an image URL"
            className="flex-1 bg-gray-800 text-white p-2 rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
          />
          <FloorButton
            variant="rectangular"
            className="text-sm font-semibold"
            disabled={!pastedUrl.trim()}
            onClick={() => onPickUrl(pastedUrl.trim())}
          >
            Use link
          </FloorButton>
          <label className="btn-glow rectangular text-sm font-semibold cursor-pointer text-center">
            Upload file
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onPickFile(file);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
