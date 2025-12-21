# Community Category Creation Tool Setup

This document explains how to set up the community category creation feature for The Floor game.

## Overview

The community feature allows users to:
- Create their own categories with custom examples
- Search for and select images for each example
- Edit images to remove text/watermarks using a canvas-based editor
- Vote on community-created categories
- Browse and use community categories in the game

## Requirements

1. **Supabase Account** (free tier available)
   - Database for storing categories, examples, and votes
   - Storage for image uploads

2. **Optional: Google Custom Search API** (for better image search)
   - Falls back to web scraping if not configured

## Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be provisioned

### Step 2: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL to create the tables

### Step 3: Set Up Storage

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it `category-images`
4. Check **Public bucket** to allow public access
5. Click **Create bucket**

### Step 4: Configure Environment Variables

1. In Supabase dashboard, go to **Settings > API**
2. Copy the **Project URL** and **anon public** key
3. Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Deploy to Vercel

1. Add the environment variables in your Vercel project settings
2. Redeploy the application

## Optional: Better Image Search

For better image search results, you can configure Google Custom Search API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the **Custom Search API**
4. Create API credentials (API key)
5. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
6. Create a new search engine
7. Enable "Search the entire web" and "Image search"
8. Copy the Search Engine ID

Add to your `.env.local`:

```bash
GOOGLE_SEARCH_API_KEY=your-google-api-key
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id
```

## Usage

### Creating a Category

1. Go to `/community` on your deployed site
2. Click **Create Category**
3. Enter category name and description
4. Add examples (items that belong in the category)
5. Click **Continue to Images**
6. For each example:
   - Click **Fetch** to search for images
   - Select an image from results or paste a custom URL
   - Click **Edit** to remove any text/watermarks
7. The category auto-publishes when all images are ready

### Image Editor

The image editor allows you to:
- Paint over text or unwanted areas
- Apply inpainting to fill in painted areas
- Reset to original image
- Adjust brush size

### Voting

- Upvote categories you like
- Downvote categories that need improvement
- Votes are stored locally and tied to browser

## Mobile Support

The community feature is fully responsive and works on mobile devices:
- Touch support for image editing
- Responsive grid layouts
- Mobile-friendly forms and buttons

## API Endpoints

- `GET /api/categories` - List community categories
- `POST /api/categories` - Create new category
- `GET /api/categories/[id]` - Get category details
- `PATCH /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category
- `GET /api/search-images?q=query` - Search for images
- `POST /api/upload-image` - Upload image file
- `PUT /api/upload-image` - Upload image from URL
- `POST /api/vote` - Vote on category
- `GET /api/vote` - Get user's vote

## Troubleshooting

### "Supabase is not configured" error
- Ensure environment variables are set correctly
- Check that both URL and anon key are present
- Verify the Supabase project is active

### Images not uploading
- Check that the storage bucket exists and is public
- Verify storage policies are configured correctly
- Check browser console for specific errors

### Image search not working
- The fallback scraping method may be rate-limited
- Consider setting up Google Custom Search API
- Check network tab for specific errors

## Security Notes

- The anon key is safe to expose publicly (RLS policies protect data)
- All image uploads go through your API routes
- Votes are anonymous but tied to browser localStorage
