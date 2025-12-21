import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// GET - Fetch a single category with its examples
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  try {
    const { data: category, error } = await supabase
      .from("community_categories")
      .select(`
        *,
        examples:category_examples(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error in GET /api/categories/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update a category (publish, update details, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, any> = {};

    // Only allow certain fields to be updated
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.searchQueryTemplate !== undefined) updates.search_query_template = body.searchQueryTemplate;
    if (body.isPublished !== undefined) updates.is_published = body.isPublished;

    updates.updated_at = new Date().toISOString();

    const { data: category, error } = await supabase
      .from("community_categories")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        examples:category_examples(*)
      `)
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error in PATCH /api/categories/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  try {
    // Examples will be deleted via CASCADE
    const { error } = await supabase
      .from("community_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/categories/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
