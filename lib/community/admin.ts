import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * The one identity the community pool has that isn't anonymous.
 *
 * Everything else in this pool is keyed on a random per-browser cookie: only
 * the author can touch a category, and a category that goes bad waits for
 * three reports. That's fine right up until someone publishes a photo that
 * has to come down *now*, at which point "wait for reports" is not an answer.
 *
 * This is deliberately the smallest thing that works: a single shared secret
 * in `COMMUNITY_ADMIN_SECRET`. Whoever knows it can sign in at
 * `/community/admin` and then edit, hide or delete any category as if they
 * were its author. There are no accounts, no roles and no audit log -- for a
 * fan game with one or two people running it, that's the right amount.
 *
 * The secret itself never goes into the cookie. The cookie carries an HMAC of
 * a fixed label under the secret, so a leaked cookie jar gives away a session
 * but not the password, and rotating the secret signs everyone out at once.
 */

const SESSION_LABEL = "the-floor-community-admin-session-v1";

export const adminSecret = (): string | undefined => {
  const value = process.env.COMMUNITY_ADMIN_SECRET?.trim();
  return value ? value : undefined;
};

/** Whether this deployment has an admin at all. */
export const isAdminConfigured = (): boolean => Boolean(adminSecret());

/** The value the admin cookie holds for a given secret. */
export const adminToken = (secret: string): string =>
  createHmac("sha256", secret).update(SESSION_LABEL).digest("hex");

/** Constant-time string equality, so a wrong guess can't be timed. */
const sameString = (a: string, b: string): boolean => {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
};

/** Is `attempt` the configured secret? Always false with no secret set. */
export const isValidAdminSecret = (
  attempt: string | undefined,
  secret: string | undefined = adminSecret()
): boolean => Boolean(attempt && secret && sameString(attempt, secret));

/** Does `token` (from the cookie) belong to a session under `secret`? */
export const isValidAdminToken = (
  token: string | undefined,
  secret: string | undefined = adminSecret()
): boolean => Boolean(token && secret && sameString(token, adminToken(secret)));
