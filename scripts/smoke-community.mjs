/**
 * End-to-end poke at the community API against a running dev server.
 * Usage: node scripts/smoke-community.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3000";

/** Two independent "browsers", so ownership and one-vote-each are real. */
const makeClient = (label) => {
  const jar = new Map();
  return {
    label,
    async call(path, init = {}) {
      const cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
      const response = await fetch(`${base}${path}`, {
        ...init,
        headers: { ...(init.headers ?? {}), ...(cookie ? { cookie } : {}) },
      });
      for (const raw of response.headers.getSetCookie?.() ?? []) {
        const [pair] = raw.split(";");
        const index = pair.indexOf("=");
        jar.set(pair.slice(0, index), pair.slice(index + 1));
      }
      const text = await response.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text.slice(0, 200);
      }
      return { status: response.status, body };
    },
    json(path, method, payload) {
      return this.call(path, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
  };
};

const results = [];
const check = (name, passed, detail = "") => {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? `  -- ${detail}` : ""}`);
};

const author = makeClient("author");
const stranger = makeClient("stranger");

const IMAGE =
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Banana-Sitia-Crete.jpg/1920px-Banana-Sitia-Crete.jpg";
const TINY =
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Banana-Sitia-Crete.jpg/120px-Banana-Sitia-Crete.jpg";

const items = Array.from({ length: 14 }, (_, i) => ({ name: `Snack ${i + 1}` }));

// 1. Create
const created = await author.json("/api/community/categories", "POST", {
  name: "Smoke Test Snacks",
  items,
});
check("create returns a draft", created.status === 201 && created.body.id, `status ${created.status}`);
const id = created.body.id;
const itemIds = created.body.items.map((item) => item.id);

// 2. Publish with no images -> refused
const early = await author.call(`/api/community/categories/${id}/publish`, { method: "POST" });
check("publish refused with no images", early.status === 400, early.body.error);

// 3. Reject an image below the size floor
const tiny = new FormData();
tiny.append("itemId", itemIds[0]);
tiny.append("sourceUrl", TINY);
const tinyResult = await author.call(`/api/community/categories/${id}/images`, {
  method: "POST",
  body: tiny,
});
check(
  "rejects an image below the minimum edge",
  tinyResult.status === 400 && /at least/.test(tinyResult.body.error ?? ""),
  tinyResult.body.error
);

// 4. Refuse an internal address
const ssrf = new FormData();
ssrf.append("itemId", itemIds[0]);
ssrf.append("sourceUrl", "http://127.0.0.1:3000/api/community/categories");
const ssrfResult = await author.call(`/api/community/categories/${id}/images`, {
  method: "POST",
  body: ssrf,
});
check("refuses a private address", ssrfResult.status === 400, ssrfResult.body.error);

// 5. Upload enough real images to publish -- all at once, on purpose.
// Sequential uploads hid a lost update: each request rewrote the whole item
// array from its own snapshot, so parallel ones overwrote each other.
//
// The bytes are posted as files, which is what the browser does: it fetches
// and shrinks the image itself so fifty downloads don't all come from one
// datacenter IP. Twelve concurrent server-side fetches of the same URL is
// something no real client does and something Wikimedia rate-limits.
const sample = await fetch(IMAGE, {
  headers: { "User-Agent": "the-floor-smoke/1.0 (+https://the-floor-game.vercel.app)" },
});
if (!sample.ok) {
  check(`fetch sample image (HTTP ${sample.status})`, false);
  process.exit(1);
}
const bytes = new Uint8Array(await sample.arrayBuffer());

const uploads = await Promise.all(
  itemIds.slice(0, 12).map(async (itemId) => {
    const form = new FormData();
    form.append("itemId", itemId);
    form.append("file", new Blob([bytes], { type: "image/jpeg" }), "image.jpg");
    form.append("creditSource", "Wikimedia Commons");
    const result = await author.call(`/api/community/categories/${id}/images`, {
      method: "POST",
      body: form,
    });
    if (result.status !== 200) console.log("   upload failed:", result.status, result.body);
    return result.status === 200;
  })
);
check("uploads 12 images concurrently", uploads.every(Boolean), `${uploads.filter(Boolean).length}/12`);

// The server-side fetch path still exists for pasted links, so check it once
// rather than twelve times at once.
const viaUrl = new FormData();
viaUrl.append("itemId", itemIds[12]);
viaUrl.append("sourceUrl", IMAGE);
const urlResult = await author.call(`/api/community/categories/${id}/images`, {
  method: "POST",
  body: viaUrl,
});
check(
  "server can still fetch a pasted URL",
  urlResult.status === 200,
  urlResult.body?.error ?? "ok"
);

// 12 from the concurrent batch plus the one fetched server-side.
const EXPECTED_WITH_IMAGES = 13;

const afterUpload = await author.call(`/api/community/categories/${id}`);
const withImages = afterUpload.body.category?.items?.filter((item) => item.imageUrl).length;
check(
  "concurrent uploads all survive",
  withImages === EXPECTED_WITH_IMAGES,
  `${withImages}/${EXPECTED_WITH_IMAGES} items kept an image`
);

// 6. Stranger cannot upload into someone else's category
const intruder = new FormData();
intruder.append("itemId", itemIds[0]);
intruder.append("sourceUrl", IMAGE);
const intruderResult = await stranger.call(`/api/community/categories/${id}/images`, {
  method: "POST",
  body: intruder,
});
check("stranger cannot upload", intruderResult.status === 403, intruderResult.body.error);

// 7. Publish
const published = await author.call(`/api/community/categories/${id}/publish`, { method: "POST" });
check("publishes once it has enough", published.status === 200, `status ${published.status}`);
check(
  "drops items that never got an image",
  published.body.category?.items?.length === EXPECTED_WITH_IMAGES,
  `${published.body.category?.items?.length} items`
);
check(
  "never returns the author key",
  published.body.category && !("authorKey" in published.body.category)
);

// 8. Listing
const listed = await stranger.call("/api/community/categories?sort=new");
const found = listed.body.categories?.find((c) => c.id === id);
check("appears in the public list", Boolean(found), `${listed.body.categories?.length} listed`);
check("list omits the full item array", found && !("items" in found));

// 9. Voting
const selfVote = await author.json(`/api/community/categories/${id}/vote`, "POST", { direction: 1 });
check("author cannot vote on their own", selfVote.status === 403, selfVote.body.error);

const up = await stranger.json(`/api/community/categories/${id}/vote`, "POST", { direction: 1 });
check("stranger can upvote", up.status === 200 && up.body.upvotes === 1, JSON.stringify(up.body));

const again = await stranger.json(`/api/community/categories/${id}/vote`, "POST", { direction: 1 });
check("voting twice does not double count", again.body.upvotes === 1, JSON.stringify(again.body));

const flipped = await stranger.json(`/api/community/categories/${id}/vote`, "POST", { direction: -1 });
check(
  "flipping moves the vote across",
  flipped.body.upvotes === 0 && flipped.body.downvotes === 1,
  JSON.stringify(flipped.body)
);

const cleared = await stranger.json(`/api/community/categories/${id}/vote`, "POST", { direction: 0 });
check(
  "zero takes the vote back",
  cleared.body.upvotes === 0 && cleared.body.downvotes === 0,
  JSON.stringify(cleared.body)
);

const bogus = await stranger.json(`/api/community/categories/${id}/vote`, "POST", { direction: 7 });
check("rejects a bogus direction", bogus.status === 400, bogus.body.error);

// 10. Reporting
const reporters = [makeClient("r1"), makeClient("r2"), makeClient("r3")];
let hidden = false;
for (const reporter of reporters) {
  const result = await reporter.json(`/api/community/categories/${id}/report`, "POST", {
    reason: "test",
  });
  hidden = result.body.hidden;
}
check("auto-hides after enough reports", hidden === true, `hidden=${hidden}`);

const afterHide = await stranger.call("/api/community/categories?sort=new");
check(
  "hidden category drops out of the listing",
  !afterHide.body.categories?.some((c) => c.id === id)
);

// 11. Admin. Only exercised when the secret is in the environment, since a
// deployment without one has no admin to test.
const adminSecret = process.env.COMMUNITY_ADMIN_SECRET?.trim();
if (adminSecret) {
  const admin = makeClient("admin");

  const anon = await admin.call("/api/community/admin/categories");
  check("moderation list needs a session", anon.status === 403, anon.body.error);

  const wrong = await admin.json("/api/community/admin/session", "POST", { secret: "nope" });
  check("wrong secret is refused", wrong.status === 403, wrong.body.error);

  const strangerHide = await stranger.json(`/api/community/categories/${id}/moderate`, "POST", {
    hidden: false,
  });
  check("stranger cannot unhide", strangerHide.status === 403, strangerHide.body.error);

  const signedIn = await admin.json("/api/community/admin/session", "POST", { secret: adminSecret });
  check("admin can sign in", signedIn.status === 200 && signedIn.body.admin === true);

  const who = await admin.call("/api/community/admin/session");
  check("session sticks", who.body.admin === true, JSON.stringify(who.body));

  const seesHidden = await admin.call(`/api/community/categories/${id}`);
  check(
    "admin can open a hidden category",
    seesHidden.status === 200 && seesHidden.body.category?.canEdit === true,
    `status ${seesHidden.status}`
  );

  const list = await admin.call("/api/community/admin/categories");
  const row = list.body.categories?.find((c) => c.id === id);
  check("hidden category is in the moderation list", Boolean(row?.hiddenAt));

  const unhidden = await admin.json(`/api/community/categories/${id}/moderate`, "POST", {
    hidden: false,
  });
  check(
    "admin can unhide, which clears the reports",
    unhidden.status === 200 &&
      unhidden.body.category?.hiddenAt === null &&
      unhidden.body.category?.reportCount === 0,
    JSON.stringify({ status: unhidden.status, error: unhidden.body.error })
  );

  const backInList = await stranger.call("/api/community/categories?sort=new");
  check("unhidden category is listed again", backInList.body.categories?.some((c) => c.id === id));

  const replaced = new FormData();
  replaced.append("itemId", itemIds[0]);
  replaced.append("file", new Blob([bytes], { type: "image/jpeg" }), "image.jpg");
  replaced.append("creditSource", "Admin replacement");
  const replacedResult = await admin.call(`/api/community/categories/${id}/images`, {
    method: "POST",
    body: replaced,
  });
  check(
    "admin can replace a picture",
    replacedResult.status === 200 && replacedResult.body.item?.credit?.source === "Admin replacement",
    replacedResult.body?.error ?? "ok"
  );

  const trimmed = await admin.json(`/api/community/categories/${id}`, "PATCH", {
    items: itemIds.slice(1, EXPECTED_WITH_IMAGES).map((itemId) => ({ id: itemId, name: `Snack ${itemId}` })),
  });
  check(
    "admin can drop an item",
    trimmed.status === 200 && trimmed.body.category?.items?.length === EXPECTED_WITH_IMAGES - 1,
    `${trimmed.body.category?.items?.length} items`
  );

  const signedOut = await admin.call("/api/community/admin/session", { method: "DELETE" });
  const afterOut = await admin.call("/api/community/admin/categories");
  check("sign out ends the session", signedOut.status === 200 && afterOut.status === 403);
} else {
  console.log("skip  admin checks (set COMMUNITY_ADMIN_SECRET to run them)");
}

// 12. Cleanup
const deleted = await author.call(`/api/community/categories/${id}`, { method: "DELETE" });
check("author can delete", deleted.status === 200, `status ${deleted.status}`);

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length === 0 ? 0 : 1);
