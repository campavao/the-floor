import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { neon } from "@neondatabase/serverless";

import { LIMITS, NotConfigured, databaseUrl, isProduction } from "./config";
import { newId, slugify } from "./ids";
import type {
  CommunityCategoryRecord,
  CommunityCategorySummary,
  CommunityCategoryView,
  CommunityItem,
  ListOptions,
  ModerationRow,
} from "./types";

/** Same as the public record, plus the owner token the API must never leak. */
export type StoredCategory = CommunityCategoryRecord & { authorKey: string };

export type VoteDirection = -1 | 0 | 1;

/**
 * A search term made literal for ILIKE, so typing "100%" or "a_b" searches for
 * those characters instead of treating them as wildcards. Backslash is
 * Postgres's default LIKE escape.
 */
const likePattern = (query: string | undefined) =>
  (query ?? "").trim().replace(/[\\%_]/g, (match) => `\\${match}`);

export type Repo = {
  create(input: {
    name: string;
    items: CommunityItem[];
    authorKey: string;
    language?: string | null;
  }): Promise<StoredCategory>;
  get(id: string): Promise<StoredCategory | undefined>;
  saveItems(id: string, items: CommunityItem[]): Promise<StoredCategory | undefined>;
  /**
   * Merge a patch into one item, atomically.
   *
   * The grid uploads several images at once, and each upload used to read the
   * whole item array, change one entry and write it all back -- so three
   * concurrent uploads kept whichever finished last and silently dropped the
   * other two. This has to touch only the row it means to.
   */
  updateItem(
    id: string,
    itemId: string,
    patch: Partial<CommunityItem>
  ): Promise<StoredCategory | undefined>;
  publish(id: string): Promise<StoredCategory | undefined>;
  /**
   * Take a category out of every listing, or put it back.
   *
   * Unhiding also clears its reports: it's been looked at, and leaving the
   * count where it was would mean the very next report hides it again.
   */
  setHidden(id: string, hidden: boolean): Promise<StoredCategory | undefined>;
  setLanguage(id: string, language: string): Promise<StoredCategory | undefined>;
  remove(id: string): Promise<void>;
  list(options: ListOptions): Promise<StoredCategory[]>;
  /** How many browsable categories each language has, most first. */
  languageCounts(): Promise<Array<{ language: string; count: number }>>;
  /** Categories from before language tagging, for the admin's backfill. */
  listWithoutLanguage(limit: number): Promise<StoredCategory[]>;
  /**
   * Everything, for the admin: drafts and hidden categories included, the
   * ones most in need of a look first.
   */
  listForModeration(limit: number): Promise<StoredCategory[]>;
  listByAuthor(authorKey: string): Promise<StoredCategory[]>;
  /** Drafts nobody has touched since `before`, for the cleanup job. */
  listStaleDrafts(before: string, limit: number): Promise<StoredCategory[]>;
  /**
   * Every image key any category still points at.
   *
   * The cleanup job diffs this against the bucket, so a partial result would
   * make live images look unreferenced -- implementations must return all of
   * them or throw.
   */
  allImageKeys(): Promise<Set<string>>;
  vote(
    id: string,
    voterKey: string,
    direction: VoteDirection
  ): Promise<{ upvotes: number; downvotes: number } | undefined>;
  getVotes(
    ids: string[],
    voterKey: string
  ): Promise<Record<string, VoteDirection>>;
  report(
    id: string,
    reporterKey: string,
    reason: string
  ): Promise<{ reportCount: number; hidden: boolean } | undefined>;
  describe(): string;
};

const now = () => new Date().toISOString();

const blankCategory = (
  name: string,
  items: CommunityItem[],
  authorKey: string,
  language: string | null = null
): StoredCategory => ({
  id: newId(),
  name,
  slug: slugify(name),
  status: "draft",
  items,
  authorKey,
  upvotes: 0,
  downvotes: 0,
  reportCount: 0,
  hiddenAt: null,
  createdAt: now(),
  updatedAt: now(),
  publishedAt: null,
  language,
});

/** Strips `authorKey` and answers the questions the UI needs about you. */
export const toView = (
  category: StoredCategory,
  myVote: VoteDirection,
  isOwner: boolean,
  isAdmin = false
): CommunityCategoryView => {
  const { authorKey: _authorKey, ...rest } = category;
  return {
    ...rest,
    language: category.language ?? null,
    myVote,
    isOwner,
    isAdmin,
    canEdit: isOwner || isAdmin,
  };
};

