import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface CategoryVotes {
  upvotes: number;
  downvotes: number;
}

// POST - Vote on a category
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { categoryId, voterId, voteType } = body;

    if (!categoryId || !voterId || !voteType) {
      return NextResponse.json({ 
        error: "categoryId, voterId, and voteType are required" 
      }, { status: 400 });
    }

    if (voteType !== "up" && voteType !== "down") {
      return NextResponse.json({ 
        error: "voteType must be 'up' or 'down'" 
      }, { status: 400 });
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("category_votes")
      .select("*")
      .eq("category_id", categoryId)
      .eq("voter_id", voterId)
      .single();

    if (existingVote) {
      // If same vote type, remove the vote (toggle)
      if (existingVote.vote_type === voteType) {
        await supabase
          .from("category_votes")
          .delete()
          .eq("id", existingVote.id);

        // Update category vote count
        const { data: category } = await supabase
          .from("community_categories")
          .select("upvotes, downvotes")
          .eq("id", categoryId)
          .single();

        if (category) {
          const catData = category as CategoryVotes;
          const currentValue = voteType === "up" ? catData.upvotes : catData.downvotes;
          const newValue = Math.max(0, (currentValue || 0) - 1);
          
          await supabase
            .from("community_categories")
            .update(voteType === "up" ? { upvotes: newValue } : { downvotes: newValue })
            .eq("id", categoryId);
        }

        return NextResponse.json({ action: "removed", voteType: null });
      } else {
        // Change vote type
        await supabase
          .from("category_votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id);

        // Update category vote counts
        const { data: category } = await supabase
          .from("community_categories")
          .select("upvotes, downvotes")
          .eq("id", categoryId)
          .single();

        if (category) {
          const catData = category as CategoryVotes;
          const newUpvotes = voteType === "up" 
            ? (catData.upvotes || 0) + 1 
            : Math.max(0, (catData.upvotes || 0) - 1);
          const newDownvotes = voteType === "down" 
            ? (catData.downvotes || 0) + 1 
            : Math.max(0, (catData.downvotes || 0) - 1);

          await supabase
            .from("community_categories")
            .update({ downvotes: newDownvotes, upvotes: newUpvotes })
            .eq("id", categoryId);
        }

        return NextResponse.json({ action: "changed", voteType });
      }
    } else {
      // Create new vote
      await supabase
        .from("category_votes")
        .insert({
          category_id: categoryId,
          vote_type: voteType,
          voter_id: voterId,
        });

      // Update category vote count
      const { data: category } = await supabase
        .from("community_categories")
        .select("upvotes, downvotes")
        .eq("id", categoryId)
        .single();

      if (category) {
        const catData = category as CategoryVotes;
        const currentValue = voteType === "up" ? catData.upvotes : catData.downvotes;
        const newValue = (currentValue || 0) + 1;
        
        await supabase
          .from("community_categories")
          .update(voteType === "up" ? { upvotes: newValue } : { downvotes: newValue })
          .eq("id", categoryId);
      }

      return NextResponse.json({ action: "created", voteType });
    }
  } catch (error) {
    console.error("Error in POST /api/vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Get user's vote for a category
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: "Supabase is not configured" 
    }, { status: 503 });
  }

  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get("categoryId");
  const voterId = searchParams.get("voterId");

  if (!categoryId || !voterId) {
    return NextResponse.json({ 
      error: "categoryId and voterId are required" 
    }, { status: 400 });
  }

  try {
    const { data: vote } = await supabase
      .from("category_votes")
      .select("vote_type")
      .eq("category_id", categoryId)
      .eq("voter_id", voterId)
      .single();

    return NextResponse.json({ voteType: vote?.vote_type || null });
  } catch (error) {
    console.error("Error in GET /api/vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
