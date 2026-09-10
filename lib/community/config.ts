/**
 * How the community tool is wired up, and what it refuses to do.
 *
 * Everything here is deliberately conservative. The whole point of the feature
 * is that it stays inside free tiers: Cloudflare R2 gives 10 GB of storage and
 * free egress, Postgres holds a few KB per category, and the AI Gateway's $5
 * monthly credit covers the item suggestions. The limits below are what keeps
 * a single enthusiastic afternoon from eating a month of quota.
 *
 * With no credentials at all the tool still runs -- it writes to disk under
 * `.community-dev/` and `public/community-dev/` so the flow can be tried before
 * anyone signs up for anything. That path is dev-only and refuses to start in
 * production.
 */

export const LIMITS = {
  /** Matches the curated categories, which run about 50 examples each. */
  maxItemsPerCategory: 60,
  minItemsToPublish: 12,
  maxCategoryNameLength: 60,
  maxItemNameLength: 80,
  maxAlternativesPerItem: 6,

  /** Anything smaller looks soft on a 1080p projector. */
  minSourceImageEdge: 600,
  /**
   * Long edge after normalisation. The projector is 1080p, so this leaves
   * headroom without paying for it: `scripts/bench-image-size.mjs` measures
   * 1600/80 at ~129 KB average across a sample of real Commons photos, which
   * lines up with the 135 KB average of the curated pool and works out to
   * ~6.3 MB per 50-item category -- about 1,600 categories inside R2's free
   * 10 GB. Dropping to 1280/78 roughly halves that if it ever matters.
   */
  storedImageMaxEdge: 1600,
  storedImageQuality: 80,
  /** Refuse to even fetch something this big -- it's not a photo, it's a mistake. */
  maxSourceImageBytes: 25 * 1024 * 1024,

  /** Reports needed before a category drops out of the listings automatically. */
  reportsBeforeAutoHide: 3,
} as const;

const trimmed = (value: string | undefined) => {
  const next = value?.trim();
  return next ? next : undefined;
};

export const r2Config = () => {
  const accountId = trimmed(process.env.R2_ACCOUNT_ID);
  const accessKeyId = trimmed(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = trimmed(process.env.R2_SECRET_ACCESS_KEY);
  const bucket = trimmed(process.env.R2_BUCKET);
  const publicBaseUrl = trimmed(process.env.R2_PUBLIC_BASE_URL);

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucket ||
    !publicBaseUrl
  ) {
    return undefined;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  };
};

export const databaseUrl = () =>
  trimmed(process.env.DATABASE_URL) ?? trimmed(process.env.POSTGRES_URL);

/**
 * The AI Gateway reads `AI_GATEWAY_API_KEY` itself, and on Vercel it can use
 * the deployment's OIDC token instead. We only check so the UI can hide the
 * suggest button rather than offering something that 500s.
 */
export const hasAiGateway = () =>
  Boolean(trimmed(process.env.AI_GATEWAY_API_KEY) || trimmed(process.env.VERCEL_OIDC_TOKEN));

export const isProduction = () => process.env.NODE_ENV === "production";

/**
 * True when the tool is falling back to the on-disk dev store. Surfaced in the
 * UI so it's obvious nothing is really being published.
 */
export const isUsingDevFallback = () =>
  !isProduction() && (!r2Config() || !databaseUrl());

/** The models the tool asks for, newest cheap tiers at time of writing. */
export const MODELS = {
  suggestItems: "google/gemini-3.8-flash",
  eraseObject: "google/gemini-3.1-flash-image",
} as const;