export const toModerationRow = (category: StoredCategory): ModerationRow => ({
  id: category.id,
  name: category.name,
  status: category.status,
  itemCount: category.items.length,
  previewImageUrls: category.items
    .map((item) => item.imageUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 4),
  upvotes: category.upvotes,
  downvotes: category.downvotes,
  reportCount: category.reportCount,
  hiddenAt: category.hiddenAt,
  publishedAt: category.publishedAt,
  updatedAt: category.updatedAt,
  language: category.language ?? null,
});

export const toSummary = (
  category: StoredCategory,
  myVote: VoteDirection,
  isOwner: boolean
): CommunityCategorySummary => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  itemCount: category.items.length,
  previewImageUrls: category.items
    .map((item) => item.imageUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 4),
  upvotes: category.upvotes,
  downvotes: category.downvotes,
  score: category.upvotes - category.downvotes,
  publishedAt: category.publishedAt,
  language: category.language ?? null,
  myVote,
  isOwner,
});

/* -------------------------------------------------------------------------- */
/* Postgres                                                                    */
/* -------------------------------------------------------------------------- */

type Row = Record<string, unknown>;

const fromRow = (row: Row): StoredCategory => ({
  id: String(row.id),
  name: String(row.name),
  slug: String(row.slug),
  status: row.status === "published" ? "published" : "draft",
  items: (row.items as CommunityItem[]) ?? [],
  authorKey: String(row.author_key),
  upvotes: Number(row.upvotes ?? 0),
  downvotes: Number(row.downvotes ?? 0),
  reportCount: Number(row.report_count ?? 0),
  hiddenAt: row.hidden_at ? new Date(row.hidden_at as string).toISOString() : null,
  createdAt: new Date(row.created_at as string).toISOString(),
  updatedAt: new Date(row.updated_at as string).toISOString(),
  publishedAt: row.published_at
    ? new Date(row.published_at as string).toISOString()
    : null,
  language: typeof row.language === "string" ? row.language : null,
});

