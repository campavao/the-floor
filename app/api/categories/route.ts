import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// GET - Fetch all community categories
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured",
      categories: [] 
    }, { status: 503 });
  }

  const searchParams = request.nextUrl.searchParams;
  const published = searchParams.get("published") !== "false";
  const sortBy = searchParams.get("sort") || "votes"; // votes, newest, name

  try {
    let query = supabase
      .from("community_categories")
      .select(`
        *,
        examples:category_examples(*)
      `);

    if (published) {
      query = query.eq("is_published", true);
    }

    // Sort based on parameter
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "name":
        query = query.order("name", { ascending: true });
        break;
      case "votes":
      default:
        query = query.order("upvotes", { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: data || [] });
  } catch (error) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new community category
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured. Please set up Supabase to create categories."
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, description, searchQueryTemplate, examples, authorId } = body;

    if (!name || !examples || examples.length === 0) {
      return NextResponse.json({ 
        error: "Category name and at least one example are required" 
      }, { status: 400 });
    }

    // Create the category
    const { data: category, error: categoryError } = await supabase
      .from("community_categories")
      .insert({
        name,
        description: description || "",
        search_query_template: searchQueryTemplate || "{name} high resolution photo",
        author_id: authorId || null,
        is_published: false, // Start unpublished until images are added
        upvotes: 0,
        downvotes: 0,
      })
      .select()
      .single();

    if (categoryError) {
      console.error("Error creating category:", categoryError);
      return NextResponse.json({ error: categoryError.message }, { status: 500 });
    }

    // Create the examples
    const exampleInserts = examples.map((example: { name: string; alternatives?: string[] }, index: number) => ({
      category_id: category.id,
      name: example.name,
      alternatives: example.alternatives || [],
      image_url: null,
      image_status: "pending",
      order_index: index,
    }));

    const { error: examplesError } = await supabase
      .from("category_examples")
      .insert(exampleInserts);

    if (examplesError) {
      console.error("Error creating examples:", examplesError);
      // Rollback category creation
      await supabase.from("community_categories").delete().eq("id", category.id);
      return NextResponse.json({ error: examplesError.message }, { status: 500 });
    }

    // Fetch the complete category with examples
    const { data: completeCategory } = await supabase
      .from("community_categories")
      .select(`
        *,
        examples:category_examples(*)
      `)
      .eq("id", category.id)
      .single();

    return NextResponse.json({ category: completeCategory }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
