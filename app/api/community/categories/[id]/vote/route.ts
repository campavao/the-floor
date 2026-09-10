import { repo } from "@/lib/community/db";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { ensureKey } from "@/lib/community/identity";

type Params = { params: Promise<{ id: string }> };

/**
 * One vote per browser, `direction` of 1, -1, or 0 to take it back.
 *
 * The voter is identified by an httpOnly cookie the server sets, not by an id
 * the page sends -- and the tallies are recomputed from the votes table rather
 * than incremented, so simultaneous votes can't overwrite each other.
 */
export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const body = await readJson(request);

    const raw = Number(body.direction);
    if (![1, 0, -1].includes(raw)) {
      return fail("direction must be 1, 0 or -1.");
    }
    const direction = raw as -1 | 0 | 1;

    const category = await repo().get(id);
    if (!category || category.status !== "published" || category.hiddenAt) {
      return fail("No category with that id.", 404);
    }

    const voterKey = await ensureKey();
    if (category.authorKey === voterKey) {
      return fail("You can't vote on your own category.", 403);
    }

    const tally = await repo().vote(id, voterKey, direction);
    if (!tally) return fail("No category with that id.", 404);

    return json({ ...tally, myVote: direction });
  });
}
