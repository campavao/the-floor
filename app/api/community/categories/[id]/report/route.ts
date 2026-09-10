import { LIMITS } from "@/lib/community/config";
import { repo } from "@/lib/community/db";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { ensureKey } from "@/lib/community/identity";
import { cleanText } from "@/lib/community/validate";

type Params = { params: Promise<{ id: string }> };

/**
 * Flag a category as offensive or broken.
 *
 * Nobody is moderating this pool in real time, so reports have to do something
 * on their own: once `reportsBeforeAutoHide` different browsers flag the same
 * category it drops out of every listing immediately and waits for a human.
 * That's a deliberately low bar -- a wrongly hidden category costs one person
 * some annoyance, and the alternative costs everyone.
 */
export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const body = await readJson(request);
    const reason = cleanText(body.reason).slice(0, 500);

    const category = await repo().get(id);
    if (!category || category.status !== "published") {
      return fail("No category with that id.", 404);
    }

    const reporterKey = await ensureKey();
    const result = await repo().report(id, reporterKey, reason);
    if (!result) return fail("No category with that id.", 404);

    return json({
      reported: true,
      hidden: result.hidden,
      threshold: LIMITS.reportsBeforeAutoHide,
    });
  });
}
