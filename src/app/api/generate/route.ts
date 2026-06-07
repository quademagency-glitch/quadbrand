import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/firebase/auth";
import { query } from "@/lib/db/client";
import { generateImageWithFlux } from "@/lib/replicate";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { prompt, aspectRatio, modelId, brandId, workspaceId } = await request.json();

    if (!prompt || !aspectRatio) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!workspaceId) {
      // Find the first workspace owned by the user
      const { rows: defaultWorkspaces } = await query(
        "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
        [session.uid]
      );
      if (defaultWorkspaces.length === 0) {
        return NextResponse.json({ error: "No workspace found for user" }, { status: 400 });
      }
      workspaceId = defaultWorkspaces[0].id;
    }

    // Cost logic (Fast=1, Standard=2, Pro=5)
    let cost = 2;
    if (modelId === "fast") cost = 1;
    if (modelId === "pro") cost = 5;

    // Verify credits and workspace
    const { rows: workspaces } = await query(
      "SELECT id, credits_pool FROM workspaces WHERE id = $1 AND owner_id = $2",
      [workspaceId, session.uid]
    );

    if (workspaces.length === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 403 });
    }

    const workspace = workspaces[0];
    if (workspace.credits_pool < cost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Deduct credits immediately
    await query(
      "UPDATE workspaces SET credits_pool = credits_pool - $1 WHERE id = $2",
      [cost, workspaceId]
    );

    // Create a pending generation record
    const { rows: generationRows } = await query(
      `INSERT INTO generations 
        (workspace_id, brand_id, user_id, prompt, model, aspect_ratio, status, credits_cost) 
       VALUES ($1, $2, $3, $4, $5, $6, 'generating', $7) RETURNING id`,
      [workspaceId, brandId || null, session.uid, prompt, modelId || "standard", aspectRatio, cost]
    );
    const generationId = generationRows[0].id;

    try {
      // Call Replicate
      const imageUrl = await generateImageWithFlux({
        prompt,
        aspect_ratio: aspectRatio,
      });

      // Update generation with result
      await query(
        "UPDATE generations SET image_url = $1, status = 'completed' WHERE id = $2",
        [imageUrl, generationId]
      );

      // Log transaction
      await query(
        `INSERT INTO credit_transactions (workspace_id, user_id, amount, reason, generation_id)
         VALUES ($1, $2, $3, 'generation', $4)`,
        [workspaceId, session.uid, -cost, generationId]
      );

      return NextResponse.json({ status: "success", imageUrl, generationId });
    } catch (genError: any) {
      // Refund credits
      await query(
        "UPDATE workspaces SET credits_pool = credits_pool + $1 WHERE id = $2",
        [cost, workspaceId]
      );
      
      // Update generation status
      await query(
        "UPDATE generations SET status = 'failed' WHERE id = $1",
        [generationId]
      );

      throw genError;
    }
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
