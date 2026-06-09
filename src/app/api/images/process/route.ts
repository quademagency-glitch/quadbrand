import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import { removeBackground, vectorizeImage, editImage } from "@/lib/replicate";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageId, action, prompt } = await request.json();

    if (!imageId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the parent image to duplicate metadata
    const { rows: parentRows } = await query(
      "SELECT * FROM generations WHERE id = $1 AND user_id = $2",
      [imageId, session.uid]
    );

    if (parentRows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const parent = parentRows[0];
    const workspaceId = parent.workspace_id;
    
    // Determine cost
    let cost = 1; // Default 1 credit for bg removal and vectorize
    if (action === "edit") cost = 2; // SDXL img2img

    // Verify credits
    const { rows: workspaces } = await query(
      "SELECT id, credits_pool FROM workspaces WHERE id = $1 AND owner_id = $2",
      [workspaceId, session.uid]
    );

    if (workspaces.length === 0 || workspaces[0].credits_pool < cost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Deduct credits immediately
    await query(
      "UPDATE workspaces SET credits_pool = credits_pool - $1 WHERE id = $2",
      [cost, workspaceId]
    );

    // Create a pending generation record for this action
    const { rows: generationRows } = await query(
      `INSERT INTO generations 
        (workspace_id, brand_id, user_id, prompt, aspect_ratio, status, credits_cost, action_type, parent_image_id) 
       VALUES ($1, $2, $3, $4, $5, 'generating', $6, $7, $8) RETURNING id`,
      [workspaceId, parent.brand_id, session.uid, prompt || parent.prompt, parent.aspect_ratio, cost, action, imageId]
    );
    const newGenerationId = generationRows[0].id;

    try {
      let resultUrl = "";

      if (action === "remove_bg") {
        resultUrl = await removeBackground(parent.image_url);
      } else if (action === "vectorize") {
        resultUrl = await vectorizeImage(parent.image_url);
      } else if (action === "edit") {
        if (!prompt) throw new Error("Prompt is required for editing");
        resultUrl = await editImage(parent.image_url, prompt);
      } else {
        throw new Error("Invalid action");
      }

      // Update generation with result
      await query(
        "UPDATE generations SET image_url = $1, status = 'completed' WHERE id = $2",
        [resultUrl, newGenerationId]
      );

      // Log transaction
      await query(
        `INSERT INTO credit_transactions (workspace_id, user_id, amount, reason, generation_id)
         VALUES ($1, $2, $3, 'generation', $4)`,
        [workspaceId, session.uid, -cost, newGenerationId]
      );

      return NextResponse.json({ status: "success", imageUrl: resultUrl, generationId: newGenerationId });
    } catch (genError: any) {
      // Refund credits
      await query(
        "UPDATE workspaces SET credits_pool = credits_pool + $1 WHERE id = $2",
        [cost, workspaceId]
      );
      
      // Update generation status
      await query(
        "UPDATE generations SET status = 'failed' WHERE id = $1",
        [newGenerationId]
      );

      throw genError;
    }
  } catch (error) {
    console.error("Process API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
