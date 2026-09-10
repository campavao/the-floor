"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import ImageEditor from "@/app/components/community/ImageEditor";
import ImagePicker from "@/app/components/community/ImagePicker";
import ItemCell, { type CellStatus } from "@/app/components/community/ItemCell";
import { LIMITS } from "@/lib/community/config";
import {
  defaultQuery,
  searchForItem,
  type ImageResult,
} from "@/lib/community/search";
import type { CommunityItem } from "@/lib/community/types";

import {
  attachImageFile,
  attachImageFromResult,
  attachImageFromUrl,
  createDraft,
  detachImage,
  publishCategory,
  saveItems,
  suggestItems,
} from "../api";

/** How many images we fetch at once. Enough to feel quick, few enough to be polite. */
const CONCURRENCY = 3;

type Cell = {
  item: CommunityItem;
  status: CellStatus;
  message?: string;
  /** Search results kept so "Next" can step through them without re-querying. */
  results: ImageResult[];
  resultIndex: number;
};

export default function CreateCategoryPage() {
  const [phase, setPhase] = useState<"name" | "build">("name");
  const [name, setName] = useState("");
  const [manualList, setManualList] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [autoFilling, setAutoFilling] = useState(false);
  const [published, setPublished] = useState(false);

  const [picking, setPicking] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  /**
   * What this deployment offers. AI suggestions and web image search each
   * depend on a key that may not be set, and offering a button that answers
   * 503 is worse than not offering it.
   */
  const [capabilities, setCapabilities] = useState({
    aiSuggestions: false,
    webImageSearch: false,
  });

  /**
   * Which source auto-fill uses.
   *
   * Web search is the only one carrying branded or pop-culture artwork --
   * Commons will answer "Tony the Tiger" with a wristwatch -- but it's metered
   * and one category spends fifty calls, so it stays opt-in per category.
   */
  const [useWebForAutoFill, setUseWebForAutoFill] = useState(false);

  useEffect(() => {
    fetch("/api/community/capabilities")
      .then((response) => response.json())
      .then((found) =>
        setCapabilities({
          aiSuggestions: Boolean(found.aiSuggestions),
          webImageSearch: Boolean(found.webImageSearch),
        })
      )
      .catch(() => undefined);
  }, []);

  // Auto-fill walks the grid in the background; this lets it stop cleanly when
  // the author hits Stop.
  const cancelRef = useRef(false);

  /** Set before `setCategoryId`, so the fill can start in the same tick. */
  const categoryIdRef = useRef<string | null>(null);

  /** Read inside the long-running fill, which outlives the render that started it. */
  const webForAutoFillRef = useRef(false);

  /**
   * The background fill runs for a minute or more while every cell it touches
   * updates state. Reading the grid through a ref keeps those callbacks stable,
   * so a long-running loop never ends up holding a snapshot from before it
   * started.
   *
   * Written synchronously as well as in an effect: the fill starts in the same
   * tick the draft is created, before React has re-rendered with the new cells.
   */
  const cellsRef = useRef<Cell[]>([]);
  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  useEffect(() => {
    webForAutoFillRef.current = useWebForAutoFill;
  }, [useWebForAutoFill]);

  const patchCell = useCallback((itemId: string, patch: Partial<Cell>) => {
    setCells((previous) => {
      const next = previous.map((cell) =>
        cell.item.id === itemId ? { ...cell, ...patch } : cell
      );
      cellsRef.current = next;
      return next;
    });
  }, []);

  /* ---------------------------------------------------------------- naming */

  const parseManual = (): Array<{ name: string }> =>
    manualList
      .split(/[\n,]/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ name: line }));

  const onSuggest = async () => {
    setWorking(true);
    setError("");
    try {
      const { items } = await suggestItems(name.trim());
      setManualList(items.map((item) => item.name).join("\n"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Suggestion failed.");
    } finally {
      setWorking(false);
    }
  };

  const onStart = async () => {
    const items = parseManual();
    if (items.length === 0) {
      setError("Add some items first — one per line.");
      return;
    }

    setWorking(true);
    setError("");
    try {
      const draft = await createDraft(name.trim(), items);
      const created: Cell[] = draft.items.map((item) => ({
        item,
        status: "waiting" as CellStatus,
        results: [],
        resultIndex: 0,
      }));

      categoryIdRef.current = draft.id;
      cellsRef.current = created;

      setCategoryId(draft.id);
      setCells(created);
      setPhase("build");

      // Start straight from the click rather than from an effect on the new
      // phase: in development React mounts, unmounts and remounts, and an
      // effect-driven loop gets cancelled by its own cleanup before it fetches
      // anything.
      runFill(created.map((cell) => cell.item.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't start.");
    } finally {
      setWorking(false);
    }
  };

  /* --------------------------------------------------------------- images */

  /** Search for one item and attach the result at `index`. */
  const fillCell = useCallback(
    async (itemId: string, index = 0, cached?: ImageResult[]) => {
      const categoryId = categoryIdRef.current;
      if (!categoryId) return;

      const current = cellsRef.current.find((cell) => cell.item.id === itemId);
      const itemName = current?.item.name ?? "";

      try {
        let results = cached ?? current?.results ?? [];

        if (results.length === 0) {
          patchCell(itemId, { status: "searching", message: undefined });
          results = await searchForItem(itemName, name, {
            source: webForAutoFillRef.current ? "web" : "commons",
            minEdge: LIMITS.minSourceImageEdge,
            limit: 12,
          });
          patchCell(itemId, { results });
        }

        const result = results[index];
        if (!result) {
          patchCell(itemId, {
            status: "empty",
            message: "Nothing found — try Find.",
            resultIndex: index,
          });
          return;
        }

        patchCell(itemId, { status: "uploading", resultIndex: index });
        const { item } = await attachImageFromResult(categoryId, itemId, result);
        patchCell(itemId, { item, status: "ready", message: undefined });
      } catch (caught) {
        patchCell(itemId, {
          status: "error",
          message:
            caught instanceof Error ? caught.message : "Couldn't fetch that.",
        });
      }
    },
    [name, patchCell]
  );

  /** Fetch pictures for the given items, a few at a time. */
  const runFill = useCallback(
    async (queue: string[]) => {
      if (!categoryIdRef.current || queue.length === 0) return;

      cancelRef.current = false;
      setAutoFilling(true);

      let cursor = 0;
      const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (!cancelRef.current) {
          const next = queue[cursor];
          cursor += 1;
          if (next === undefined) return;
          await fillCell(next);
        }
      });

      await Promise.all(workers);
      setAutoFilling(false);
    },
    [fillCell]
  );

  /** "Fill the gaps": everything still without a picture. */
  const fillRemaining = useCallback(
    () =>
      runFill(
        cellsRef.current
          .filter((cell) => !cell.item.imageUrl)
          .map((cell) => cell.item.id)
      ),
    [runFill]
  );

  const onShuffle = (itemId: string) => {
    const cell = cellsRef.current.find(
      (candidate) => candidate.item.id === itemId
    );
    if (!cell) return;
    fillCell(itemId, cell.resultIndex + 1, cell.results);
  };

  const onPickResult = async (itemId: string, result: ImageResult) => {
    if (!categoryId) return;
    setPicking(null);
    patchCell(itemId, { status: "uploading" });
    try {
      const { item } = await attachImageFromResult(categoryId, itemId, result);
      patchCell(itemId, { item, status: "ready", message: undefined });
    } catch (caught) {
      patchCell(itemId, {
        status: "error",
        message: caught instanceof Error ? caught.message : "Couldn't save.",
      });
    }
  };

  const onPickUrl = async (itemId: string, url: string) => {
    if (!categoryId) return;
    setPicking(null);
    patchCell(itemId, { status: "uploading" });
    try {
      const { item } = await attachImageFromUrl(categoryId, itemId, url);
      patchCell(itemId, { item, status: "ready", message: undefined });
    } catch (caught) {
      patchCell(itemId, {
        status: "error",
        message: caught instanceof Error ? caught.message : "Couldn't save.",
      });
    }
  };

  const onPickFile = async (itemId: string, file: File) => {
    if (!categoryId) return;
    setPicking(null);
    patchCell(itemId, { status: "uploading" });
    try {
      const { item } = await attachImageFile(categoryId, itemId, file);
      patchCell(itemId, { item, status: "ready", message: undefined });
    } catch (caught) {
      patchCell(itemId, {
        status: "error",
        message: caught instanceof Error ? caught.message : "Couldn't save.",
      });
    }
  };

  const onSaveEdit = async (itemId: string, blob: Blob) => {
    if (!categoryId) return;
    patchCell(itemId, { status: "uploading" });
    try {
      const { item } = await attachImageFile(categoryId, itemId, blob, "Edited");
      patchCell(itemId, { item, status: "ready", message: undefined });
      setEditing(null);
    } catch (caught) {
      patchCell(itemId, {
        status: "error",
        message: caught instanceof Error ? caught.message : "Couldn't save.",
      });
      setEditing(null);
    }
  };

  const onRemove = async (itemId: string) => {
    if (!categoryId) return;

    const remaining = cells.filter((cell) => cell.item.id !== itemId);
    setCells(remaining);

    try {
      const cell = cells.find((candidate) => candidate.item.id === itemId);
      if (cell?.item.imageUrl) await detachImage(categoryId, itemId);
      await saveItems(
        categoryId,
        remaining.map((entry) => ({
          id: entry.item.id,
          name: entry.item.name,
          alternatives: entry.item.alternatives,
        }))
      );
    } catch {
      // The item is gone from the grid either way; a stale row is harmless and
      // gets cleaned up by the next save.
    }
  };

  const onPublish = async () => {
    if (!categoryId) return;
    setWorking(true);
    setError("");
    try {
      await publishCategory(categoryId);
      setPublished(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't publish.");
    } finally {
      setWorking(false);
    }
  };

  /* ----------------------------------------------------------------- views */

  const withImages = cells.filter((cell) => cell.item.imageUrl).length;
  const pickingCell = cells.find((cell) => cell.item.id === picking);
  const editingCell = cells.find((cell) => cell.item.id === editing);

  if (published) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 max-w-2xl mx-auto flex flex-col gap-6 text-center">
          <h1 className="text-4xl font-bold glow-text" style={{ color: "#00d4ff" }}>
            “{name}” is live
          </h1>
          <p className="text-white/80">
            It&rsquo;s in the community pool now. Anyone can add it to a game,
            and votes decide how far up the list it climbs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community">
              <FloorButton variant="rectangular" className="font-semibold">
                Browse the pool
              </FloorButton>
            </Link>
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => {
                categoryIdRef.current = null;
                cellsRef.current = [];
                setPublished(false);
                setPhase("name");
                setName("");
                setManualList("");
                setCells([]);
                setCategoryId(null);
              }}
            >
              Make another
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  if (phase === "name") {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-16 max-w-3xl mx-auto flex flex-col gap-6">
          <div>
            <h1
              className="text-4xl font-bold glow-text mb-2"
              style={{ color: "#00d4ff" }}
            >
              New community category
            </h1>
            <p className="text-white/70">
              Name it, get a list of items, then pick a picture for each one.
            </p>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-semibold" style={{ color: "#00d4ff" }}>
              Category name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={LIMITS.maxCategoryNameLength}
              placeholder="Cursed gas station snacks"
              className="bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            />
          </label>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="font-semibold" style={{ color: "#00d4ff" }}>
                Items — one per line
              </span>
              {capabilities.aiSuggestions && (
                <FloorButton
                  variant="rectangular"
                  className="text-sm font-semibold"
                  disabled={name.trim().length < 2 || working}
                  onClick={onSuggest}
                >
                  {working ? "Thinking…" : "Suggest 50 with AI"}
                </FloorButton>
              )}
            </div>
            <textarea
              value={manualList}
              onChange={(event) => setManualList(event.target.value)}
              rows={12}
              placeholder={"Slush Puppie\nBeef jerky\nFlamin' Hot Cheetos"}
              className="bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff]/60 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] font-mono text-sm"
            />
            <p className="text-white/50 text-sm">
              {parseManual().length} items · at least{" "}
              {LIMITS.minItemsToPublish} with pictures to publish · up to{" "}
              {LIMITS.maxItemsPerCategory}
            </p>
          </div>

          {error && <p className="text-red-300">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4">
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              disabled={working || name.trim().length < 2}
              onClick={onStart}
            >
              Find pictures
            </FloorButton>
            <Link href="/community">
              <FloorButton variant="rectangular" className="font-semibold">
                Back to the pool
              </FloorButton>
            </Link>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  return (
    <FloorPageLayout>
      <div className="p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold glow-text"
              style={{ color: "#00d4ff" }}
            >
              {name}
            </h1>
            <p className="text-white/60 text-sm">
              {withImages} of {cells.length} have a picture
              {autoFilling ? " · still fetching…" : ""}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {autoFilling ? (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                onClick={() => {
                  cancelRef.current = true;
                }}
              >
                Stop
              </FloorButton>
            ) : (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                onClick={fillRemaining}
                disabled={withImages === cells.length}
              >
                Fill the gaps
              </FloorButton>
            )}
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              disabled={working || withImages < LIMITS.minItemsToPublish}
              onClick={onPublish}
            >
              {working ? "Publishing…" : "Publish"}
            </FloorButton>
          </div>
        </div>

        {capabilities.webImageSearch && (
          <label className="flex items-start gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={useWebForAutoFill}
              onChange={(event) => setUseWebForAutoFill(event.target.checked)}
              className="mt-1"
            />
            <span>
              Use web image search to fill the gaps. Slower and metered, but
              it&rsquo;s the only source with branded and pop-culture pictures —
              Wikimedia answers &ldquo;Tony the Tiger&rdquo; with a wristwatch.
            </span>
          </label>
        )}

        {withImages < LIMITS.minItemsToPublish && (
          <p className="text-white/50 text-sm">
            {LIMITS.minItemsToPublish - withImages} more picture
            {LIMITS.minItemsToPublish - withImages === 1 ? "" : "s"} needed
            before this can be published. Items without one are dropped when you
            publish.
          </p>
        )}

        {error && <p className="text-red-300">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {cells.map((cell) => (
            <ItemCell
              key={cell.item.id}
              item={cell.item}
              status={cell.status}
              message={cell.message}
              canShuffle={cell.results.length > cell.resultIndex + 1}
              onShuffle={() => onShuffle(cell.item.id)}
              onSearch={() => setPicking(cell.item.id)}
              onEdit={() => setEditing(cell.item.id)}
              onRemove={() => onRemove(cell.item.id)}
            />
          ))}
        </div>
      </div>

      {picking && pickingCell && (
        <ImagePicker
          itemName={pickingCell.item.name}
          categoryName={name}
          webSearchAvailable={capabilities.webImageSearch}
          initialQuery={defaultQuery(pickingCell.item.name, name)}
          onPick={(result) => onPickResult(picking, result)}
          onPickUrl={(url) => onPickUrl(picking, url)}
          onPickFile={(file) => onPickFile(picking, file)}
          onClose={() => setPicking(null)}
        />
      )}

      {editing && editingCell?.item.imageUrl && (
        <ImageEditor
          src={editingCell.item.imageUrl}
          itemName={editingCell.item.name}
          onSave={(blob) => onSaveEdit(editing, blob)}
          onClose={() => setEditing(null)}
        />
      )}
    </FloorPageLayout>
  );
}