const postgresRepo = (connectionString: string): Repo => {
  const sql = neon(connectionString);

  return {
    async create({ name, items, authorKey, language }) {
      const draft = blankCategory(name, items, authorKey, language);
      await sql`
        insert into community_categories
               (id, name, slug, status, items, author_key, language)
        values (${draft.id}, ${draft.name}, ${draft.slug}, 'draft',
                ${JSON.stringify(items)}::jsonb, ${authorKey}, ${draft.language})
      `;
      return draft;
    },

    async get(id) {
      const rows = await sql`
        select * from community_categories where id = ${id}
      `;
      return rows[0] ? fromRow(rows[0]) : undefined;
    },

    async saveItems(id, items) {
      const rows = await sql`
        update community_categories
           set items = ${JSON.stringify(items)}::jsonb, updated_at = now()
         where id = ${id}
        returning *
      `;
      return rows[0] ? fromRow(rows[0]) : undefined;
    },

    async updateItem(id, itemId, patch) {
      // One statement, so Postgres' row lock serialises concurrent uploads
      // instead of letting them overwrite each other's items.
      const rows = await sql`
        update community_categories
           set items = coalesce((
                 select jsonb_agg(
                          case when element->>'id' = ${itemId}
                               then element || ${JSON.stringify(patch)}::jsonb
                               else element
                          end
                          order by ordinality
                        )
                   from jsonb_array_elements(items)
                        with ordinality as entries(element, ordinality)
               ), '[]'::jsonb),
               updated_at = now()
         where id = ${id}
        returning *
      `;
      return rows[0] ? fromRow(rows[0]) : undefined;
    },

    async publish(id) {
      const rows = await sql`
        update community_categories
           set status = 'published',
               published_at = coalesce(published_at, now()),
               updated_at = now()
         where id = ${id}
        returning *
      `;
      return rows[0] ? fromRow(rows[0]) : undefined;
    },

    async setHidden(id, hidden) {
      if (!hidden) {
        await sql`delete from community_reports where category_id = ${id}`;
      }
      const rows = hidden
        ? await sql`
            update community_categories
               set hidden_at = coalesce(hidden_at, now()), updated_at = now()
             where id = ${id}
            returning *
          `
        : await sql`
            update community_categories
               set hidden_at = null, report_count = 0, updated_at = now()
             where id = ${id}
            returning *
          `;
      return rows[0] ? fromRow(rows[0]) : undefined;
    },

    async remove(id) {
      await sql`delete from community_categories where id = ${id}`;
    },

    async setLanguage(id, language) {
      // Deliberately leaves updated_at alone: the cleanup job reads it as
      // "last worked on", and relabelling isn't work on the category.
      const rows = await sql`
        update community_categories set language = ${language}
         where id = ${id}
        returning *
      `;
      return rows[0] ? fromRow(rows[0]) : undefined;
    },

    async list({ sort, limit, offset, query, language }) {
      // "%" alone matches every name, so a blank search is the plain listing.
      const pattern = `%${likePattern(query)}%`;
      // Likewise a null language is "any".
      const lang = language || null;
      const rows =
        sort === "new"
          ? await sql`
              select * from community_categories
               where status = 'published' and hidden_at is null
                 and name ilike ${pattern}
                 and (${lang}::text is null or language = ${lang})
               order by published_at desc nulls last
               limit ${limit} offset ${offset}
            `
          : await sql`
              select * from community_categories
               where status = 'published' and hidden_at is null
                 and name ilike ${pattern}
                 and (${lang}::text is null or language = ${lang})
               order by (upvotes - downvotes) desc, published_at desc nulls last
               limit ${limit} offset ${offset}
            `;
      return rows.map(fromRow);
    },

    async languageCounts() {
      const rows = await sql`
        select language, count(*)::int as count
          from community_categories
         where status = 'published' and hidden_at is null
           and language is not null
         group by language
         order by count desc, language
      `;
      return rows.map((row) => ({
        language: String(row.language),
        count: Number(row.count),
      }));
    },

    async listWithoutLanguage(limit) {
      const rows = await sql`
        select * from community_categories
         where language is null
         order by created_at
         limit ${limit}
      `;
      return rows.map(fromRow);
    },

    async listByAuthor(authorKey) {
      const rows = await sql`
        select * from community_categories
         where author_key = ${authorKey}
         order by updated_at desc
         limit 50
      `;
      return rows.map(fromRow);
    },

    async listForModeration(limit) {
      const rows = await sql`
        select * from community_categories
         order by (hidden_at is not null) desc,
                  report_count desc,
                  updated_at desc
         limit ${limit}
      `;
      return rows.map(fromRow);
    },

    async listStaleDrafts(before, limit) {
      const rows = await sql`
        select * from community_categories
         where status = 'draft' and updated_at < ${before}
         order by updated_at asc
         limit ${limit}
      `;
      return rows.map(fromRow);
    },

    async allImageKeys() {
      const rows = await sql`
        select jsonb_array_elements(items)->>'imageKey' as key
          from community_categories
      `;
      return new Set(
        rows
          .map((row) => row.key)
          .filter((key): key is string => typeof key === "string" && key !== "")
      );
    },

    async vote(id, voterKey, direction) {
      if (direction === 0) {
        await sql`
          delete from community_votes
           where category_id = ${id} and voter_key = ${voterKey}
        `;
      } else {
        await sql`
          insert into community_votes (category_id, voter_key, direction)
          values (${id}, ${voterKey}, ${direction})
          on conflict (category_id, voter_key)
          do update set direction = excluded.direction
        `;
      }

      // Recompute rather than increment: two people voting at once used to
      // read the same count and write the same number back.
      const rows = await sql`
        update community_categories c
           set upvotes = (select count(*) from community_votes v
                           where v.category_id = c.id and v.direction = 1),
               downvotes = (select count(*) from community_votes v
                             where v.category_id = c.id and v.direction = -1)
         where c.id = ${id}
        returning upvotes, downvotes
      `;

      return rows[0]
        ? { upvotes: Number(rows[0].upvotes), downvotes: Number(rows[0].downvotes) }
        : undefined;
    },

    async getVotes(ids, voterKey) {
      if (ids.length === 0) return {};
      const rows = await sql`
        select category_id, direction from community_votes
         where voter_key = ${voterKey} and category_id = any(${ids})
      `;
      return Object.fromEntries(
        rows.map((row) => [
          String(row.category_id),
          Number(row.direction) as VoteDirection,
        ])
      );
    },

    async report(id, reporterKey, reason) {
      await sql`
        insert into community_reports (category_id, reporter_key, reason)
        values (${id}, ${reporterKey}, ${reason})
        on conflict (category_id, reporter_key) do update set reason = excluded.reason
      `;

      const rows = await sql`
        update community_categories c
           set report_count = (select count(*) from community_reports r
                                where r.category_id = c.id),
               hidden_at = case
                 when (select count(*) from community_reports r
                        where r.category_id = c.id) >= ${LIMITS.reportsBeforeAutoHide}
                 then coalesce(c.hidden_at, now())
                 else c.hidden_at
               end
         where c.id = ${id}
        returning report_count, hidden_at
      `;

      return rows[0]
        ? {
            reportCount: Number(rows[0].report_count),
            hidden: Boolean(rows[0].hidden_at),
          }
        : undefined;
    },

    describe: () => "Postgres",
  };
};

