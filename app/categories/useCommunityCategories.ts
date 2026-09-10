"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { communityCategoryId, type CommunityCategory } from "./registry";

/**
 * The community categories this browser has pulled into its game.
 *
 * Presenter and projector are two windows of the same origin, so localStorage
 * is already how they share game state -- putting the categories there too
 * means both windows resolve a `community:<id>` key without either of them
 * refetching, and a saved game still plays after the category is edited or
 * taken down upstream. It's a snapshot on purpose.
 */
const STORAGE_KEY = "the-floor-community-categories";

/** Stable reference: usehooks-ts compares the initial value by identity. */
const EMPTY: Readonly<Record<string, CommunityCategory>> = Object.freeze({});

export function useCommunityCategories() {
  const [categories, setCategories] = useLocalStorage<
    Record<string, CommunityCategory>
  >(STORAGE_KEY, EMPTY as Record<string, CommunityCategory>, {
    // Without this the first render reads localStorage, which the server can't
    // do -- so the server renders "no such category" and the client renders the
    // real thing, and React throws a hydration mismatch. Read after mount
    // instead and let `ready` tell callers when the answer is trustworthy.
    initializeWithValue: false,
  });

  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const addCategory = useCallback(
    (category: CommunityCategory) => {
      setCategories((previous) => ({
        ...previous,
        [communityCategoryId(category.id)]: category,
      }));
    },
    [setCategories]
  );

  const removeCategory = useCallback(
    (id: string) => {
      setCategories((previous) => {
        const key = communityCategoryId(id);
        if (!(key in previous)) return previous;

        const next = { ...previous };
        delete next[key];
        return next;
      });
    },
    [setCategories]
  );

  return { categories, ready, addCategory, removeCategory };
}
