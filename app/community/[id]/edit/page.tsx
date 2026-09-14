"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import ImageEditor from "@/app/components/community/ImageEditor";
import ImagePicker from "@/app/components/community/ImagePicker";
import ItemCell, { type CellStatus } from "@/app/components/community/ItemCell";
import { useCommunityCategories } from "@/app/categories/useCommunityCategories";
import { defaultQuery, type ImageResult } from "@/lib/community/search";
import type { CommunityCategoryView } from "@/lib/community/types";

import {
  attachImageFile,
  attachImageFromResult,
  attachImageFromUrl,
  deleteCategory,
  getCategory,
  saveItems,
  setCategoryHidden,
} from "../../api";

type CellState = { status: CellStatus; message?: string };

/**
 * Fix a category that's already out there.
 *
 * The create page is built around filling fifty empty squares as fast as
 * possible. This is the opposite job: everything already has a picture and
 * one of them is wrong. So there's no auto-fill and no "Next" -- just the same
 * Find / Edit / Remove per square, against a saved category, for whoever is
 * allowed to touch it: the author, or the admin (see `lib/community/admin.ts`).
 *
 * Changes save as they're made. Replacing a picture deletes the old object
 * from storage as part of the same request, so the offending image is gone,
 * not merely unlinked.
 */
