import { LIMITS, isProduction } from "@/lib/community/config";
import { repo } from "@/lib/community/db";
import { fail, handle, json } from "@/lib/community/http";
import { imageStore } from "@/lib/community/storage";

/**
 * The job that keeps the storage claim honest.
 *
 * Two leaks, both of which accumulate silently:
 *
 * 1. **Abandoned drafts.** Someone names a category, fetches forty pictures,
 *    closes the tab and never comes back. Nothing ever deletes those -- only
 *    the author can delete a category, and by definition they've gone.
 *
 * 2. **Orphaned objects.** Removing an image is deliberately best-effort so a
 *    failed cleanup can't fail someone's save, which means a failed delete
 *    leaves the object behind with nothing pointing at it.
 *
 * Runs daily via `vercel.json`. Vercel signs cron requests with CRON_SECRET,
 * and in production this refuses to run without it -- otherwise it's an
 * unauthenticated endpoint that deletes things.
 */
export const maxDuration = 300;

const authorized = (request: Request): boolean => {
  const secret = process.env.CRON_SECRET?.trim();

  // Vercel sends `Authorization: Bearer $CRON_SECRET` when the variable is set.
  if (secret) {
    return request.headers.get("authorization") === `Bearer ${secret}`;
  }

  // Without a secret, allow it only outside production so the job can be
  // exercised locally. In production a missing secret is a misconfiguration,
  // not a reason to run unauthenticated.
  return !isProduction();
};

export async function GET(request: Request) {
  return handle(async () => {
    if (!authorized(request)) {
      return fail("Not authorized.", 401);
    }

    const store = imageStore();
    const database = repo();

    const cutoff = new Date(
      Date.now() - LIMITS.abandonedDraftDays * 24 * 60 * 60 * 1000
    ).toISOString();

    /* ---------------------------------------------------- abandoned drafts */

    const stale = await database.listStaleDrafts(cutoff, 200);
    let draftImagesDeleted = 0;

    for (const draft of stale) {
      const keys = draft.items
        .map((item) => item.imageKey)
        .filter((key): key is string => Boolean(key));

      await Promise.all(keys.map((key) => store.remove(key)));
      await database.remove(draft.id);
      draftImagesDeleted += keys.length;
    }

    /* --------------------------------------------------- orphaned objects */

    // Read the references *after* deleting drafts, so anything freed above is
    // already accounted for. If this throws we never reach the delete loop,
    // which is the point: a partial set would make live images look orphaned.
    const referenced = await database.allImageKeys();
    const objects = await store.list();

    const graceCutoff = Date.now() - LIMITS.orphanGraceHours * 60 * 60 * 1000;
    const orphans = objects.filter(
      (object) =>
        !referenced.has(object.key) &&
        // An upload is written before the row that references it, so anything
        // recent might simply be mid-flight.
        object.uploadedAt.getTime() < graceCutoff
    );

    const toDelete = orphans.slice(0, LIMITS.maxDeletesPerRun);
    await Promise.all(toDelete.map((object) => store.remove(object.key)));

    const summary = {
      draftsRemoved: stale.length,
      draftImagesDeleted,
      objectsScanned: objects.length,
      orphansFound: orphans.length,
      orphansDeleted: toDelete.length,
      // Surfaced rather than silently truncated: if this is ever non-zero the
      // cap is doing something and someone should look at why.
      orphansSkippedByCap: orphans.length - toDelete.length,
      store: store.describe(),
    };

    console.log("[community] cleanup", summary);
    return json(summary);
  });
}
