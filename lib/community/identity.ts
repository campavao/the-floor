import { cookies } from "next/headers";

import { newVoterKey } from "./ids";

/**
 * Anonymous per-browser identity.
 *
 * There are no accounts, but "one vote per person" and "only the author edits
 * this draft" still need *something*. A random key in an httpOnly cookie is
 * that something: the browser can't read it or make one up, which is the whole
 * difference from a client-supplied `voterId`. Someone determined can still
 * clear cookies and vote again -- for a fan game that's the right trade.
 */
const COOKIE = "the-floor-community-key";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
} as const;

/** The caller's key, or undefined if they've never been given one. */
export async function readKey(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE)?.value;
}

/**
 * The caller's key, minting one if needed. Only valid inside a Route Handler
 * or Server Action, where setting a cookie is allowed.
 */
export async function ensureKey(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing) return existing;

  const key = newVoterKey();
  jar.set(COOKIE, key, COOKIE_OPTIONS);
  return key;
}
