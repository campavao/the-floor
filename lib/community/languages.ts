/**
 * The languages a community category can be tagged with.
 *
 * Shared by the server and the pages, so nothing in here may import the
 * detector -- its model is several megabytes and belongs on the server only.
 *
 * Codes are ISO 639-1. The list is what people are actually making categories
 * in, plus the languages of the countries the site's visitors come from; it is
 * a picker, not a claim about which languages the site itself is in.
 */
export const LANGUAGES = [
  "en",
  "pl",
  "pt",
  "fr",
  "es",
  "de",
  "it",
  "nl",
  "ro",
  "cs",
  "sk",
  "sv",
  "da",
  "no",
  "fi",
  "hu",
  "tr",
  "el",
  "uk",
  "ru",
  "bg",
  "hr",
  "sr",
  "sl",
  "lt",
  "lv",
  "et",
  "he",
  "ar",
  "fa",
  "hi",
  "th",
  "vi",
  "id",
  "ms",
  "tl",
  "ja",
  "ko",
  "zh",
] as const;

export type Language = (typeof LANGUAGES)[number];

const KNOWN = new Set<string>(LANGUAGES);

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" && KNOWN.has(value);

/**
 * "polski", "français", "日本語" -- each language in its own words, which is
 * what someone scanning a picker for their language is looking for.
 *
 * Intl knows every one of these, so there's no table of names to keep in
 * sync; the code itself is the fallback on a runtime that doesn't.
 */
export const languageName = (code: string): string => {
  try {
    const name = new Intl.DisplayNames([code], { type: "language" }).of(code);
    if (name && name !== code) {
      return name.charAt(0).toLocaleUpperCase(code) + name.slice(1);
    }
  } catch {
    // Unknown to this runtime; the code will do.
  }
  return code.toUpperCase();
};

/**
 * The first supported language in a preference list.
 *
 * Takes either an Accept-Language header ("pl-PL,pl;q=0.9,en;q=0.8") or a
 * browser's `navigator.languages`. Only the primary subtag matters here:
 * "pt-BR" and "pt-PT" players can play each other's categories.
 */
export const preferredLanguage = (
  preferences: string | readonly string[] | null | undefined
): Language | null => {
  if (!preferences) return null;

  const tags =
    typeof preferences === "string"
      ? preferences
          .split(",")
          .map((part) => {
            const [tag, ...params] = part.trim().split(";");
            const q = params
              .map((param) => param.trim())
              .find((param) => param.startsWith("q="));
            return { tag, weight: q ? Number(q.slice(2)) : 1 };
          })
          .filter((entry) => entry.tag && entry.weight > 0)
          // Stable sort, so equal weights keep the order they were sent in.
          .sort((a, b) => b.weight - a.weight)
          .map((entry) => entry.tag)
      : preferences;

  for (const tag of tags) {
    const primary = tag.toLowerCase().split("-")[0];
    // Norwegian arrives as "nb" or "nn" far more often than "no".
    const normalised = primary === "nb" || primary === "nn" ? "no" : primary;
    if (isLanguage(normalised)) return normalised;
  }
  return null;
};
