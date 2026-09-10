/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import { useCommunityCategories } from "@/app/categories/useCommunityCategories";
import { communityCategoryId } from "@/app/categories/registry";
import type { CommunityCategoryView } from "@/lib/community/types";

import { getCategory, reportCategory } from "../api";

/**
 * Everything in one category, with credits.
 *
 * The credits are the point as much as the browsing is: most of these images
 * come from Wikimedia Commons and Openverse under CC BY or BY-SA, which require
 * attribution wherever the work is shown. Storing the credit and never printing
 * it would put the site out of compliance with the licences it relies on.
 */
export default function CommunityCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [category, setCategory] = useState<CommunityCategoryView | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  const { categories: mine, addCategory, removeCategory } = useCommunityCategories();
  const added = communityCategoryId(id) in mine;

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

    return () => {
      cancelled = true;
    };
  }, [id]);

  const onAdd = () => {
    if (!category) return;
    addCategory({
      id: category.id,
      name: category.name,
      examples: category.items
        .filter((item) => item.imageUrl)
        .map((item) => ({
          name: item.name,
          alternatives: item.alternatives,
          src: item.imageUrl as string,
        })),
    });
  };

  const onReport = async () => {
    const reason = window.prompt("What's wrong with this category?");
    if (reason === null) return;

    try {
      const result = await reportCategory(id, reason);
      setError(
        result.hidden
          ? "Reported — this category is now hidden pending review."
          : "Reported. Thanks."
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Report failed.");
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

  return (
    <FloorPageLayout>
      <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/community" className="text-sm underline text-[#00d4ff]">
              ← Community categories
            </Link>
            <h1
              className="text-4xl font-bold glow-text mt-2"
              style={{ color: "#00d4ff" }}
            >
              {category.name}
            </h1>
            <p className="text-white/60">
              {category.items.length} items
              {category.status === "draft" ? " · draft, only you can see this" : ""}
            </p>
          </div>

          <div className="flex gap-2">
            {added ? (
              <FloorButton
                variant="rectangular"
                className="font-semibold"
                onClick={() => removeCategory(category.id)}
              >
                Remove from my game
              </FloorButton>
            ) : (
              <FloorButton
                variant="rectangular"
                className="font-semibold"
                onClick={onAdd}
              >
                Add to my game
              </FloorButton>
            )}
          </div>
        </div>

        {error && <p className="text-yellow-200 text-sm">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {category.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900/60 border border-[#00d4ff]/40 rounded-lg overflow-hidden"
            >
              <div className="aspect-square bg-black flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-white/30 text-sm">No image</span>
                )}
              </div>
              <div className="p-2">
                <p className="font-semibold text-sm text-white truncate">
                  {item.name}
                </p>
                {item.alternatives.length > 0 && (
                  <p className="text-[11px] text-white/40 truncate">
                    also: {item.alternatives.join(", ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
          <h2 className="text-lg font-bold" style={{ color: "#00d4ff" }}>
            Image credits
          </h2>
          <ul className="text-xs text-white/50 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {category.items
              .filter((item) => item.credit)
              .map((item) => (
                <li key={item.id}>
                  <span className="text-white/70">{item.name}</span> —{" "}
                  {item.credit?.sourceUrl ? (
                    <a
                      href={item.credit.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline"
                    >
                      {item.credit.source}
                    </a>
                  ) : (
                    item.credit?.source
                  )}
                  {item.credit?.author ? ` · ${item.credit.author}` : ""}
                  {item.credit?.license ? ` · ${item.credit.license}` : ""}
                </li>
              ))}
          </ul>

          <button
            onClick={onReport}
            className="text-xs text-white/40 hover:text-red-300 self-start mt-4"
          >
            Report this category
          </button>
        </div>
      </div>
    </FloorPageLayout>
  );
}
