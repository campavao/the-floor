import { LIMITS } from "./config";
import { newId } from "./ids";
import type { CommunityItem } from "./types";

export class InvalidInput extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInput";
  }
}

/** Collapses whitespace and strips control characters. */
export const cleanText = (value: unknown): string =>
  typeof value === "string"
    // eslint-disable-next-line no-control-regex
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim()
    : "";

export const parseCategoryName = (value: unknown): string => {
  const name = cleanText(value);
  if (name.length < 2) {
    throw new InvalidInput("Give the category a name.");
  }
  if (name.length > LIMITS.maxCategoryNameLength) {
    throw new InvalidInput(
      `Category names are capped at ${LIMITS.maxCategoryNameLength} characters.`
    );
  }
  return name;
};

const parseAlternatives = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const alternatives: string[] = [];

  for (const entry of value) {
    const text = cleanText(entry);
    if (!text || text.length > LIMITS.maxItemNameLength) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    alternatives.push(text);
    if (alternatives.length >= LIMITS.maxAlternativesPerItem) break;
  }

  return alternatives;
};

/**
 * Turns whatever the create page posted into items we're willing to store.
 *
 * Duplicates are dropped rather than rejected -- the AI suggester occasionally
 * repeats itself, and making someone hunt for the collision is a worse
 * experience than quietly keeping the first one.
 */
export const parseItems = (
  value: unknown,
  { existing = [] }: { existing?: CommunityItem[] } = {}
): CommunityItem[] => {
  if (!Array.isArray(value)) {
    throw new InvalidInput("Expected a list of items.");
  }

  const byId = new Map(existing.map((item) => [item.id, item]));
  const seen = new Set<string>();
  const items: CommunityItem[] = [];

  for (const entry of value) {
    const raw = entry as Record<string, unknown> | null;
    const name = cleanText(raw?.name);
    if (!name) continue;
    if (name.length > LIMITS.maxItemNameLength) {
      throw new InvalidInput(
        `"${name.slice(0, 20)}..." is longer than ${LIMITS.maxItemNameLength} characters.`
      );
    }

    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    // Image fields are never taken from the request. They're only ever set by
    // the upload route, which is what stops someone pointing a published
    // category at an arbitrary URL.
    const previous =
      typeof raw?.id === "string" ? byId.get(raw.id) : undefined;

    items.push({
      id: previous?.id ?? newId(),
      name,
      alternatives: parseAlternatives(raw?.alternatives),
      imageKey: previous?.imageKey ?? null,
      imageUrl: previous?.imageUrl ?? null,
      width: previous?.width ?? null,
      height: previous?.height ?? null,
      credit: previous?.credit ?? null,
    });

    if (items.length >= LIMITS.maxItemsPerCategory) break;
  }

  if (items.length === 0) {
    throw new InvalidInput("Add at least one item.");
  }

  return items;
};

export const assertPublishable = (items: CommunityItem[]): void => {
  const withImages = items.filter((item) => item.imageUrl);

  if (withImages.length < LIMITS.minItemsToPublish) {
    throw new InvalidInput(
      `Categories need at least ${LIMITS.minItemsToPublish} items with images ` +
        `before they can be published. This one has ${withImages.length}.`
    );
  }
};
