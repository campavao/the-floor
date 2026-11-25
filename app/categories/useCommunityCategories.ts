"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { getCategory } from "@/app/community/api";
import type { CategoryId } from "../data";
import {
  communityCategoryId,
  missingCommunityIds,
  toCommunityCategory,
  type CommunityCategory,
} from "./registry";

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

const NONE: ReadonlyArray<CategoryId | undefined> = [];

/**
 * One request per category per window, however many components ask. A failed
 * lookup is forgotten so the next round can try again.
 */
const inFlight = new Map<string, Promise<CommunityCategory | null>>();

const fetchCommunityCategory = (id: string): Promise<CommunityCategory | null> => {
  const existing = inFlight.get(id);
  if (existing) return existing;

  const request = getCategory(id)
    .then(({ category }) => toCommunityCategory(category))
    .catch(() => {
      inFlight.delete(id);
      return null;
    });
  inFlight.set(id, request);
  return request;
};

/**
 * `restore` names the categories the caller is about to show. Any community
 * category among them that this browser doesn't hold -- added in another
 * browser, removed since, or lost with the site data -- is fetched and stored
 * again, so the game keeps going instead of stopping on "Category unavailable".
 * `restoring` holds the `community:<id>` keys still on their way; once a fetch
 * fails (deleted, hidden, offline) the key leaves `restoring` and stays missing.
 */
export function useCommunityCategories(
  restore: ReadonlyArray<CategoryId | undefined> = NONE
) {
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

  const missing = useMemo(
    () => (ready ? missingCommunityIds(restore, categories) : []),
    [ready, restore, categories]
  );
  const missingKey = missing.join(",");

  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    if (!missingKey) return;

    let cancelled = false;
    for (const id of missingKey.split(",")) {
      void fetchCommunityCategory(id).then((found) => {
        if (cancelled) return;
        if (found) {
          addCategory(found);
          return;
        }
        setFailed((previous) => new Set(previous).add(id));
      });
    }

    return () => {
      cancelled = true;
    };
  }, [missingKey, addCategory]);

  const restoring = useMemo(
    () =>
      new Set(
        missing
          .filter((id) => !failed.has(id))
          .map((id) => communityCategoryId(id))
      ),
    [missing, failed]
  );

  return { categories, ready, restoring, addCategory, removeCategory };
}
