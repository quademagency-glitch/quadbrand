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

    // 1. Get user's default workspace
    const { rows: workspaces } = await query(
      "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
      [session.uid]
    );

    if (workspaces.length === 0) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }
    const workspaceId = workspaces[0].id;

    // 2. Generations over time (last 30 days)
    const { rows: generationsOverTime } = await query(`
      SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count
      FROM generations
      WHERE workspace_id = $1 AND created_at > NOW() - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC
    `, [workspaceId]);

    // 3. Generations per brand
    const { rows: generationsPerBrand } = await query(`
      SELECT b.name, COUNT(g.id) as count
      FROM generations g
      LEFT JOIN brands b ON g.brand_id = b.id
      WHERE g.workspace_id = $1
      GROUP BY b.name
    `, [workspaceId]);

    // 4. Top Aspect Ratios
    const { rows: topAspectRatios } = await query(`
      SELECT aspect_ratio as ratio, COUNT(*) as count
      FROM generations
      WHERE workspace_id = $1
      GROUP BY ratio
      ORDER BY count DESC
    `, [workspaceId]);

    return NextResponse.json({
      generationsOverTime,
      generationsPerBrand,
      topAspectRatios,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
