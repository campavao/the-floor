import { repo, toView } from "@/lib/community/db";
import { isAdmin } from "@/lib/community/adminSession";
import { fail, handle, json, readJson } from "@/lib/community/http";

type Params = { params: Promise<{ id: string }> };

/**
 * Hide a category, or put one back that the reports got wrong.
 *
 * Reports auto-hide at a deliberately low bar and then wait for "a look".
 * This is the look. Unhiding clears the reports as well, otherwise the next
 * one would tip it straight back over the threshold.
 */
export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    if (!(await isAdmin())) return fail("Admins only.", 403);

    const { id } = await params;
    const body = await readJson(request);
    if (typeof body.hidden !== "boolean") {
      return fail("hidden must be true or false.");
    }

    const category = await repo().setHidden(id, body.hidden);
    if (!category) return fail("No category with that id.", 404);

    return json({ category: toView(category, 0, false, true) });
  });
}
