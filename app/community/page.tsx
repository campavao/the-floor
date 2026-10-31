/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import { useCommunityCategories } from "@/app/categories/useCommunityCategories";
import { communityCategoryId } from "@/app/categories/registry";
import {
  isLanguage,
  languageName,
  preferredLanguage,
} from "@/lib/community/languages";
import type { CommunityCategorySummary } from "@/lib/community/types";

import {
  getCategory,
  listCategories,
  listLanguages,
  reportCategory,
  voteOnCategory,
} from "./api";

/** "all", or a language code. Remembered per browser. */
const LANGUAGE_KEY = "the-floor-community-language";

const readStoredLanguage = (): string | null | undefined => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    if (stored === "all") return null;
    if (isLanguage(stored)) return stored;
  } catch {
    // Private mode or blocked storage: fall through to the browser's language.
  }
  return undefined;
};

const storeLanguage = (language: string | null) => {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, language ?? "all");
  } catch {
    // Not worth surfacing; the choice just won't be remembered.
  }
};

export default function CommunityPage() {
  const [sort, setSort] = useState<"top" | "new">("top");
  const [categories, setCategories] = useState<CommunityCategorySummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  /** What's in the box, and what was last sent -- the latter trails by a beat. */
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  /**
   * Each listing request takes a ticket. Typing fires several in a row and a
   * cold database can answer them out of order, so only the newest one is
   * allowed to land.
   */
  const latest = useRef(0);

  /**
   * Which language to show: a code, null for every language, or undefined
   * until that's been decided. Nothing is fetched while it's undefined --
   * otherwise a Polish visitor would get every language and then watch it
   * get swapped for Polish a moment later.
   */
  const [language, setLanguage] = useState<string | null | undefined>(
    undefined
  );
  const [languages, setLanguages] = useState<
    Array<{ language: string; count: number }>
  >([]);

  useEffect(() => {
    // A choice made here before wins over everything.
    const stored = readStoredLanguage();
    if (stored !== undefined) setLanguage(stored);

    listLanguages()
      .then(({ languages: found }) => {
        setLanguages(found);
        // Otherwise the browser's language -- but only if there's something
        // in it. Defaulting a Portuguese visitor to an empty Portuguese
        // filter would make the pool look empty.
        if (stored === undefined) {
          const preferred = preferredLanguage(navigator.languages);
          const available = found.some((entry) => entry.language === preferred);
          setLanguage(preferred && available ? preferred : null);
        }
      })
      .catch(() => {
        if (stored === undefined) setLanguage(null);
      });
  }, []);

  const chooseLanguage = (next: string | null) => {
    storeLanguage(next);
    setLanguage(next);
  };

  /**
   * The API has always paged -- the page just never asked for the second one,
   * so everything past the first 24 was unreachable.
   */
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { categories: mine, addCategory, removeCategory } = useCommunityCategories();

  const load = useCallback(
    async (which: "top" | "new", q: string, lang: string | null) => {
      const ticket = ++latest.current;
      setStatus("loading");
      try {
        const { categories: found, hasMore: more } = await listCategories(
          which,
          0,
          q,
          lang
        );
        if (ticket !== latest.current) return;
        setCategories(found);
        setHasMore(more);
        setStatus("ready");
      } catch (caught) {
        if (ticket !== latest.current) return;
        setError(caught instanceof Error ? caught.message : "Couldn't load.");
        setStatus("error");
      }
    },
    []
  );

  const loadMore = useCallback(async () => {
    // Not a new ticket: this extends the current listing, and is dropped if
    // the search or sort changes underneath it.
    const ticket = latest.current;
    setLoadingMore(true);
    setError("");
    try {
      // Offset by what's on screen rather than a page counter: the two only
      // agree while nothing is published mid-browse.
      const { categories: found, hasMore: more } = await listCategories(
        sort,
        categories.length,
        query,
        language ?? null
      );
      if (ticket !== latest.current) return;

      setCategories((previous) => {
        // Paging by offset can repeat a category if one is published while
        // you're reading, which would also collide on React's keys.
        const seen = new Set(previous.map((category) => category.id));
        return [...previous, ...found.filter((c) => !seen.has(c.id))];
      });
      setHasMore(more);
    } catch (caught) {
      if (ticket !== latest.current) return;
      setError(caught instanceof Error ? caught.message : "Couldn't load more.");
    } finally {
      setLoadingMore(false);
    }
  }, [sort, categories.length, query, language]);

  useEffect(() => {
    if (language === undefined) return;
    load(sort, query, language);
  }, [sort, query, language, load]);

  const onVote = async (id: string, direction: -1 | 1) => {
    const current = categories.find((category) => category.id === id);
    if (!current) return;

    // Clicking the arrow you already picked takes the vote back.
    const next = current.myVote === direction ? 0 : direction;

    try {
      const result = await voteOnCategory(id, next);
      setCategories((previous) =>
        previous.map((category) =>
          category.id === id
            ? {
                ...category,
                upvotes: result.upvotes,
                downvotes: result.downvotes,
                score: result.upvotes - result.downvotes,
                myVote: result.myVote,
              }
            : category
        )
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Vote failed.");
    }
  };

  /**
   * Copy the whole category into this browser.
   *
   * The presenter and projector are two windows sharing localStorage, and the
   * game has to keep working if the category is edited or taken down later --
   * so this stores a snapshot rather than a reference.
   */
  const onAdd = async (summary: CommunityCategorySummary) => {
    setPending(summary.id);
    setError("");
    try {
      const { category } = await getCategory(summary.id);
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
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't add that.");
    } finally {
      setPending(null);
    }
  };

  const onReport = async (id: string) => {
    const reason = window.prompt(
      "What's wrong with this category? (offensive, broken images, spam…)"
    );
    if (reason === null) return;

    try {
      const result = await reportCategory(id, reason);
      if (result.hidden) {
        setCategories((previous) => previous.filter((c) => c.id !== id));
      }
      setError(
        result.hidden
          ? "Reported — that category is now hidden pending review."
          : "Reported. Thanks."
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Report failed.");
    }
  };

  return (
    <FloorPageLayout>
      <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h1
              className="text-4xl font-bold glow-text mb-2"
              style={{ color: "#00d4ff" }}
            >
              Community categories
            </h1>
            <p className="text-white/70">
              Made by the community, results may vary. These are kept separate
              from the{" "}
              <Link href="/categories" className="underline text-[#00d4ff]">
                built-in categories
              </Link>
              , which are hand-made. Vote on what&rsquo;s good and report
              anything that isn&rsquo;t.
            </p>
          </div>

          <Link href="/community/create">
            <FloorButton variant="rectangular" className="font-semibold">
              Create a category
            </FloorButton>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearch("");
              }}
              placeholder="Search categories…"
              aria-label="Search community categories"
              maxLength={100}
              className="w-full px-4 py-2 text-sm rounded bg-gray-800 text-white placeholder-white/40 border border-transparent focus:border-[#00d4ff] focus:outline-none"
            />
          </div>

          {(["top", "new"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSort(option)}
              className={`px-4 py-2 text-sm font-semibold rounded capitalize ${
                sort === option
                  ? "bg-[#00d4ff] text-black"
                  : "bg-gray-800 text-white/70 hover:bg-gray-700"
              }`}
            >
              {option}
            </button>
          ))}

          {languages.length > 0 && (
            <select
              value={language ?? "all"}
              onChange={(event) =>
                chooseLanguage(
                  event.target.value === "all" ? null : event.target.value
                )
              }
              aria-label="Language"
              className="px-3 py-2 text-sm font-semibold rounded bg-gray-800 text-white/90 border border-transparent focus:border-[#00d4ff] focus:outline-none"
            >
              <option value="all">All languages</option>
              {/* A remembered choice can outlive its last category; keep it
                  selectable rather than silently showing something else. */}
              {language && !languages.some((l) => l.language === language) && (
                <option value={language}>{languageName(language)} (0)</option>
              )}
              {languages.map((entry) => (
                <option key={entry.language} value={entry.language}>
                  {languageName(entry.language)} ({entry.count})
                </option>
              ))}
            </select>
          )}
        </div>

        {error && status !== "error" && (
          <p className="text-yellow-200 text-sm">{error}</p>
        )}

        {status === "loading" && <p className="text-white/60 py-12">Loading…</p>}

        {status === "error" && (
          <div className="text-white/60 py-16 text-center flex flex-col gap-3">
            <p className="text-yellow-200">{error}</p>
            <p className="text-sm">
              The rest of the game is unaffected —{" "}
              <Link href="/categories" className="underline text-[#00d4ff]">
                the built-in categories
              </Link>{" "}
              don&rsquo;t need any of this.
            </p>
          </div>
        )}

        {status === "ready" && categories.length === 0 && (query || language) && (
          <div className="text-white/60 py-16 text-center flex flex-col gap-3">
            <p>
              {language
                ? `No ${languageName(language)} categories`
                : "No categories"}
              {query ? <> match &ldquo;{query}&rdquo;.</> : " yet."}
            </p>
            <p>
              {language ? (
                <button
                  onClick={() => chooseLanguage(null)}
                  className="underline text-[#00d4ff]"
                >
                  Look in every language
                </button>
              ) : (
                <button
                  onClick={() => setSearch("")}
                  className="underline text-[#00d4ff]"
                >
                  Clear the search
                </button>
              )}{" "}
              or{" "}
              <Link href="/community/create" className="underline text-[#00d4ff]">
                make it yourself.
              </Link>
            </p>
          </div>
        )}

        {status === "ready" && categories.length === 0 && !query && !language && (
          <div className="text-white/60 py-16 text-center flex flex-col gap-3">
            <p>Nothing here yet.</p>
            <p>
              <Link href="/community/create" className="underline text-[#00d4ff]">
                Make the first one.
              </Link>
            </p>
          </div>
        )}

        {/* Switching sort takes a couple of seconds against a cold database.
            Leaving the previous results at full strength means you can vote on
            a row that's about to be replaced, so they're visibly stale and
            inert until the new page arrives. */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${
            status === "loading" && categories.length > 0
              ? "opacity-40 pointer-events-none"
              : ""
          }`}
          aria-busy={status === "loading"}
        >
          {categories.map((category) => {
            const added = communityCategoryId(category.id) in mine;

            return (
              <div
                key={category.id}
                className="bg-gray-900/60 border-2 border-[#00d4ff]/40 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="grid grid-cols-4 gap-px bg-black/40 h-24">
                  {category.previewImageUrls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      loading="lazy"
                      className="w-full h-24 object-cover bg-black"
                    />
                  ))}
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <Link
                      href={`/community/${category.id}`}
                      className="text-xl font-bold text-white hover:text-[#00d4ff]"
                    >
                      {category.name}
                    </Link>
                    <p className="text-white/50 text-sm">
                      {category.itemCount} items
                      {/* Redundant when the list is already one language. */}
                      {!language && category.language
                        ? ` · ${languageName(category.language)}`
                        : ""}
                      {category.isOwner ? " · yours" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => onVote(category.id, 1)}
                      disabled={category.isOwner}
                      aria-label="Upvote"
                      className={`px-2 py-1 rounded text-sm disabled:opacity-30 ${
                        category.myVote === 1
                          ? "bg-[#00d4ff] text-black"
                          : "bg-gray-800 text-white/70 hover:bg-gray-700"
                      }`}
                    >
                      ▲
                    </button>
                    <span className="font-bold text-white min-w-[2ch] text-center">
                      {category.score}
                    </span>
                    <button
                      onClick={() => onVote(category.id, -1)}
                      disabled={category.isOwner}
                      aria-label="Downvote"
                      className={`px-2 py-1 rounded text-sm disabled:opacity-30 ${
                        category.myVote === -1
                          ? "bg-red-500 text-black"
                          : "bg-gray-800 text-white/70 hover:bg-gray-700"
                      }`}
                    >
                      ▼
                    </button>

                    <div className="flex-1" />

                    {added ? (
                      <button
                        onClick={() => removeCategory(category.id)}
                        className="text-sm px-3 py-1 rounded bg-gray-700 text-white/80 hover:bg-gray-600"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => onAdd(category)}
                        disabled={pending === category.id}
                        className="text-sm px-3 py-1 rounded bg-[#00d4ff] text-black font-semibold disabled:opacity-50"
                      >
                        {pending === category.id ? "Adding…" : "Add to my game"}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onReport(category.id)}
                    className="text-xs text-white/40 hover:text-red-300 self-start"
                  >
                    Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {status === "ready" && hasMore && (
          <div className="flex justify-center pt-2">
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              disabled={loadingMore}
              onClick={loadMore}
            >
              {loadingMore ? "Loading…" : "Load more"}
            </FloorButton>
          </div>
        )}

        {status === "ready" && !hasMore && categories.length > 0 && (
          <p className="text-white/40 text-sm text-center pt-2">
            {query
              ? `${categories.length} ${
                  categories.length === 1 ? "category matches" : "categories match"
                } “${query}”.`
              : <>That&rsquo;s all {categories.length} of them.</>}
            {language && (
              <>
                {" "}
                <button
                  onClick={() => chooseLanguage(null)}
                  className="underline text-[#00d4ff]"
                >
                  Show every language
                </button>
              </>
            )}
          </p>
        )}

        {Object.keys(mine).length > 0 && (
          <p className="text-white/60 text-sm border-t border-white/10 pt-4">
            {Object.keys(mine).length} community categor
            {Object.keys(mine).length === 1 ? "y is" : "ies are"} loaded in this
            browser and will show up in the{" "}
            <Link href="/presenter" className="underline text-[#00d4ff]">
              presenter
            </Link>{" "}
            category list.
          </p>
        )}
      </div>
    </FloorPageLayout>
  );
}
