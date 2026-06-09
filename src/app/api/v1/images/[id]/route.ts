import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth-api";
import { query } from "@/lib/db/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await authenticateApiKey(request);
  if (error) return error;

  try {
    const { id } = await params;

    // Fetch the image, ensuring it belongs to a workspace the user has access to
    const { rows: images } = await query(`
      SELECT g.id, g.prompt, g.model, g.aspect_ratio, g.status, g.image_url, g.created_at
      FROM generations g
      JOIN workspaces w ON g.workspace_id = w.id
      LEFT JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE g.id = $1 AND (w.owner_id = $2 OR wm.user_id = $2)
      LIMIT 1
    `, [id, user?.id]);

    if (images.length === 0) {
      return NextResponse.json({ error: "Image not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ data: images[0] });
  } catch (err) {
    console.error("API GET /v1/images/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
