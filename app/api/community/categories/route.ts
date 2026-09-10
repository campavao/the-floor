import { repo, toSummary } from "@/lib/community/db";
import { ensureKey, readKey } from "@/lib/community/identity";
import { handle, json, readJson } from "@/lib/community/http";
import { parseCategoryName, parseItems } from "@/lib/community/validate";

/** Browse the published pool. */
export async function GET(request: Request) {
  return handle(async () => {
    const params = new URL(request.url).searchParams;
    const sort = params.get("sort") === "new" ? "new" : "top";
    const limit = Math.min(Math.max(Number(params.get("limit")) || 24, 1), 48);
    const offset = Math.max(Number(params.get("offset")) || 0, 0);

    const categories = await repo().list({ sort, limit, offset });

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

    const authorKey = await ensureKey();
    const created = await repo().create({ name, items, authorKey });

    return json({ id: created.id, name: created.name, items: created.items }, 201);
  });
}
