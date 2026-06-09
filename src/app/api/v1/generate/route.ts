import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth-api";
import { query } from "@/lib/db/client";
import { generateImageWithFlux } from "@/lib/replicate";
import { dispatchWebhook } from "@/lib/webhooks";

export async function POST(request: Request) {
  const { user, error } = await authenticateApiKey(request);
  if (error) return error;

  try {
    let { prompt, aspectRatio, modelId, brandId, workspaceId, numOutputs = 1 } = await request.json();

    if (!prompt || !aspectRatio) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!workspaceId) {
      // Find the first workspace owned by the user
      const { rows: defaultWorkspaces } = await query(
        "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
        [user?.id]
      );
      if (defaultWorkspaces.length === 0) {
        return NextResponse.json({ error: "No workspace found for API key" }, { status: 400 });
      }
      workspaceId = defaultWorkspaces[0].id;
    }

    // Cost logic (Fast=1, Standard=2, Pro=5) per output
    let baseCost = 2;
    if (modelId === "fast") baseCost = 1;
    if (modelId === "pro") baseCost = 5;
    
    const cost = baseCost * numOutputs;

    // Verify credits and workspace
    const { rows: workspaces } = await query(
      "SELECT id, credits_pool FROM workspaces WHERE id = $1 AND owner_id = $2",
      [workspaceId, user?.id]
    );

    if (workspaces.length === 0) {
      return NextResponse.json({ error: "Workspace not found or access denied" }, { status: 403 });
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

    const variantGroupId = numOutputs > 1 ? crypto.randomUUID() : null;
    const pendingGenerations = [];
    
    for (let i = 0; i < numOutputs; i++) {
      const { rows: generationRows } = await query(
        `INSERT INTO generations 
          (workspace_id, brand_id, user_id, prompt, model, aspect_ratio, status, credits_cost, variant_group_id) 
         VALUES ($1, $2, $3, $4, $5, $6, 'generating', $7, $8) RETURNING id`,
        [workspaceId, brandId || null, user?.id, prompt, modelId || "standard", aspectRatio, baseCost, variantGroupId]
      );
      pendingGenerations.push(generationRows[0].id);
    }

    try {
      // Call Replicate for each output
      const generationPromises = pendingGenerations.map(async (genId) => {
        const imageUrl = await generateImageWithFlux({
          prompt,
          aspect_ratio: aspectRatio,
        });
        
        await query(
          "UPDATE generations SET image_url = $1, status = 'completed' WHERE id = $2",
          [imageUrl, genId]
        );
        
        return { id: genId, imageUrl, status: "completed" };
      });

      const results = await Promise.all(generationPromises);

      // Log transaction
      await query(
        `INSERT INTO credit_transactions (workspace_id, user_id, amount, reason, generation_id)
         VALUES ($1, $2, $3, 'generation', $4)`,
        [workspaceId, user?.id, -cost, pendingGenerations[0]]
      );

      // Fire webhooks asynchronously
      results.forEach(res => {
        dispatchWebhook(workspaceId, "generation.completed", {
          id: res.id,
          image_url: res.imageUrl,
          prompt,
          variantGroupId
        });
      });

      return NextResponse.json({ data: results, variantGroupId });
    } catch (genError: any) {
      // Refund credits
      await query(
        "UPDATE workspaces SET credits_pool = credits_pool + $1 WHERE id = $2",
        [cost, workspaceId]
      );
      
      // Update generation status
      for (const genId of pendingGenerations) {
        await query(
          "UPDATE generations SET status = 'failed' WHERE id = $1",
          [genId]
        );
        dispatchWebhook(workspaceId, "generation.failed", {
          id: genId,
          error: genError.message || "Generation failed"
        });
      }

      throw genError;
    }
  } catch (error) {
    console.error("Public API Generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
