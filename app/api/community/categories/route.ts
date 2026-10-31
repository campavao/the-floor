import { repo, toSummary } from "@/lib/community/db";
import { detectLanguage } from "@/lib/community/detectLanguage";
import { ensureKey, readKey } from "@/lib/community/identity";
import { handle, json, readJson } from "@/lib/community/http";
import { isLanguage, preferredLanguage } from "@/lib/community/languages";
import {
  parseCategoryName,
  parseItems,
  parseLanguage,
} from "@/lib/community/validate";

/** Browse the published pool. */
export async function GET(request: Request) {
  return handle(async () => {
    const params = new URL(request.url).searchParams;
    const sort = params.get("sort") === "new" ? "new" : "top";
    const limit = Math.min(Math.max(Number(params.get("limit")) || 24, 1), 48);
    const offset = Math.max(Number(params.get("offset")) || 0, 0);
    // Names are short, so anything longer than this can't match anyway.
    const query = (params.get("q") ?? "").trim().slice(0, 100);
    // An unknown code is "every language", not an error: it's a filter, and
    // an old link shouldn't break the page.
    const lang = params.get("lang");
    const language = isLanguage(lang) ? lang : undefined;

    const categories = await repo().list({
      sort,
      limit,
      offset,
      query,
      language,
    });

    // Reading the list shouldn't mint an identity -- only voting and creating
    // do that. So this uses readKey, and an anonymous visitor just sees no
    // votes of their own.
    const key = await readKey();
    const votes = key
      ? await repo().getVotes(
          categories.map((category) => category.id),
          key
        )
      : {};

    return json({
      categories: categories.map((category) =>
        toSummary(
          category,
          votes[category.id] ?? 0,
          Boolean(key) && category.authorKey === key
        )
      ),
      hasMore: categories.length === limit,
    });
  });
}

/** Start a draft. Images get attached one at a time after this. */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson(request);
    const name = parseCategoryName(body.name);
    const items = parseItems(body.items);

    // The creator can name it outright; otherwise guess, leaning on their
    // browser's language when the text alone doesn't settle it. Either way
    // the build page shows the result and lets them change it.
    const language =
      body.language === undefined || body.language === null
        ? await detectLanguage(
            name,
            items.map((item) => item.name),
            preferredLanguage(request.headers.get("accept-language"))
          )
        : parseLanguage(body.language);

    const authorKey = await ensureKey();
    const created = await repo().create({ name, items, authorKey, language });

    return json(
      {
        id: created.id,
        name: created.name,
        items: created.items,
        language: created.language,
      },
      201
    );
  });
}