/* -------------------------------------------------------------------------- */
/* On-disk dev fallback                                                        */
/* -------------------------------------------------------------------------- */

type DevFile = {
  categories: StoredCategory[];
  votes: Array<{ categoryId: string; voterKey: string; direction: -1 | 1 }>;
  reports: Array<{ categoryId: string; reporterKey: string; reason: string }>;
};

/**
 * A JSON file, so `npm run dev` works on a fresh clone with no database.
 * Single-process and serialised through one promise chain -- fine for one
 * person poking at the tool, useless for anything else, which is why
 * `repo()` refuses to hand this back in production.
 */
const devRepo = (): Repo => {
  const file = path.join(process.cwd(), ".community-dev", "db.json");
  let queue: Promise<unknown> = Promise.resolve();

  const read = async (): Promise<DevFile> => {
    try {
      return JSON.parse(await readFile(file, "utf8")) as DevFile;
    } catch {
      return { categories: [], votes: [], reports: [] };
    }
  };

  const write = async (data: DevFile) => {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(data, null, 2));
  };

  /** Serialises read-modify-write so two requests can't clobber each other. */
  const mutate = <T>(fn: (data: DevFile) => Promise<T> | T): Promise<T> => {
    const next = queue.then(async () => {
      const data = await read();
      const result = await fn(data);
      await write(data);
      return result;
    });
    queue = next.catch(() => undefined);
    return next;
  };

  const recount = (data: DevFile, id: string) => {
    const category = data.categories.find((c) => c.id === id);
    if (!category) return undefined;
    const votes = data.votes.filter((v) => v.categoryId === id);
    category.upvotes = votes.filter((v) => v.direction === 1).length;
    category.downvotes = votes.filter((v) => v.direction === -1).length;
    return category;
  };

  const published = (data: DevFile) =>
    data.categories.filter((c) => c.status === "published" && !c.hiddenAt);

  return {
    create: ({ name, items, authorKey, language }) =>
      mutate((data) => {
        const draft = blankCategory(name, items, authorKey, language);
        data.categories.push(draft);
        return draft;
      }),

    get: async (id) => (await read()).categories.find((c) => c.id === id),

    saveItems: (id, items) =>
      mutate((data) => {
        const category = data.categories.find((c) => c.id === id);
        if (!category) return undefined;
        category.items = items;
        category.updatedAt = now();
        return category;
      }),

    updateItem: (id, itemId, patch) =>
      // Inside `mutate`, so the read-modify-write is serialised against the
      // other uploads happening at the same time.
      mutate((data) => {
        const category = data.categories.find((c) => c.id === id);
        if (!category) return undefined;

        category.items = category.items.map((item) =>
          item.id === itemId ? { ...item, ...patch } : item
        );
        category.updatedAt = now();
        return category;
      }),

    publish: (id) =>
      mutate((data) => {
        const category = data.categories.find((c) => c.id === id);
        if (!category) return undefined;
        category.status = "published";
        category.publishedAt = category.publishedAt ?? now();
        category.updatedAt = now();
        return category;
      }),

    setHidden: (id, hidden) =>
      mutate((data) => {
        const category = data.categories.find((c) => c.id === id);
        if (!category) return undefined;

        if (hidden) {
          category.hiddenAt = category.hiddenAt ?? now();
        } else {
          data.reports = data.reports.filter((r) => r.categoryId !== id);
          category.hiddenAt = null;
          category.reportCount = 0;
        }
        category.updatedAt = now();
        return category;
      }),

    remove: (id) =>
      mutate((data) => {
        data.categories = data.categories.filter((c) => c.id !== id);
        data.votes = data.votes.filter((v) => v.categoryId !== id);
        data.reports = data.reports.filter((r) => r.categoryId !== id);
      }),

    setLanguage: (id, language) =>
      mutate((data) => {
        const category = data.categories.find((c) => c.id === id);
        if (!category) return undefined;
        category.language = language;
        return category;
      }),

    languageCounts: async () => {
      const counts = new Map<string, number>();
      for (const category of published(await read())) {
        if (!category.language) continue;
        counts.set(category.language, (counts.get(category.language) ?? 0) + 1);
      }
      return [...counts]
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
    },

    listWithoutLanguage: async (limit) =>
      (await read()).categories
        // Files written before tagging have no key at all, not a null.
        .filter((c) => !c.language)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(0, limit),

    list: async ({ sort, limit, offset, query, language }) => {
      const data = await read();
      const needle = (query ?? "").trim().toLowerCase();
      const matching = published(data).filter(
        (c) =>
          c.name.toLowerCase().includes(needle) &&
          (!language || c.language === language)
      );
      const sorted = matching.sort((a, b) =>
        sort === "new"
          ? (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
          : b.upvotes - b.downvotes - (a.upvotes - a.downvotes) ||
            (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
      );
      return sorted.slice(offset, offset + limit);
    },

    listByAuthor: async (authorKey) =>
      (await read()).categories
        .filter((c) => c.authorKey === authorKey)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 50),

    listForModeration: async (limit) =>
      (await read()).categories
        .sort(
          (a, b) =>
            Number(Boolean(b.hiddenAt)) - Number(Boolean(a.hiddenAt)) ||
            b.reportCount - a.reportCount ||
            b.updatedAt.localeCompare(a.updatedAt)
        )
        .slice(0, limit),

    listStaleDrafts: async (before, limit) =>
      (await read()).categories
        .filter((c) => c.status === "draft" && c.updatedAt < before)
        .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
        .slice(0, limit),

    allImageKeys: async () =>
      new Set(
        (await read()).categories
          .flatMap((c) => c.items.map((item) => item.imageKey))
          .filter((key): key is string => Boolean(key))
      ),

    vote: (id, voterKey, direction) =>
      mutate((data) => {
        data.votes = data.votes.filter(
          (v) => !(v.categoryId === id && v.voterKey === voterKey)
        );
        if (direction !== 0) {
          data.votes.push({ categoryId: id, voterKey, direction });
        }
        const category = recount(data, id);
        return category
          ? { upvotes: category.upvotes, downvotes: category.downvotes }
          : undefined;
      }),

    getVotes: async (ids, voterKey) => {
      const data = await read();
      return Object.fromEntries(
        data.votes
          .filter((v) => v.voterKey === voterKey && ids.includes(v.categoryId))
          .map((v) => [v.categoryId, v.direction as VoteDirection])
      );
    },

    report: (id, reporterKey, reason) =>
      mutate((data) => {
        const category = data.categories.find((c) => c.id === id);
        if (!category) return undefined;

        if (!data.reports.some((r) => r.categoryId === id && r.reporterKey === reporterKey)) {
          data.reports.push({ categoryId: id, reporterKey, reason });
        }

        category.reportCount = data.reports.filter((r) => r.categoryId === id).length;
        if (category.reportCount >= LIMITS.reportsBeforeAutoHide) {
          category.hiddenAt = category.hiddenAt ?? now();
        }

        return {
          reportCount: category.reportCount,
          hidden: Boolean(category.hiddenAt),
        };
      }),

    describe: () => "local JSON file (.community-dev/db.json)",
  };
};

let cached: Repo | undefined;

export const repo = (): Repo => {
  if (cached) return cached;

  const url = databaseUrl();
  if (url) {
    cached = postgresRepo(url);
    return cached;
  }

  if (isProduction()) {
    throw new NotConfigured(
      "Community categories aren't set up on this deployment yet. " +
        "It needs DATABASE_URL, with lib/community/schema.sql applied."
    );
  }

  cached = devRepo();
  return cached;
};
