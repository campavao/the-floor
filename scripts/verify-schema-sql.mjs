/**
 * Runs the SQL from lib/community/db.ts against a real Postgres.
 *
 * The app talks to Neon over its HTTP driver, which only speaks to Neon -- so
 * the statements themselves are otherwise only exercised in production. The
 * risky one is the atomic per-item update: it has to merge into a single
 * element of a jsonb array, keep the order, and survive concurrent writers.
 *
 * Usage: node scripts/verify-schema-sql.mjs "postgres://..."
 */
import { readFileSync } from "node:fs";
import pg from "pg";

const connectionString = process.argv[2] ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Pass a connection string or set DATABASE_URL");
  process.exit(1);
}

const results = [];
const check = (name, passed, detail = "") => {
  results.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? `  -- ${detail}` : ""}`);
};

const pool = new pg.Pool({ connectionString, max: 8 });

const items = Array.from({ length: 6 }, (_, i) => ({
  id: `item-${i}`,
  name: `Item ${i}`,
  alternatives: [],
  imageKey: null,
  imageUrl: null,
  width: null,
  height: null,
  credit: null,
}));

/** The updateItem statement, verbatim in shape from lib/community/db.ts. */
const UPDATE_ITEM = `
  update community_categories
     set items = coalesce((
           select jsonb_agg(
                    case when element->>'id' = $2
                         then element || $3::jsonb
                         else element
                    end
                    order by ordinality
                  )
             from jsonb_array_elements(items)
                  with ordinality as entries(element, ordinality)
         ), '[]'::jsonb),
         updated_at = now()
   where id = $1
  returning items`;

const RECOUNT_VOTES = `
  update community_categories c
     set upvotes = (select count(*) from community_votes v
                     where v.category_id = c.id and v.direction = 1),
         downvotes = (select count(*) from community_votes v
                       where v.category_id = c.id and v.direction = -1)
   where c.id = $1
  returning upvotes, downvotes`;

try {
  await pool.query(readFileSync("lib/community/schema.sql", "utf8"));
  check("schema.sql applies cleanly", true);

  await pool.query(`delete from community_categories where id like 'test-%'`);
  await pool.query(
    `insert into community_categories (id, name, slug, author_key, items)
     values ('test-1', 'Test', 'test', 'author-key', $1::jsonb)`,
    [JSON.stringify(items)]
  );

  // ------------------------------------------------ single item patch
  const patched = await pool.query(UPDATE_ITEM, [
    "test-1",
    "item-2",
    JSON.stringify({ imageUrl: "https://example.com/a.webp", width: 1600 }),
  ]);
  const after = patched.rows[0].items;

  check("patches only the targeted item", after[2].imageUrl === "https://example.com/a.webp");
  check("leaves the other items alone", after.every((item, i) => i === 2 || item.imageUrl === null));
  check("preserves array order", after.map((item) => item.id).join(",") === items.map((i) => i.id).join(","));
  check("merges rather than replaces the element", after[2].name === "Item 2");
  check("keeps the item count", after.length === items.length);

  // ------------------------------------------------ concurrent patches
  await pool.query(`update community_categories set items = $1::jsonb where id = 'test-1'`, [
    JSON.stringify(items),
  ]);

  await Promise.all(
    items.map((item, i) =>
      pool.query(UPDATE_ITEM, [
        "test-1",
        item.id,
        JSON.stringify({ imageUrl: `https://example.com/${i}.webp` }),
      ])
    )
  );

  const concurrent = (
    await pool.query(`select items from community_categories where id = 'test-1'`)
  ).rows[0].items;
  const withUrls = concurrent.filter((item) => item.imageUrl).length;
  check(
    "concurrent patches all survive",
    withUrls === items.length,
    `${withUrls}/${items.length} kept an image`
  );

  // ---------------------------------------------------- null clearing
  await pool.query(UPDATE_ITEM, [
    "test-1",
    "item-0",
    JSON.stringify({ imageUrl: null, imageKey: null, credit: null }),
  ]);
  const cleared = (
    await pool.query(`select items from community_categories where id = 'test-1'`)
  ).rows[0].items;
  check("detaching an image writes json null", cleared[0].imageUrl === null);

  // ------------------------------------------------------- empty array
  await pool.query(`update community_categories set items = '[]'::jsonb where id = 'test-1'`);
  const empty = await pool.query(UPDATE_ITEM, ["test-1", "item-0", JSON.stringify({ a: 1 })]);
  check("an empty item list stays an empty array, not null", Array.isArray(empty.rows[0].items));

  // ------------------------------------------------------------ voting
  await pool.query(`update community_categories set items = $1::jsonb where id = 'test-1'`, [
    JSON.stringify(items),
  ]);

  await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      pool
        .query(
          `insert into community_votes (category_id, voter_key, direction)
           values ('test-1', $1, $2)
           on conflict (category_id, voter_key) do update set direction = excluded.direction`,
          [`voter-${i}`, i % 4 === 0 ? -1 : 1]
        )
        .then(() => pool.query(RECOUNT_VOTES, ["test-1"]))
    )
  );

  const tally = (
    await pool.query(`select upvotes, downvotes from community_categories where id = 'test-1'`)
  ).rows[0];
  check(
    "20 concurrent votes tally exactly",
    Number(tally.upvotes) === 15 && Number(tally.downvotes) === 5,
    `${tally.upvotes} up / ${tally.downvotes} down`
  );

  await pool.query(
    `insert into community_votes (category_id, voter_key, direction) values ('test-1', 'voter-0', 1)
     on conflict (category_id, voter_key) do update set direction = excluded.direction`
  );
  await pool.query(RECOUNT_VOTES, ["test-1"]);
  const flipped = (
    await pool.query(`select upvotes, downvotes from community_categories where id = 'test-1'`)
  ).rows[0];
  check(
    "flipping a vote moves it rather than adding one",
    Number(flipped.upvotes) === 16 && Number(flipped.downvotes) === 4,
    `${flipped.upvotes} up / ${flipped.downvotes} down`
  );

  // ----------------------------------------------------------- reports
  for (let i = 0; i < 3; i += 1) {
    await pool.query(
      `insert into community_reports (category_id, reporter_key, reason)
       values ('test-1', $1, 'nope')
       on conflict (category_id, reporter_key) do update set reason = excluded.reason`,
      [`reporter-${i}`]
    );
  }
  const hidden = await pool.query(
    `update community_categories c
        set report_count = (select count(*) from community_reports r where r.category_id = c.id),
            hidden_at = case
              when (select count(*) from community_reports r where r.category_id = c.id) >= $2
              then coalesce(c.hidden_at, now())
              else c.hidden_at
            end
      where c.id = $1
     returning report_count, hidden_at`,
    ["test-1", 3]
  );
  check(
    "three reports set hidden_at",
    Number(hidden.rows[0].report_count) === 3 && hidden.rows[0].hidden_at !== null
  );

  // ------------------------------------------------------- cascade + list
  const listed = await pool.query(
    `select id from community_categories
      where status = 'published' and hidden_at is null
      order by (upvotes - downvotes) desc, published_at desc nulls last
      limit 10`
  );
  check("hidden categories drop out of the browse query", listed.rowCount === 0);

  await pool.query(`delete from community_categories where id = 'test-1'`);
  const orphans = await pool.query(
    `select count(*)::int as n from community_votes where category_id = 'test-1'`
  );
  check("deleting a category cascades to its votes", orphans.rows[0].n === 0);
} catch (error) {
  check(`threw: ${error.message}`, false);
} finally {
  await pool.end();
}

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length === 0 ? 0 : 1);
