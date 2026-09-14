import { describe, expect, it } from "vitest";

import {
  adminToken,
  isValidAdminSecret,
  isValidAdminToken,
} from "../lib/community/admin";

/**
 * The admin session is one shared secret and one cookie derived from it. The
 * properties that matter: the cookie never contains the secret, a cookie from
 * one secret is worthless under another, and nothing passes with no secret set.
 */
describe("admin sessions", () => {
  const secret = "correct-horse-battery-staple";

  it("derives a cookie value that does not contain the secret", () => {
    const token = adminToken(secret);
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(token).not.toContain(secret);
  });

  it("is stable for the same secret", () => {
    expect(adminToken(secret)).toBe(adminToken(secret));
  });

  it("accepts its own token and nothing else", () => {
    expect(isValidAdminToken(adminToken(secret), secret)).toBe(true);
    expect(isValidAdminToken(adminToken("something else"), secret)).toBe(false);
    expect(isValidAdminToken(secret, secret)).toBe(false);
    expect(isValidAdminToken("", secret)).toBe(false);
    expect(isValidAdminToken(undefined, secret)).toBe(false);
  });

  it("rotating the secret invalidates every existing session", () => {
    const before = adminToken(secret);
    expect(isValidAdminToken(before, `${secret}-rotated`)).toBe(false);
  });

  it("checks the secret exactly", () => {
    expect(isValidAdminSecret(secret, secret)).toBe(true);
    expect(isValidAdminSecret(`${secret} `, secret)).toBe(false);
    expect(isValidAdminSecret(secret.slice(0, -1), secret)).toBe(false);
    expect(isValidAdminSecret("", secret)).toBe(false);
  });

  it("refuses everything when no secret is configured", () => {
    expect(isValidAdminSecret("anything", undefined)).toBe(false);
    expect(isValidAdminSecret("", undefined)).toBe(false);
    expect(isValidAdminToken(adminToken("anything"), undefined)).toBe(false);
  });
});
