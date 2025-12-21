-- Supabase Schema for The Floor Community Categories
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Community Categories Table
CREATE TABLE IF NOT EXISTS community_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  search_query_template VARCHAR(500) DEFAULT '{name} high resolution photo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  author_id VARCHAR(255) DEFAULT NULL
);

-- Category Examples Table
CREATE TABLE IF NOT EXISTS category_examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES community_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  alternatives TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT NULL,
  image_status VARCHAR(50) DEFAULT 'pending' CHECK (image_status IN ('pending', 'uploaded', 'failed')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category Votes Table
CREATE TABLE IF NOT EXISTS category_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES community_categories(id) ON DELETE CASCADE,
  voter_id VARCHAR(255) NOT NULL,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, voter_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_examples_category_id ON category_examples(category_id);
CREATE INDEX IF NOT EXISTS idx_category_examples_order ON category_examples(category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_category_votes_category_id ON category_votes(category_id);
CREATE INDEX IF NOT EXISTS idx_category_votes_voter ON category_votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_community_categories_published ON community_categories(is_published);
CREATE INDEX IF NOT EXISTS idx_community_categories_upvotes ON community_categories(upvotes DESC);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE community_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_votes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published categories
CREATE POLICY "Public can view published categories" ON community_categories
  FOR SELECT USING (is_published = TRUE);

-- Allow public to create categories
CREATE POLICY "Anyone can create categories" ON community_categories
  FOR INSERT WITH CHECK (TRUE);

-- Allow public to update their own categories (by author_id)
CREATE POLICY "Authors can update their categories" ON community_categories
  FOR UPDATE USING (TRUE);

-- Allow public to view all examples
CREATE POLICY "Public can view examples" ON category_examples
  FOR SELECT USING (TRUE);

-- Allow public to insert examples
CREATE POLICY "Anyone can create examples" ON category_examples
  FOR INSERT WITH CHECK (TRUE);

-- Allow public to update examples
CREATE POLICY "Anyone can update examples" ON category_examples
  FOR UPDATE USING (TRUE);

-- Allow public to view votes
CREATE POLICY "Public can view votes" ON category_votes
  FOR SELECT USING (TRUE);

-- Allow public to vote
CREATE POLICY "Anyone can vote" ON category_votes
  FOR INSERT WITH CHECK (TRUE);

-- Allow voters to update their votes
CREATE POLICY "Voters can update their votes" ON category_votes
  FOR UPDATE USING (TRUE);

-- Allow voters to delete their votes
CREATE POLICY "Voters can delete their votes" ON category_votes
  FOR DELETE USING (TRUE);

-- Storage Bucket for Category Images
-- Note: Run this in Supabase Storage settings or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', TRUE);

-- Storage Policy for public access
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
-- CREATE POLICY "Anyone can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-images');
-- CREATE POLICY "Anyone can update" ON storage.objects FOR UPDATE USING (bucket_id = 'category-images');