export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [category, setCategory] = useState<CommunityCategoryView | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [cells, setCells] = useState<Record<string, CellState>>({});
  const [picking, setPicking] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const [webSearchAvailable, setWebSearchAvailable] = useState(false);

  const { removeCategory } = useCommunityCategories();

  useEffect(() => {
    let cancelled = false;

    getCategory(id)
      .then(({ category: found }) => {
        if (cancelled) return;
        setCategory(found);
        setStatus("ready");
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : "Couldn't load.");
        setStatus("error");
      });

    fetch("/api/community/capabilities")
      .then((response) => response.json())
      .then((found) => {
        if (!cancelled) setWebSearchAvailable(Boolean(found.webImageSearch));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [id]);

  const patchCell = (itemId: string, patch: CellState) =>
    setCells((previous) => ({ ...previous, [itemId]: patch }));

  const replaceItem = (item: CommunityCategoryView["items"][number]) =>
    setCategory((previous) =>
      previous
        ? {
            ...previous,
            items: previous.items.map((candidate) =>
              candidate.id === item.id ? item : candidate
            ),
          }
        : previous
    );

  /** Every way of attaching a picture ends up here. */
  const attach = async (
    itemId: string,
    upload: () => Promise<{ item: CommunityCategoryView["items"][number] }>
  ) => {
    patchCell(itemId, { status: "uploading" });
    try {
      const { item } = await upload();
      replaceItem(item);
      patchCell(itemId, { status: "ready" });
    } catch (caught) {
      patchCell(itemId, {
        status: "error",
        message: caught instanceof Error ? caught.message : "Couldn't save.",
      });
    }
  };

  const onPickResult = (itemId: string, result: ImageResult) => {
    setPicking(null);
    return attach(itemId, () => attachImageFromResult(id, itemId, result));
  };

  const onPickUrl = (itemId: string, url: string) => {
    setPicking(null);
    return attach(itemId, () => attachImageFromUrl(id, itemId, url));
  };

  const onPickFile = (itemId: string, file: File) => {
    setPicking(null);
    return attach(itemId, () => attachImageFile(id, itemId, file));
  };

  const onSaveEdit = async (itemId: string, blob: Blob) => {
    setEditing(null);
    return attach(itemId, () => attachImageFile(id, itemId, blob, "Edited"));
  };

  /** Drop the item entirely. The server deletes its image as an orphan. */
  const onRemove = async (itemId: string) => {
    if (!category) return;
    const remaining = category.items.filter((item) => item.id !== itemId);

    // Optimistic: the square disappears now, and the save either agrees or
    // puts it back with an error.
    setCategory({ ...category, items: remaining });
    setError("");

    try {
      const { category: saved } = await saveItems(
        id,
        remaining.map((item) => ({
          id: item.id,
          name: item.name,
          alternatives: item.alternatives,
        }))
      );
      setCategory(saved);
    } catch (caught) {
      setCategory(category);
      setError(caught instanceof Error ? caught.message : "Couldn't remove that.");
    }
  };

  const onToggleHidden = async () => {
    if (!category) return;
    setWorking(true);
    setError("");
    try {
      const { category: next } = await setCategoryHidden(id, !category.hiddenAt);
      setCategory(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't do that.");
    } finally {
      setWorking(false);
    }
  };

  const onDelete = async () => {
    if (!category) return;
    if (!window.confirm(`Delete "${category.name}" and all its images? This can't be undone.`)) {
      return;
    }
    setWorking(true);
    setError("");
    try {
      await deleteCategory(id);
      removeCategory(id);
      router.push(category.isAdmin ? "/community/admin" : "/community");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't delete.");
      setWorking(false);
    }
  };

  if (status === "loading") {
    return (
      <FloorPageLayout>
        <p className="text-white/60 p-20 text-center">Loading…</p>
      </FloorPageLayout>
    );
  }

  if (status === "error" || !category) {
    return (
      <FloorPageLayout>
        <div className="p-20 text-center flex flex-col gap-4">
          <p className="text-red-300">{error}</p>
          <Link href="/community" className="underline text-[#00d4ff]">
            Back to the pool
          </Link>
        </div>
      </FloorPageLayout>
    );
  }

  if (!category.canEdit) {
    return (
      <FloorPageLayout>
        <div className="p-20 text-center flex flex-col gap-4">
          <p className="text-yellow-200">
            Only the author or an admin can edit this category.
          </p>
          <Link href={`/community/${id}`} className="underline text-[#00d4ff]">
            Back to the category
          </Link>
          <Link href="/community/admin" className="underline text-white/50 text-sm">
            Admin sign-in
          </Link>
        </div>
      </FloorPageLayout>
    );
  }

  const withImages = category.items.filter((item) => item.imageUrl).length;
  const pickingItem = category.items.find((item) => item.id === picking);
  const editingItem = category.items.find((item) => item.id === editing);

  return (
    <FloorPageLayout>
      <div className="p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href={`/community/${id}`}
              className="text-sm underline text-[#00d4ff]"
            >
              ← Back to the category
            </Link>
            <h1
              className="text-3xl font-bold glow-text mt-2"
              style={{ color: "#00d4ff" }}
            >
              Editing “{category.name}”
            </h1>
            <p className="text-white/60 text-sm">
              {withImages} of {category.items.length} have a picture
              {category.status === "draft" ? " · draft" : " · published"}
              {category.hiddenAt ? " · hidden from listings" : ""}
              {category.isAdmin ? " · as admin" : ""}
              {" · changes save immediately"}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {category.isAdmin && (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                disabled={working}
                onClick={onToggleHidden}
              >
                {category.hiddenAt ? "Unhide" : "Hide"}
              </FloorButton>
            )}
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              disabled={working}
              onClick={onDelete}
            >
              Delete category
            </FloorButton>
          </div>
        </div>

        <p className="text-white/50 text-sm">
          <strong className="text-white/70">Find</strong> swaps in a different
          picture, <strong className="text-white/70">Edit</strong> crops or
          erases part of this one, and <strong className="text-white/70">×</strong>{" "}
          removes the item. A replaced picture is deleted from storage, not just
          unlinked. Games that already added this category keep their own copy
          until it&rsquo;s re-added.
        </p>

        {error && <p className="text-red-300">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {category.items.map((item) => {
            const cell = cells[item.id] ?? { status: "ready" as CellStatus };
            return (
              <ItemCell
                key={item.id}
                item={item}
                status={cell.status}
                message={cell.message}
                canShuffle={false}
                onShuffle={() => undefined}
                onSearch={() => setPicking(item.id)}
                onEdit={() => setEditing(item.id)}
                onRemove={() => onRemove(item.id)}
              />
            );
          })}
        </div>
      </div>

      {picking && pickingItem && (
        <ImagePicker
          itemName={pickingItem.name}
          categoryName={category.name}
          webSearchAvailable={webSearchAvailable}
          initialQuery={defaultQuery(pickingItem.name, category.name)}
          onPick={(result) => onPickResult(picking, result)}
          onPickUrl={(url) => onPickUrl(picking, url)}
          onPickFile={(file) => onPickFile(picking, file)}
          onClose={() => setPicking(null)}
        />
      )}

      {editing && editingItem?.imageUrl && (
        <ImageEditor
          src={editingItem.imageUrl}
          itemName={editingItem.name}
          onSave={(blob) => onSaveEdit(editing, blob)}
          onClose={() => setEditing(null)}
        />
      )}
    </FloorPageLayout>
  );
}
