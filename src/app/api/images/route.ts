import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/firebase/auth";
import { query } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
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

    const { rows: images } = await query(
      `SELECT id, prompt, aspect_ratio, image_url, storage_path, status, created_at
       FROM generations
       WHERE workspace_id = $1 AND status = 'completed'
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [currentWorkspaceId, limit, offset]
    );

    return NextResponse.json({ status: "success", data: images });
  } catch (error) {
    console.error("Images API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
