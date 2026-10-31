import { imageStore } from "@/lib/community/storage";
import { repo, toView } from "@/lib/community/db";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { readKey } from "@/lib/community/identity";
import { isAdmin } from "@/lib/community/adminSession";
import { InvalidInput, parseItems, parseLanguage } from "@/lib/community/validate";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const category = await repo().get(id);
    if (!category) return fail("No category with that id.", 404);

    const key = await readKey();
    const isOwner = Boolean(key) && category.authorKey === key;
    const admin = await isAdmin();
    const canEdit = isOwner || admin;

    // Drafts are only visible to whoever started them, and a category the
    // community has reported into the ground stops being browsable. The
    // admin sees both -- a hidden category is exactly the one they need to
    // look at.
    if (category.status === "draft" && !canEdit) {
      return fail("No category with that id.", 404);
    }
    if (category.hiddenAt && !canEdit) {
      return fail("That category is hidden pending review.", 410);
    }

    const votes = key ? await repo().getVotes([id], key) : {};
    return json({
      category: toView(category, votes[id] ?? 0, isOwner, admin),
    });
  });
}

/**
 * Rename, reorder, add or drop items, or change the language. Owner or admin.
 *
 * Either field may be sent alone: the language picker shouldn't have to
 * round-trip fifty items to change one word.
 */
export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const key = await readKey();
    const category = await repo().get(id);

    if (!category) return fail("No category with that id.", 404);
    const isOwner = Boolean(key) && category.authorKey === key;
    const admin = await isAdmin();
    if (!isOwner && !admin) {
      return fail("That isn't your category.", 403);
    }

    const body = await readJson(request);
    if (body.items === undefined && body.language === undefined) {
      throw new InvalidInput("Nothing to change.");
    }

    // Validate both before writing either, so a bad language can't leave the
    // items saved and the request reported as failed.
    const language =
      body.language === undefined ? undefined : parseLanguage(body.language);

    if (language && body.items === undefined) {
      const relabelled = await repo().setLanguage(id, language);
      if (!relabelled) return fail("No category with that id.", 404);
      return json({ category: toView(relabelled, 0, isOwner, admin) });
    }

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

    let saved = await repo().saveItems(id, items);
    if (saved && language) saved = await repo().setLanguage(id, language);
    if (!saved) return fail("No category with that id.", 404);

    await Promise.all(orphaned.map((imageKey) => imageStore().remove(imageKey)));

    return json({ category: toView(saved, 0, isOwner, admin) });
  });
}

/** Owner or admin. Takes the images with it. */
export async function DELETE(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const key = await readKey();
    const category = await repo().get(id);

    if (!category) return fail("No category with that id.", 404);
    const isOwner = Boolean(key) && category.authorKey === key;
    if (!isOwner && !(await isAdmin())) {
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
