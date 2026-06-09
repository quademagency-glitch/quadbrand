import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const winnersOnly = searchParams.get("winnersOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let currentWorkspaceId = workspaceId;

    if (!currentWorkspaceId) {
      // Find default workspace
      const { rows: defaultWorkspaces } = await query(
        "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
        [session.uid]
      );
      if (defaultWorkspaces.length === 0) {
        return NextResponse.json({ error: "No workspace found" }, { status: 400 });
      }
      currentWorkspaceId = defaultWorkspaces[0].id;
    } else {
      // Verify workspace belongs to user
      const { rows: workspaces } = await query(
        "SELECT id FROM workspaces WHERE id = $1 AND owner_id = $2",
        [currentWorkspaceId, session.uid]
      );
      if (workspaces.length === 0) {
        return NextResponse.json({ error: "Unauthorized for this workspace" }, { status: 403 });
      }
    }

    let queryText = `SELECT id, prompt, aspect_ratio, image_url, storage_path, status, is_winner, performance_note, created_at
       FROM generations
       WHERE workspace_id = $1 AND status = 'completed'`;
       
    if (winnersOnly) {
      queryText += ` AND is_winner = true`;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`;

    const { rows: images } = await query(queryText, [currentWorkspaceId, limit, offset]);

    return NextResponse.json({ status: "success", data: images });
  } catch (error) {
    console.error("Images API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, is_winner, performance_note } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing image id" }, { status: 400 });
    }

    // Verify ownership
    const { rows: parentRows } = await query(
      "SELECT workspace_id FROM generations WHERE id = $1 AND user_id = $2",
      [id, session.uid]
    );

    if (parentRows.length === 0) {
      return NextResponse.json({ error: "Image not found or unauthorized" }, { status: 404 });
    }

    await query(
      "UPDATE generations SET is_winner = $1, performance_note = $2, updated_at = NOW() WHERE id = $3",
      [is_winner ?? false, performance_note || null, id]
    );

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Images update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
