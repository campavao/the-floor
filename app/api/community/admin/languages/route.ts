import { isAdmin } from "@/lib/community/adminSession";
import { repo } from "@/lib/community/db";
import { detectLanguage } from "@/lib/community/detectLanguage";
import { fail, handle, json } from "@/lib/community/http";

/** Comfortably more than exist today; the button can be pressed again. */
const BATCH = 500;

/**
 * Tag every category from before language tagging existed.
 *
 * There's no creator's browser to fall back on here, so an unsure guess is
 * kept as it is -- the admin page lists the results so a wrong one can be
 * corrected by hand.
 */
export async function POST() {
  return handle(async () => {
    if (!(await isAdmin())) return fail("Admins only.", 403);

    const untagged = await repo().listWithoutLanguage(BATCH);

    let tagged = 0;
    for (const category of untagged) {
      const language = await detectLanguage(
        category.name,
        category.items.map((item) => item.name)
      );
      // A category with no letters in it (all emoji, say) stays untagged and
      // keeps showing under "all languages". Better than a wrong label.
      if (!language) continue;
      await repo().setLanguage(category.id, language);
      tagged += 1;
    }

    const remaining = (await repo().listWithoutLanguage(BATCH)).length;
    return json({ remaining, tagged });
  });
}
