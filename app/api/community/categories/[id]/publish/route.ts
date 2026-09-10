import { repo, toView } from "@/lib/community/db";
import { fail, handle, json } from "@/lib/community/http";
import { readKey } from "@/lib/community/identity";
import { assertPublishable } from "@/lib/community/validate";

type Params = { params: Promise<{ id: string }> };

/**
 * Publishing is an explicit act by the author.
 *
 * The previous attempt flipped `is_published` automatically the moment the last
 * image landed -- which meant a half-finished category went live on its own,
 * and, because anyone could write to anyone's row, someone else's upload could
 * publish your draft.
 */
export async function POST(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const key = await readKey();
    const category = await repo().get(id);

    if (!category) return fail("No category with that id.", 404);
    if (!key || category.authorKey !== key) {
      return fail("That isn't your category.", 403);
    }

    assertPublishable(category.items);

    // Items without an image would show a blank board mid-round, so they're
    // dropped at publish time rather than shipped broken.
    const playable = category.items.filter((item) => item.imageUrl);
    if (playable.length !== category.items.length) {
      await repo().saveItems(id, playable);
    }

    const published = await repo().publish(id);
    if (!published) return fail("No category with that id.", 404);

    return json({ category: toView(published, 0, true) });
  });
}
