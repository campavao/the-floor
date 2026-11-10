import { repo, toOwnRow } from "@/lib/community/db";
import { handle, json } from "@/lib/community/http";
import { readKey } from "@/lib/community/identity";

/**
 * Everything this browser has made, drafts included.
 *
 * A draft is invisible in the public listing by design, which used to mean the
 * only way back to one was still having its URL -- close the tab and the work
 * was unreachable until the cleanup job removed it. This is the way back.
 *
 * Reading never mints an identity, so someone who has made nothing gets an
 * empty list without touching the database.
 */
export async function GET() {
  return handle(async () => {
    const key = await readKey();
    if (!key) return json({ categories: [] });

    const categories = await repo().listByAuthor(key);
    return json({ categories: categories.map(toOwnRow) });
  });
}
