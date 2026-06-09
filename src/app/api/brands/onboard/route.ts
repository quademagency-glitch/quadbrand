import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import { scrapeAndAnalyzeBrand } from "@/lib/brand-scraper";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, name } = body;
    let workspaceId = body.workspaceId;

    if (!url || !name) {
      return NextResponse.json({ error: "Missing required fields: url, name" }, { status: 400 });
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

    // Verify workspace belongs to user (or user is member)
    const { rows: workspaces } = await query(
      "SELECT id FROM workspaces WHERE id = $1 AND owner_id = $2",
      [workspaceId, session.uid]
    );

    if (workspaces.length === 0) {
      return NextResponse.json({ error: "Workspace not found or unauthorized" }, { status: 403 });
    }

    // 2. Insert initial "analyzing" brand record
    const { rows: brandRows } = await query(
      `INSERT INTO brands (workspace_id, name, source_url, onboarding_status) 
       VALUES ($1, $2, $3, 'analyzing') RETURNING id`,
      [workspaceId, name, url]
    );
    
    const brandId = brandRows[0].id;

    // 3. Kick off scraping and analysis
    try {
      const brandData = await scrapeAndAnalyzeBrand(url);

      // 4. Update brand with extracted data
      await query(
        `UPDATE brands 
         SET colors = $1, fonts = $2, aesthetic = $3, industry = $4, brand_summary = $5, onboarding_status = 'ready'
         WHERE id = $6`,
        [
          brandData.colors,
          brandData.fonts,
          brandData.aesthetic,
          brandData.industry,
          brandData.brand_summary,
          brandId
        ]
      );

      return NextResponse.json({ 
        status: "success", 
        brandId,
        data: brandData 
      });

    } catch (scrapeError) {
      console.error("Scraping failed:", scrapeError);
      
      // Update status to failed
      await query(
        `UPDATE brands SET onboarding_status = 'failed' WHERE id = $1`,
        [brandId]
      );
      
      return NextResponse.json({ error: "Failed to analyze brand" }, { status: 500 });
    }

  } catch (error) {
    console.error("Brand onboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
