# The community category pool

Two pools, on purpose.

**Curated** — the categories in `app/data.ts`, images in `public/images/`. Hand
made, reviewed in a pull request, deployed with the site. Free forever, because
they're just files in the repo. Nothing here changes that.

**Community** — made in the browser at `/community/create` by anyone, stored
outside the repo, never reviewed by a human before it goes live. Votes rank it;
reports hide it. This is the new part.

The game treats them the same once a host picks one. Everything else about them
is different, including who is responsible for what's in them.

## Trying it with no accounts and no keys

```bash
npm run dev
```

Open <http://localhost:3000/community/create>. It works immediately: categories
go to `.community-dev/db.json` and images to `public/community-dev/`, both
gitignored. The AI suggest button is the only thing that won't work — type or
paste a list instead.

This fallback refuses to start in production, so there's no way to accidentally
ship it.

## Going live

Three services, all on free tiers.

### 1. Images — Cloudflare R2

R2 rather than Vercel Blob for one reason: **egress is free**. Blob's Hobby
allowance is 1 GB stored and 2,000 writes a month, and one 50-item category is
50 writes — so about 40 categories a month, and blowing through it disables Blob
for 30 days with no way to pay your way out. R2's free tier is 10 GB, 1M writes,
10M reads, and unlimited bandwidth.

1. Create a bucket (R2 → Create bucket).
2. Give it a public URL: either enable the `r2.dev` subdomain (fine to start,
   rate-limited and not meant for production) or attach a custom domain.
3. Create an API token with **Object Read & Write** on that bucket.
4. Add a CORS policy, or the image editor can't read pixels back out of the
   canvas:

```json
[
  {
    "AllowedOrigins": ["https://the-floor-game.vercel.app", "http://localhost:3000"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=the-floor-community
R2_PUBLIC_BASE_URL=https://images.example.com
```

### 2. Categories — Postgres

Any Postgres works. Neon through the Vercel Marketplace keeps billing in one
place and scales to zero without the manual un-pausing that Supabase's free tier
needs after a quiet week.

```bash
psql "$DATABASE_URL" -f lib/community/schema.sql
```

```
DATABASE_URL=postgres://...
```

### 3. Item suggestions — Vercel AI Gateway

```
AI_GATEWAY_API_KEY=...
```

On Vercel this can come from the deployment's OIDC token instead — `vercel link`
pulls one into `.env.local`, so local development needs no key at all.

**The Gateway will not serve a request until there's a card on file**, even for
the free credits. It answers 403 `customer_verification_required` until you add
one under AI Gateway in the dashboard. Adding a card doesn't charge you.

What the card gets you is less than it sounds, and it's worth being precise
because the marketing isn't. Tested on a Hobby account with a card and the
full $5 credit unspent:

- **Newer models refuse outright.** Anything at `gemini-3.x` and up answers
  "Free tier users do not have access to this model", credit balance
  irrelevant.
- **Older models work but are rate-limited hard.** A handful of requests in a
  row exhausts the limit for that model, and it takes minutes to recover.
- **The $5 credit does not lift the limit.** Only *purchasing* credits moves
  you to the paid tier — and doing that **permanently ends the monthly $5**.

In practice that's fine for what this does: one person clicking "suggest" once
per category is exactly the shape the free tier tolerates. Generating fifty
categories back to back is not. `SUGGEST_MODELS` in `lib/community/config.ts`
lists the models verified to answer, tried in order — the limits are per model,
so the second usually works when the first won't.

Without any of this the suggest button explains itself and the rest of the tool
works. Typing or pasting a list is the fallback, and it's what the flow is
built around anyway.

## What it costs

Measured, not guessed — run `node scripts/bench-image-size.mjs` to redo it.

| | |
| --- | --- |
| Stored image | ~129 KB average (WebP, 1600px long edge, q80) |
| One 50-item category | ~6.3 MB |
| R2's free 10 GB | ~1,600 categories |
| Egress | free, any volume |
| 50 AI suggestions | ~1.5K output tokens, a fraction of a cent |
| AI Gateway free credit | $5/month — thousands of category generations |

For comparison, the 40 curated categories in the repo average 135 KB per image
across 1,972 files, so a community category costs about what a curated one does.

