import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Lazy-initialized Supabase client
let _supabase: SupabaseClient | null = null;

// Get Supabase client (lazy initialization)
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return _supabase;
}

// For backward compatibility, export supabase but it may be null
// Use getSupabase() for safe access
export const supabase = {
  from: (table: string) => {
    const client = getSupabase();
    if (!client) {
      throw new Error("Supabase is not configured");
    }
    return client.from(table);
  },
  storage: {
    from: (bucket: string) => {
      const client = getSupabase();
      if (!client) {
        throw new Error("Supabase is not configured");
      }
      return client.storage.from(bucket);
    },
  },
};

// Types for our database schema
export interface CommunityCategory {
  id: string;
  name: string;
  description: string;
  search_query_template: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  is_published: boolean;
  author_id: string | null;
}

export interface CategoryExample {
  id: string;
  category_id: string;
  name: string;
  alternatives: string[];
  image_url: string | null;
  image_status: "pending" | "uploaded" | "failed";
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryVote {
  id: string;
  category_id: string;
  voter_id: string;
  vote_type: "up" | "down";
  created_at: string;
}

// Helper function to get public URL for stored images
export function getImagePublicUrl(path: string): string {
  if (!supabaseUrl) return "";
  return `${supabaseUrl}/storage/v1/object/public/category-images/${path}`;
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}
