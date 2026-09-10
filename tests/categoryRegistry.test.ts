import { describe, expect, it } from "vitest";

import {
  COMMUNITY_ID_PREFIX,
  categoryDisplayName,
  communityCategoryId,
  isCommunityCategoryId,
  isCuratedCategoryId,
  isImageExample,
  isTextExample,
  listSelectableCategories,
  resolveCategory,
  type CommunityCategory,
} from "../app/categories/registry";
import { CATEGORY_METADATA } from "../app/data";

const community: Record<string, CommunityCategory> = {
  [`${COMMUNITY_ID_PREFIX}abc-123`]: {
    id: "abc-123",
    name: "Cursed Gas Station Snacks",
    examples: [
      {
        name: "Slush Puppie",
        alternatives: ["Slushie"],
        src: "https://images.example.com/abc-123/slush-puppie.webp",
      },
    ],
  },
  [`${COMMUNITY_ID_PREFIX}zzz-999`]: {
    id: "zzz-999",
    name: "Airport Carpets",
    examples: [
      {
        name: "PDX",
        alternatives: [],
        src: "https://images.example.com/zzz-999/pdx.webp",
      },
    ],
  },
};

describe("resolving curated categories", () => {
  it("turns folder + filename into a src the browser can load", () => {
    const resolved = resolveCategory("Fruits");

    expect(resolved?.source).toBe("curated");
    expect(resolved?.name).toBe("Fruits");
    expect(resolved?.examples[0]).toEqual({
      name: "Apple",
      alternatives: ["Apples"],
      src: "/images/fruits/apple.png",
    });
  });

  it("keeps text prompts as text, with no src", () => {
    const resolved = resolveCategory("Math");
    const example = resolved?.examples[0];

    expect(example && isTextExample(example)).toBe(true);
    expect(example && isImageExample(example)).toBe(false);
    expect(example).not.toHaveProperty("src");
  });

  it("resolves every curated category without throwing", () => {
    for (const id of Object.keys(CATEGORY_METADATA)) {
      const resolved = resolveCategory(id);
      expect(resolved, `${id} did not resolve`).toBeDefined();
      expect(resolved!.examples.length).toBeGreaterThan(0);
    }
  });

  it("hands out a fresh array each time", () => {
    // round.tsx shuffles the examples in debug mode. When resolution returned
    // the array off CATEGORY_METADATA, that sort reordered the category for
    // the rest of the session.
    const first = resolveCategory("Fruits")!;
    const second = resolveCategory("Fruits")!;

    expect(first.examples).not.toBe(second.examples);
    expect(first.examples).toEqual(second.examples);

    first.examples.reverse();
    expect(resolveCategory("Fruits")!.examples[0].name).toBe("Apple");
  });
});

describe("resolving community categories", () => {
  it("finds one by its namespaced id", () => {
    const resolved = resolveCategory(`${COMMUNITY_ID_PREFIX}abc-123`, community);

    expect(resolved?.source).toBe("community");
    expect(resolved?.name).toBe("Cursed Gas Station Snacks");
    expect(resolved?.examples[0]).toMatchObject({
      name: "Slush Puppie",
      src: "https://images.example.com/abc-123/slush-puppie.webp",
    });
  });

  it("also accepts the bare id", () => {
    expect(resolveCategory("abc-123", community)?.name).toBe(
      "Cursed Gas Station Snacks"
    );
  });

  it("reports the namespaced id, so saved games round-trip", () => {
    const resolved = resolveCategory("abc-123", community)!;
    expect(resolved.id).toBe(`${COMMUNITY_ID_PREFIX}abc-123`);
    expect(resolveCategory(resolved.id, community)?.name).toBe(resolved.name);
  });

  it("returns undefined once the host removes it", () => {
    expect(resolveCategory(`${COMMUNITY_ID_PREFIX}abc-123`, {})).toBeUndefined();
    expect(resolveCategory("never-existed", community)).toBeUndefined();
    expect(resolveCategory(undefined)).toBeUndefined();
  });
});

describe("category ids", () => {
  it("namespaces without double-prefixing", () => {
    expect(communityCategoryId("abc")).toBe(`${COMMUNITY_ID_PREFIX}abc`);
    expect(communityCategoryId(`${COMMUNITY_ID_PREFIX}abc`)).toBe(
      `${COMMUNITY_ID_PREFIX}abc`
    );
  });

  it("keeps the two pools apart", () => {
    expect(isCuratedCategoryId("Fruits")).toBe(true);
    expect(isCuratedCategoryId(`${COMMUNITY_ID_PREFIX}abc-123`)).toBe(false);
    expect(isCommunityCategoryId(`${COMMUNITY_ID_PREFIX}abc-123`)).toBe(true);
    expect(isCommunityCategoryId("Fruits")).toBe(false);
  });

  it("does not mistake inherited object keys for curated categories", () => {
    // A community category called "constructor" or "toString" would otherwise
    // resolve against Object.prototype and blow up on meta.examples.
    for (const key of ["constructor", "toString", "__proto__", "valueOf"]) {
      expect(isCuratedCategoryId(key), `${key} matched`).toBe(false);
      expect(resolveCategory(key), `${key} resolved`).toBeUndefined();
    }
  });
});

describe("listing categories for the host", () => {
  const listed = listSelectableCategories(community);

  it("puts every curated category before the community ones", () => {
    const firstCommunity = listed.findIndex((c) => c.source === "community");
    const lastCurated = listed.map((c) => c.source).lastIndexOf("curated");

    expect(firstCommunity).toBeGreaterThan(lastCurated);
    expect(listed.filter((c) => c.source === "community")).toHaveLength(2);
    expect(listed.filter((c) => c.source === "curated")).toHaveLength(
      Object.keys(CATEGORY_METADATA).length
    );
  });

  it("sorts each group by display name", () => {
    for (const source of ["curated", "community"] as const) {
      const names = listed.filter((c) => c.source === source).map((c) => c.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });

  it("lists community categories under their name, not their id", () => {
    const airportCarpets = listed.find((c) => c.name === "Airport Carpets");
    expect(airportCarpets?.id).toBe(`${COMMUNITY_ID_PREFIX}zzz-999`);
  });
});

describe("display names", () => {
  it("uses the stored name for community ids", () => {
    expect(
      categoryDisplayName(`${COMMUNITY_ID_PREFIX}abc-123`, community)
    ).toBe("Cursed Gas Station Snacks");
  });

  it("uses the key itself for curated ones", () => {
    expect(categoryDisplayName("Fruits")).toBe("Fruits");
  });

  it("falls back to the raw id rather than rendering blank", () => {
    expect(categoryDisplayName(`${COMMUNITY_ID_PREFIX}gone`, {})).toBe(
      `${COMMUNITY_ID_PREFIX}gone`
    );
    expect(categoryDisplayName(undefined)).toBe("");
  });
});