The thing that actually protects the budget is `lib/community/config.ts`. Every
image is re-encoded to a bounded WebP before it's stored, so nobody can upload a
25 MB JPEG and have it served to a projector. Raise `storedImageMaxEdge` and the
numbers above move with it; dropping to 1280/78 roughly halves them.

Two rules worth not breaking:

- **Community images never go through `next/image`.** Hobby includes 5,000
  transformations a month and an unmoderated pool would eat that in a day. They
  are plain `<img>` tags pointed at R2, which is already a CDN.
- **Keys are content-hashed and served `immutable`.** A given URL's bytes never
  change, so repeat views are cache hits and cost nothing.

## How it's put together

```
lib/community/
  config.ts     limits, credentials, the cost knobs
  db.ts         Postgres, plus the on-disk dev fallback
  storage.ts    R2, plus the on-disk dev fallback
  images.ts     sharp normalisation + SSRF-guarded fetching
  inpaint.ts    the erase brush (see below)
  search.ts     Commons + Openverse, runs in the browser
  validate.ts   what we accept from a request
  admin.ts      the shared admin secret and the cookie derived from it
app/api/community/...   the routes
app/community/...       browse, create, edit and admin pages
```

### 4. Branded and pop-culture images — Serper (optional)

```
SERPER_API_KEY=...
```

Commons and Openverse are free-licence archives. They contain essentially no
trademarked artwork, and no amount of keyword tuning changes that — searching
Commons for "Tony the Tiger" returns a wristwatch, and "Snap Crackle and Pop"
returns a tugboat. If your categories are cereal mascots, video game characters
or brand logos, that's the wall you hit.

Serper is a Google Images API: 2,500 searches a month free, then about $1 per
1,000. With a key set, "Web images" appears as a source in the Find dialog and
an opt-in checkbox appears for auto-fill.

**Auto-fill leaves it off by default on purpose** — one 50-item category spends
fifty searches, so the free allowance is about fifty categories a month if
every one uses it. Leaving it to the Find dialog means the quota is spent only
on the items that actually need it.

Without the key nothing changes: the source isn't offered, and paste-a-link and
upload stay the fallback.

### Image search runs in the browser

Wikimedia Commons and Openverse are keyless and send CORS headers, so searching
costs us nothing at all — no functions, no bandwidth, no API key. Only the image
an author actually keeps is sent to the server.

This is a deliberate change from the earlier attempt, which called Google's
Custom Search JSON API. That API is closed to new customers and shuts down on
2027-01-01, and its fallback — scraping Google's HTML from a serverless function
— gets a consent page rather than pictures.

The honest limitation: these sources are excellent for animals, food, places,
plants and public figures, and thin for branded or pop-culture things. "Pokémon"
will not go well. That's what the paste-a-link and upload-a-file paths are for,
and why the picker mentions them when a search comes back empty.

### The erase brush is real inpainting

`lib/community/inpaint.ts` walks inward from the edge of the painted region and
gives each pixel a distance-weighted average of the neighbours already known —
the approach OpenCV calls `INPAINT_TELEA`, which is what the original desktop
tool fell back to. Because it only reads from outside the mask, the watermark
never contributes to its own replacement.

Blurring the masked area instead leaves a grey ghost in the shape of the logo.
`tests/inpaint.test.ts` asserts the difference.

It's good on the backgrounds watermarks usually sit on and only passable across
hard edges, which is why Crop sits next to it and is often the better tool.

## Moderation

There isn't any, in the sense of a person checking things before they appear.
What there is instead:

- Drafts are private to their author until explicitly published.
- Publishing requires at least 12 items with images; items without one are
  dropped rather than shipped broken.
- Three reports from three different browsers hides a category from every
  listing immediately, pending a look. Deliberately a low bar.
- Votes rank; they don't publish or unpublish.

Identity is a random key in an httpOnly cookie the server sets. It's not an
account — someone determined can clear cookies and vote again — but a page
can't claim to be a different voter, which is the part that matters.

### The admin

Reports take three browsers and then wait for "a look". When someone publishes
a photo that has to come down *now*, that isn't fast enough — and the author's
cookie is the only thing that can edit a category, so without this the fix is
a database session.

