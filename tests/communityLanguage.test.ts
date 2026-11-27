import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { detectLanguage } from "../lib/community/detectLanguage";
import {
  isLanguage,
  languageName,
  preferredLanguage,
} from "../lib/community/languages";

describe("preferredLanguage", () => {
  it("reads an Accept-Language header by weight, not order", () => {
    expect(preferredLanguage("en;q=0.5,pl-PL;q=0.9,fr;q=0.8")).toBe("pl");
  });

  it("only looks at the primary subtag", () => {
    expect(preferredLanguage("pt-BR")).toBe("pt");
    expect(preferredLanguage(["fr-CA", "en-US"])).toBe("fr");
  });

  it("skips languages it doesn't offer and ones refused with q=0", () => {
    expect(preferredLanguage("xx,zz;q=0.9,de;q=0.1")).toBe("de");
    expect(preferredLanguage("pl;q=0,en;q=0.5")).toBe("en");
  });

  it("files Bokmål and Nynorsk under Norwegian", () => {
    expect(preferredLanguage("nb-NO")).toBe("no");
  });

  it("has no answer for nothing", () => {
    expect(preferredLanguage(null)).toBeNull();
    expect(preferredLanguage("")).toBeNull();
    expect(preferredLanguage("*")).toBeNull();
  });
});

describe("languageName", () => {
  it("names each language in itself, capitalised", () => {
    expect(languageName("pl")).toBe("Polski");
    expect(languageName("fr")).toBe("Français");
    expect(languageName("en")).toBe("English");
  });

  it("falls back to the code", () => {
    expect(languageName("not-a-language")).toBe("NOT-A-LANGUAGE");
  });
});

describe("isLanguage", () => {
  it("accepts codes on the list and nothing else", () => {
    expect(isLanguage("pl")).toBe(true);
    expect(isLanguage("PL")).toBe(false);
    expect(isLanguage("xx")).toBe(false);
    expect(isLanguage(undefined)).toBe(false);
  });
});

/**
 * Real categories from the community pool (the first ten items of each), the
 * cases that decided the approach in lib/community/detectLanguage.ts. Kept
 * verbatim on purpose: with shorter, made-up lists the detector is shakier --
 * six French instruments came back Italian -- which is why the creator always
 * gets the final say.
 */
describe("detectLanguage", () => {
  it("recognises a category written in the language", async () => {
    expect(
      await detectLanguage("Polskie jedzenie", [
        "Pierogi",
        "Bigos",
        "Żurek",
        "Barszcz czerwony",
        "Gołąbki",
        "Kotlet schabowy",
        "Placki ziemniaczane",
        "Kiełbasa",
        "Ogórek kiszony",
        "Kapusta kiszona",
      ])
    ).toBe("pl");

    expect(
      await detectLanguage("Monuments du monde", [
        "Tour Eiffel",
        "Colisée",
        "Taj Mahal",
        "Machu Picchu",
        "Grande Muraille de Chine",
        "Pyramides de Gizeh",
        "Statue de la Liberté",
        "Big Ben",
        "Sagrada Família",
        "Christ Rédempteur",
      ])
    ).toBe("fr");

    expect(
      await detectLanguage("משתתפי הזירה עונה 4", [
        "אבי זאנה",
        "אבי פריד",
        "אביתר בר און",
        "אופירה עזריאלי",
      ])
    ).toBe("he");
  }, 20_000);

  it("calls an English list of names English", async () => {
    // tinyld said Italian here, at full confidence.
    expect(
      await detectLanguage("NBA Players", [
        "LeBron James",
        "Michael Jordan",
        "Stephen Curry",
        "Kobe Bryant",
        "Shaquille O’Neal",
        "Kevin Durant",
        "Magic Johnson",
        "Larry Bird",
        "Giannis Antetokounmpo",
        "Luka Dončić",
      ])
    ).toBe("en");
  });

  it("defers an unsure guess to the creator's language", async () => {
    // A Polish name over a list of brands: the text alone isn't enough.
    const items = [
      "Ford",
      "Toyota",
      "BMW",
      "Mercedes-Benz",
      "Honda",
      "Nissan",
      "Volkswagen",
      "Audi",
      "Chevrolet",
      "Hyundai",
    ];
    expect(await detectLanguage("marki samochodów", items, "pl")).toBe("pl");
  });

  it("doesn't let the fallback override a confident answer", async () => {
    expect(
      await detectLanguage(
        "Instruments de musique",
        [
          "Guitare",
          "piano",
          "violon",
          "violoncelle",
          "contrebasse",
          "harpe",
          "flûte traversière",
          "clarinette",
          "saxophone",
          "trompette",
        ],
        "pl"
      )
    ).toBe("fr");
  });
});

