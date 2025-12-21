import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// PATCH - Update an example (e.g., set image URL)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; exampleId: string }> }
) {
  const { id, exampleId } = await params;
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.alternatives !== undefined) updates.alternatives = body.alternatives;
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl;
    if (body.imageStatus !== undefined) updates.image_status = body.imageStatus;

    updates.updated_at = new Date().toISOString();

    const { data: example, error } = await supabase
      .from("category_examples")
      .update(updates)
      .eq("id", exampleId)
      .eq("category_id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating example:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if all examples now have images, if so we can auto-publish
    const { data: allExamples } = await supabase
      .from("category_examples")
      .select("image_status")
      .eq("category_id", id);

    const allUploaded = allExamples?.every((e) => e.image_status === "uploaded");
    
    if (allUploaded) {
      await supabase
        .from("community_categories")
        .update({ is_published: true, updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    return NextResponse.json({ example });
  } catch (error) {
    console.error("Error in PATCH /api/categories/[id]/examples/[exampleId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
