import { imageStore } from "@/lib/community/storage";
import { repo, toView } from "@/lib/community/db";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { readKey } from "@/lib/community/identity";
import { parseItems } from "@/lib/community/validate";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const category = await repo().get(id);
    if (!category) return fail("No category with that id.", 404);

    const key = await readKey();
    const isOwner = Boolean(key) && category.authorKey === key;

    // Drafts are only visible to whoever started them, and a category the
    // community has reported into the ground stops being browsable.
    if (category.status === "draft" && !isOwner) {
      return fail("No category with that id.", 404);
    }
    if (category.hiddenAt && !isOwner) {
      return fail("That category is hidden pending review.", 410);
    }

    const votes = key ? await repo().getVotes([id], key) : {};
    return json({ category: toView(category, votes[id] ?? 0, isOwner) });
  });
}

/** Rename, reorder, add or drop items. Owner only. */
export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const key = await readKey();
    const category = await repo().get(id);

    if (!category) return fail("No category with that id.", 404);
    if (!key || category.authorKey !== key) {
      return fail("That isn't your category.", 403);
    }

    const body = await readJson(request);
    // `existing` carries the stored image fields across, so a client can
    // reorder or rename without being able to invent an imageUrl.
    const items = parseItems(body.items, { existing: category.items });

    const keptKeys = new Set(
      items.map((item) => item.imageKey).filter(Boolean) as string[]
    );
    const orphaned = category.items
      .map((item) => item.imageKey)
      .filter((imageKey): imageKey is string => Boolean(imageKey))
      .filter((imageKey) => !keptKeys.has(imageKey));

    const saved = await repo().saveItems(id, items);
    if (!saved) return fail("No category with that id.", 404);

    await Promise.all(orphaned.map((imageKey) => imageStore().remove(imageKey)));

    return json({ category: toView(saved, 0, true) });
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const key = await readKey();
    const category = await repo().get(id);

    if (!category) return fail("No category with that id.", 404);
    if (!key || category.authorKey !== key) {
      return fail("That isn't your category.", 403);
    }

    await repo().remove(id);
    await Promise.all(
      category.items
        .map((item) => item.imageKey)
        .filter((imageKey): imageKey is string => Boolean(imageKey))
        .map((imageKey) => imageStore().remove(imageKey))
    );

    return json({ deleted: true });
  });
}