describe("filtering by language in the dev store", () => {
  let workdir: string;
  let previousCwd: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    workdir = await mkdtemp(path.join(tmpdir(), "floor-language-"));
    process.chdir(workdir);
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await rm(workdir, { force: true, recursive: true });
  });

  const load = async () => {
    vi.resetModules();
    return (await import("../lib/community/db")).repo();
  };

  const publish = async (
    repo: Awaited<ReturnType<typeof load>>,
    name: string,
    language: string | null
  ) => {
    const created = await repo.create({ authorKey: "a", items: [], language, name });
    await repo.publish(created.id);
    return created;
  };

  it("lists only the chosen language, and every language without one", async () => {
    const repo = await load();
    await publish(repo, "Ptaki", "pl");
    await publish(repo, "Animaux", "fr");
    await publish(repo, "Birds", "en");
    await publish(repo, "Old one", null);

    const polish = await repo.list({ language: "pl", limit: 24, offset: 0, sort: "top" });
    expect(polish.map((c) => c.name)).toEqual(["Ptaki"]);

    const all = await repo.list({ limit: 24, offset: 0, sort: "top" });
    expect(all).toHaveLength(4);
  });

  it("combines with search", async () => {
    const repo = await load();
    await publish(repo, "Polskie miasta", "pl");
    await publish(repo, "Polskie jedzenie", "pl");
    await publish(repo, "Polish food", "en");

    const found = await repo.list({
      language: "pl",
      limit: 24,
      offset: 0,
      query: "miasta",
      sort: "top",
    });
    expect(found.map((c) => c.name)).toEqual(["Polskie miasta"]);
  });

  it("counts only what the browse page can show", async () => {
    const repo = await load();
    await publish(repo, "Ptaki", "pl");
    await publish(repo, "Ryby", "pl");
    await publish(repo, "Birds", "en");
    await publish(repo, "Untagged", null);
    // Drafts and hidden categories aren't browsable, so they don't count.
    await repo.create({ authorKey: "a", items: [], language: "pl", name: "Draft" });
    const hidden = await publish(repo, "Hidden", "en");
    await repo.setHidden(hidden.id, true);

    expect(await repo.languageCounts()).toEqual([
      { count: 2, language: "pl" },
      { count: 1, language: "en" },
    ]);
  });

  it("relabels, and finds the untagged ones for the backfill", async () => {
    const repo = await load();
    const tagged = await publish(repo, "Birds", "en");
    const untagged = await publish(repo, "Ptaki", null);

    expect((await repo.listWithoutLanguage(10)).map((c) => c.id)).toEqual([
      untagged.id,
    ]);

    const before = (await repo.get(untagged.id))!.updatedAt;
    await repo.setLanguage(untagged.id, "pl");
    const after = await repo.get(untagged.id);
    expect(after?.language).toBe("pl");
    expect(await repo.listWithoutLanguage(10)).toEqual([]);
    expect((await repo.get(tagged.id))?.language).toBe("en");
    // Relabelling isn't editing; it mustn't look like recent work to cleanup.
    expect(after?.updatedAt).toBe(before);
  });
});
