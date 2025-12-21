import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured, getImagePublicUrl } from "@/lib/supabase";

// POST - Upload an image to Supabase storage
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const categoryId = formData.get("categoryId") as string;
    const exampleId = formData.get("exampleId") as string;
    const fileName = formData.get("fileName") as string;

    if (!file || !categoryId || !exampleId) {
      return NextResponse.json({ 
        error: "File, categoryId, and exampleId are required" 
      }, { status: 400 });
    }

    // Generate unique file path
    const extension = file.type.split("/")[1] || "jpg";
    const sanitizedFileName = (fileName || "image")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    const filePath = `${categoryId}/${exampleId}-${sanitizedFileName}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get the public URL
    const publicUrl = getImagePublicUrl(filePath);

    // Update the example with the image URL
    const { error: updateError } = await supabase
      .from("category_examples")
      .update({
        image_url: publicUrl,
        image_status: "uploaded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", exampleId);

    if (updateError) {
      console.error("Error updating example:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Check if all examples now have images
    const { data: allExamples } = await supabase
      .from("category_examples")
      .select("image_status")
      .eq("category_id", categoryId);

    const allUploaded = allExamples?.every((e) => e.image_status === "uploaded");
    
    if (allUploaded) {
      await supabase
        .from("community_categories")
        .update({ is_published: true, updated_at: new Date().toISOString() })
        .eq("id", categoryId);
    }

    return NextResponse.json({ 
      url: publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error("Error in POST /api/upload-image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Upload from URL (fetch and re-upload)
export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { imageUrl, categoryId, exampleId, fileName } = body;

    if (!imageUrl || !categoryId || !exampleId) {
      return NextResponse.json({ 
        error: "imageUrl, categoryId, and exampleId are required" 
      }, { status: 400 });
    }

    // Fetch the image from the URL
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: "Failed to fetch image from URL" 
      }, { status: 400 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.split("/")[1]?.split(";")[0] || "jpg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Generate unique file path
    const sanitizedFileName = (fileName || "image")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    const filePath = `${categoryId}/${exampleId}-${sanitizedFileName}.${extension}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get the public URL
    const publicUrl = getImagePublicUrl(filePath);

    // Update the example with the image URL
    const { error: updateError } = await supabase
      .from("category_examples")
      .update({
        image_url: publicUrl,
        image_status: "uploaded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", exampleId);

    if (updateError) {
      console.error("Error updating example:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Check if all examples now have images
    const { data: allExamples } = await supabase
      .from("category_examples")
      .select("image_status")
      .eq("category_id", categoryId);

    const allUploaded = allExamples?.every((e) => e.image_status === "uploaded");
    
    if (allUploaded) {
      await supabase
        .from("community_categories")
        .update({ is_published: true, updated_at: new Date().toISOString() })
        .eq("id", categoryId);
    }

    return NextResponse.json({ 
      url: publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error("Error in PUT /api/upload-image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