```
COMMUNITY_ADMIN_SECRET=...
```

One shared secret, long and random (`openssl rand -base64 32` is fine). Sign
in at `/community/admin` and you can do, to any category, what its author can:

- **Edit** it — every category page grows an *Edit* button that opens the same
  Find / Edit / Remove grid the create page uses. *Find* swaps in a different
  picture, *Edit* crops or erases part of it, *×* drops the item. Replacing a
  picture deletes the old object from storage in the same request, so the
  offending image is gone rather than just unlinked.
- **Hide** it from every listing, or **unhide** one the reports got wrong.
  Unhiding clears the reports too — otherwise the next one would tip it
  straight back over the threshold.
- **Delete** it, images and all.

The admin page lists everything — drafts and hidden categories included,
hidden first, then the most reported — with those three actions on each row.

What it doesn't do: the secret never goes into the cookie (the cookie holds an
HMAC derived from it, so rotating the secret signs every admin out), and there
is no account, no roles and no audit log. For one or two people running a fan
game that's the right amount of machinery; anything more would want real
accounts. Without the variable set, `/community/admin` says so and every admin
route answers 403.

One thing to know: adding a category to a game copies it into that browser's
localStorage, so a game that already has the bad version keeps its own copy.
The old image URL stops working the moment it's replaced, though, so the
square shows as broken rather than showing the picture.

## Keeping storage honest

Two leaks accumulate on their own, so `/api/community/cleanup` runs daily
(`vercel.json`, 4am, the once-a-day maximum a Hobby account allows):

- **Abandoned drafts.** Someone names a category, fetches forty pictures and
  closes the tab. Only the author can delete a category, and they've gone.
  Drafts untouched for `abandonedDraftDays` (7) go, images and all.
- **Orphaned objects.** Deleting an image is deliberately best-effort so a
  failed cleanup can't fail somebody's save — which means a failed delete
  leaves the object behind with nothing pointing at it. Anything the database
  doesn't reference is swept.

Three guards, because this endpoint deletes things:

- Objects younger than `orphanGraceHours` (24) are never swept. An upload is
  written *before* the row that references it, so a recent unreferenced object
  is normal rather than garbage.
- The reference set is read before any deletion and a failure aborts the run —
  a partial answer would make live images look orphaned.
- `maxDeletesPerRun` (500) caps the damage from a bug, and anything skipped is
  reported rather than silently dropped.

`CRON_SECRET` must be set. Vercel signs cron requests with it, and in
production the route refuses to run without it — otherwise it's an
unauthenticated endpoint that deletes things. Run it by hand with:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://…/api/community/cleanup
```

It answers with what it did, and doing nothing is the normal result.

### Should uploads wait until publish instead?

They could, and it would remove the abandoned-draft half of this. The reason
they don't: the draft is server-side, so closing the tab halfway through fifty
images loses nothing. Holding them in the browser instead would make publish a
fifty-file upload that can fail halfway, and would trade this job for
IndexedDB persistence. It also wouldn't remove the orphan sweep, since
best-effort deletes leak either way.

### Promoting to curated

The intended path for anything good: pull its images into `public/images/`, add
it to `app/data.ts`, open a PR, then delete the community copy. The best content
becomes free-forever repo content and storage stays bounded. Voting is the
shortlist.

## Checking it still works

```bash
npm test                                  # unit tests, no server needed
npm run dev
node scripts/smoke-community.mjs          # the API, including the security rules
npm install --no-save playwright
node scripts/e2e-community.mjs            # the whole flow in a browser
```

The last one creates a category, watches every cell fetch a picture, paints and
erases in the editor, publishes, votes, adds it to a game, and confirms it turns
up in the presenter's category list and plays.

The Postgres statements need their own check, because the app reaches Neon over
an HTTP driver that only speaks to Neon — so nothing above touches them. Point
this at any Postgres:

```bash
npm install --no-save pg
node scripts/verify-schema-sql.mjs "postgres://..."
```

It applies the schema and exercises the two statements that have to be right
under concurrency: the per-item `jsonb` patch several uploads run at once, and
the vote recount. Both are checked with parallel writers.

`scripts/bench-image-size.mjs` re-measures the storage numbers above against
live Commons images.
