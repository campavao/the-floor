import { repo, toModerationRow } from "@/lib/community/db";
import { isAdmin } from "@/lib/community/adminSession";
import { fail, handle, json } from "@/lib/community/http";

/**
 * Every category, for the admin: hidden ones first, then the most reported.
 *
 * Drafts are included too. They're private in every other listing, but their
 * images are already sitting on a public bucket, so "nobody can browse to it"
 * isn't the same as "nobody can see it".
 */
export async function GET() {
  return handle(async () => {
    if (!(await isAdmin())) return fail("Admins only.", 403);

    const categories = await repo().listForModeration(200);
    return json({ categories: categories.map(toModerationRow) });
  });
}
