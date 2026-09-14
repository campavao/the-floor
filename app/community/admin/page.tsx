/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import type { ModerationRow } from "@/lib/community/types";

import {
  deleteCategory,
  getAdminSession,
  listForModeration,
  setCategoryHidden,
  signInAsAdmin,
  signOutAsAdmin,
} from "../api";

/**
 * The admin's view of the pool.
 *
 * Sign in with the shared secret, then see every category -- hidden ones
 * first, then the most reported -- and from each row open it, edit it, hide or
 * unhide it, or delete it. That's the whole moderation toolset; the intent is
 * that a bad photo is a two-minute fix rather than a database session.
 */
export default function CommunityAdminPage() {
  const [session, setSession] = useState<{
    admin: boolean;
    configured: boolean;
  } | null>(null);
  const [secret, setSecret] = useState("");
  const [rows, setRows] = useState<ModerationRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { categories } = await listForModeration();
      setRows(categories);
      setStatus("ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't load.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    getAdminSession()
      .then((found) => {
        setSession(found);
        if (found.admin) load();
      })
      .catch((caught: unknown) => {
        setError(caught instanceof Error ? caught.message : "Couldn't load.");
        setSession({ admin: false, configured: false });
      });
  }, [load]);

  const onSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signInAsAdmin(secret);
      setSecret("");
      setSession({ admin: true, configured: true });
      load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed.");
    }
  };

  const onSignOut = async () => {
    await signOutAsAdmin().catch(() => undefined);
    setSession({ admin: false, configured: true });
    setRows([]);
  };

  const onToggleHidden = async (row: ModerationRow) => {
    setPending(row.id);
    setError("");
    try {
      const { category } = await setCategoryHidden(row.id, !row.hiddenAt);
      setRows((previous) =>
        previous.map((candidate) =>
          candidate.id === row.id
            ? {
                ...candidate,
                hiddenAt: category.hiddenAt,
                reportCount: category.reportCount,
              }
            : candidate
        )
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't do that.");
    } finally {
      setPending(null);
    }
  };

  const onDelete = async (row: ModerationRow) => {
    if (!window.confirm(`Delete "${row.name}" and all its images? This can't be undone.`)) {
      return;
    }
    setPending(row.id);
    setError("");
    try {
      await deleteCategory(row.id);
      setRows((previous) => previous.filter((candidate) => candidate.id !== row.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't delete.");
    } finally {
      setPending(null);
    }
  };

  if (!session) {
    return (
      <FloorPageLayout>
        <p className="text-white/60 p-20 text-center">Loading…</p>
      </FloorPageLayout>
    );
  }

  if (!session.admin) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-16 max-w-md mx-auto flex flex-col gap-6">
          <div>
            <Link href="/community" className="text-sm underline text-[#00d4ff]">
              ← Community categories
            </Link>
            <h1
              className="text-4xl font-bold glow-text mt-2"
              style={{ color: "#00d4ff" }}
            >
              Admin
            </h1>
          </div>

          {session.configured ? (
            <form onSubmit={onSignIn} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="font-semibold" style={{ color: "#00d4ff" }}>
                  Admin secret
                </span>
                <input
                  type="password"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  className="bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
                />
              </label>
              {error && <p className="text-red-300">{error}</p>}
              <FloorButton
                type="submit"
                variant="rectangular"
                className="font-semibold"
                disabled={secret.length === 0}
              >
                Sign in
              </FloorButton>
            </form>
          ) : (
            <p className="text-white/70">
              This deployment has no admin. Set{" "}
              <code className="text-[#00d4ff]">COMMUNITY_ADMIN_SECRET</code> in
              its environment and redeploy to add one.
            </p>
          )}
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
              Admin
            </h1>
            <p className="text-white/60">
              Every category, hidden ones first, then the most reported. Open a
              category and hit Edit to replace a picture or drop an item.
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="text-sm text-white/50 hover:text-white underline"
          >
            Sign out
          </button>
        </div>

        {error && <p className="text-yellow-200 text-sm">{error}</p>}

        {status === "loading" && <p className="text-white/60 py-12">Loading…</p>}

        {status === "ready" && rows.length === 0 && (
          <p className="text-white/60 py-12">Nothing in the pool yet.</p>
        )}

        {rows.length > 0 && (
          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className={`bg-gray-900/60 border-2 rounded-lg overflow-hidden flex flex-col sm:flex-row ${
                  row.hiddenAt
                    ? "border-red-400/60"
                    : row.reportCount > 0
                      ? "border-yellow-300/60"
                      : "border-[#00d4ff]/40"
                }`}
              >
                <div className="grid grid-cols-4 gap-px bg-black/40 sm:w-64 shrink-0">
                  {row.previewImageUrls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      loading="lazy"
                      className="w-full h-16 object-cover bg-black"
                    />
                  ))}
                </div>

                <div className="p-3 flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/community/${row.id}`}
                      className="text-lg font-bold text-white hover:text-[#00d4ff]"
                    >
                      {row.name}
                    </Link>
                    <p className="text-white/50 text-sm">
                      {row.status === "draft" ? "draft" : "published"}
                      {" · "}
                      {row.itemCount} items · {row.upvotes - row.downvotes} score
                      {row.reportCount > 0 && (
                        <span className="text-yellow-200">
                          {" · "}
                          {row.reportCount} report{row.reportCount === 1 ? "" : "s"}
                        </span>
                      )}
                      {row.hiddenAt && (
                        <span className="text-red-300"> · hidden</span>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/community/${row.id}/edit`}
                      className="text-sm px-3 py-1 rounded bg-[#00d4ff] text-black font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onToggleHidden(row)}
                      disabled={pending === row.id}
                      className="text-sm px-3 py-1 rounded bg-gray-700 text-white/80 hover:bg-gray-600 disabled:opacity-50"
                    >
                      {row.hiddenAt ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      disabled={pending === row.id}
                      className="text-sm px-3 py-1 rounded bg-gray-800 text-red-300 hover:bg-red-600/80 hover:text-white disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FloorPageLayout>
  );
}
