import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth-api";
import { query } from "@/lib/db/client";

export async function GET(request: Request) {
  const { user, error } = await authenticateApiKey(request);
  if (error) return error;

  try {
    // Return all brands belonging to the workspaces this user owns/is part of
    const { rows: brands } = await query(`
      SELECT b.id, b.name, b.industry, b.aesthetic, b.onboarding_status
      FROM brands b
      JOIN workspaces w ON b.workspace_id = w.id
      LEFT JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE w.owner_id = $1 OR wm.user_id = $1
    `, [user?.id]);

    return NextResponse.json({ brands });
  } catch (err) {
    console.error("API GET /v1/brands error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
