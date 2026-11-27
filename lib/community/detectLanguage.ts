import { LANGUAGES, isLanguage, type Language } from "./languages";

/**
 * Server only: the model is several megabytes. Pages use `./languages`.
 *
 * Guess what language a category is written in.
 *
 * This was measured against the 156 categories already published. A category
 * is mostly a list of nouns -- often names of people, teams or brands, which
 * belong to no language at all -- so it's a harder input than the sentences
 * detectors are built for:
 *
 * - franc called most of the Polish categories Hausa or Sundanese.
 * - tinyld was close, but called "NBA Players" Italian and "Chocolate Candy
 *   Bars" Danish, at full confidence.
 * - ELD's large model got the clear cases right and, usefully, says when it
 *   isn't sure. Its medium model calls English lists of names Filipino.
 *
 * What ELD still misses is a category whose name is in one language and whose
 * items are proper nouns: "marki samochodów" over "Ford, Toyota, BMW". It's
 * usually unsure about exactly those, so when the creator's browser language
 * is known, an unsure guess defers to it. Detecting the name on its own was
 * tried as well and broke as many as it fixed -- names are too short.
 *
 * It's a default either way: the creator sees it and can change it.
 */

type Detector = Awaited<typeof import("eld/large")>["eld"];

let loading: Promise<Detector> | undefined;

/**
 * Loaded on first use. The model is a 4 MB table that takes about a second to
 * parse -- fine for the one request that needs it, not something every route
 * that imports this module should pay for.
 */
const detector = () =>
  (loading ??= import("eld/large").then(({ eld }) => {
    // Only ever answer with something the picker can show. Restricting the
    // candidates also stops near-neighbours (Afrikaans for Dutch, Catalan for
    // Spanish) winning on thin evidence.
    eld.setLanguageSubset([...LANGUAGES]);
    return eld;
  }).catch((error) => {
    // Let the next request try again rather than caching the failure.
    loading = undefined;
    throw error;
  }));

export const detectLanguage = async (
  name: string,
  itemNames: string[],
  fallback: Language | null = null
): Promise<Language | null> => {
  const text = [name, ...itemNames].join("\n");

  let guess: Language | null = null;
  let reliable = false;
  try {
    const result = (await detector()).detect(text);
    if (isLanguage(result.language)) {
      guess = result.language;
      reliable = result.isReliable();
    }
  } catch (error) {
    // A broken detector shouldn't stop anyone making a category.
    console.error("[community] language detection failed:", error);
  }

  if (reliable) return guess;
  return fallback ?? guess;
};
