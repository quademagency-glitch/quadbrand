import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import { generateImageWithFlux } from "@/lib/replicate";
import { dispatchWebhook } from "@/lib/webhooks";
import { sendEmail } from "@/lib/email";
import LowCreditsEmail from "../../../../emails/LowCreditsEmail";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { prompt, aspectRatio, modelId, brandId, workspaceId, numOutputs = 1 } = await request.json();

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

    // Cost logic (Fast=1, Standard=2, Pro=5) per output
    let baseCost = 2;
    if (modelId === "fast") baseCost = 1;
    if (modelId === "pro") baseCost = 5;
    
    const cost = baseCost * numOutputs;

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

    // Send Low Credits Email if it just crossed the 20 threshold
    if (workspace.credits_pool >= 20 && workspace.credits_pool - cost < 20) {
      // Find the user's email to send the alert to
      const { rows: userRows } = await query(
        "SELECT email, full_name FROM user_profiles WHERE id = $1",
        [session.uid]
      );
      if (userRows.length > 0) {
        const u = userRows[0];
        // Note: During Resend testing, this will only deliver to the verified testing email address
        await sendEmail({
          to: u.email,
          subject: "Your credits are running low",
          react: require("react").createElement(LowCreditsEmail, { 
            name: u.full_name || "Creator", 
            balance: workspace.credits_pool - cost 
          }),
        });
      }
    }

    // Create a variant group ID if we are generating multiples
    const variantGroupId = numOutputs > 1 ? crypto.randomUUID() : null;

    // Create pending generation records
    const pendingGenerations = [];
    for (let i = 0; i < numOutputs; i++) {
      const { rows: generationRows } = await query(
        `INSERT INTO generations 
          (workspace_id, brand_id, user_id, prompt, model, aspect_ratio, status, credits_cost, variant_group_id) 
         VALUES ($1, $2, $3, $4, $5, $6, 'generating', $7, $8) RETURNING id`,
        [workspaceId, brandId || null, session.uid, prompt, modelId || "standard", aspectRatio, baseCost, variantGroupId]
      );
      pendingGenerations.push(generationRows[0].id);
    }

    try {
      // Call Replicate for each output (using Promise.all for parallel generation)
      const generationPromises = pendingGenerations.map(async (genId) => {
        const imageUrl = await generateImageWithFlux({
          prompt,
          aspect_ratio: aspectRatio,
        });
        
        await query(
          "UPDATE generations SET image_url = $1, status = 'completed' WHERE id = $2",
          [imageUrl, genId]
        );
        
        return { id: genId, imageUrl };
      });

      const results = await Promise.all(generationPromises);

      // Log transaction
      await query(
        `INSERT INTO credit_transactions (workspace_id, user_id, amount, reason, generation_id)
         VALUES ($1, $2, $3, 'generation', $4)`,
        [workspaceId, session.uid, -cost, pendingGenerations[0]]
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

      return NextResponse.json({ status: "success", results, variantGroupId });
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
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
