import { cookies } from "next/headers";

import {
  adminSecret,
  adminToken,
  isValidAdminSecret,
  isValidAdminToken,
} from "./admin";

/**
 * The admin cookie. Separate from the per-browser identity key on purpose:
 * signing in as admin doesn't change who you are as an author or a voter, and
 * signing out doesn't lose your drafts.
 */
const COOKIE = "the-floor-community-admin";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
} as const;

/** True when the caller carries a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  return isValidAdminToken(token);
}

/**
 * Trade the secret for a session cookie. Returns false on a wrong secret
 * without saying whether one is configured -- that's the admin page's job.
 * Only valid inside a Route Handler, where setting a cookie is allowed.
 */
export async function signInAdmin(attempt: string): Promise<boolean> {
  const secret = adminSecret();
  if (!secret || !isValidAdminSecret(attempt, secret)) return false;

  (await cookies()).set(COOKIE, adminToken(secret), COOKIE_OPTIONS);
  return true;
}

export async function signOutAdmin(): Promise<void> {
  (await cookies()).set(COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}
