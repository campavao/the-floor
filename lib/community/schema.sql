-- Schema for the community category pool.
-- Run once against your Postgres (Neon on the Vercel Marketplace has a free
-- tier that scales to zero): psql "$DATABASE_URL" -f lib/community/schema.sql

create table if not exists community_categories (
  id            text primary key,
  name          text        not null,
  slug          text        not null,
  status        text        not null default 'draft'
                  check (status in ('draft', 'published')),
  -- The whole example list. It's ~50 small objects that are always read and
  -- written together, so a side table would only buy joins.
  items         jsonb       not null default '[]'::jsonb,
  -- Anonymous owner token from an httpOnly cookie. Grants edit rights on the
  -- draft; never sent to the client.
  author_key    text        not null,
  upvotes       integer     not null default 0,
  downvotes     integer     not null default 0,
  report_count  integer     not null default 0,
  hidden_at     timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz
);

-- Listings read published, unhidden categories ordered by score or recency.
create index if not exists community_categories_browse
  on community_categories (status, hidden_at, published_at desc);
create index if not exists community_categories_score
  on community_categories (status, hidden_at, (upvotes - downvotes) desc);
create index if not exists community_categories_author
  on community_categories (author_key);

create table if not exists community_votes (
  category_id text        not null
                references community_categories(id) on delete cascade,
  voter_key   text        not null,
  -- 1 or -1. Counts on the category row are recomputed from this table rather
  -- than incremented, so concurrent votes can't lose each other.
  direction   smallint    not null check (direction in (-1, 1)),
  created_at  timestamptz not null default now(),
  primary key (category_id, voter_key)
);

create table if not exists community_reports (
  category_id text        not null
                references community_categories(id) on delete cascade,
  reporter_key text       not null,
  reason      text        not null default '',
  created_at  timestamptz not null default now(),
  primary key (category_id, reporter_key)
);
