import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import crypto from "crypto";

// Get user's webhook
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Assuming user's primary workspace for now (in a multi-workspace setup, we'd pass workspace_id)
    const { rows: workspaces } = await query(
      "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
      [session.uid]
    );

    if (workspaces.length === 0) return NextResponse.json({ webhook: null });

    const workspaceId = workspaces[0].id;
    const { rows: webhooks } = await query(
      "SELECT id, url, secret FROM webhooks WHERE workspace_id = $1 LIMIT 1",
      [workspaceId]
    );

    return NextResponse.json({ webhook: webhooks[0] || null });
  } catch (error) {
    console.error("Webhook GET error:", error);
    return NextResponse.json({ error: "Failed to fetch webhook" }, { status: 500 });
  }
}

// Create/Update webhook
export async function POST(request: Request) {
  return await handleUpsert(request);
}

export async function PUT(request: Request) {
  return await handleUpsert(request);
}

async function handleUpsert(request: Request) {
  try {
    const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { url } = await request.json();
    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Get workspace
    const { rows: workspaces } = await query(
      "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
      [session.uid]
    );
    if (workspaces.length === 0) return NextResponse.json({ error: "No workspace" }, { status: 400 });
    
    const workspaceId = workspaces[0].id;
    
    // Check if exists
    const { rows: existing } = await query(
      "SELECT id FROM webhooks WHERE workspace_id = $1",
      [workspaceId]
    );

    let webhookRecord;
    if (existing.length > 0) {
      // Update
      const { rows } = await query(
        "UPDATE webhooks SET url = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
        [url, existing[0].id]
      );
      webhookRecord = rows[0];
    } else {
      // Insert
      const secret = `whsec_${crypto.randomBytes(32).toString("base64url")}`;
      const { rows } = await query(
        "INSERT INTO webhooks (workspace_id, url, secret) VALUES ($1, $2, $3) RETURNING *",
        [workspaceId, url, secret]
      );
      webhookRecord = rows[0];
    }

    return NextResponse.json({ webhook: webhookRecord });
  } catch (error) {
    console.error("Webhook UPSERT error:", error);
    return NextResponse.json({ error: "Failed to save webhook" }, { status: 500 });
  }
}
