import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import { generateEmbedding } from "@/lib/embeddings";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    let rows = [];

    if (searchQuery) {
      // Semantic search
      const embedding = await generateEmbedding(searchQuery);
      
      // pgvector cosine distance: embedding <=> $1
      const result = await query(
        `SELECT id, image_url, brand_name, industry, vertical, tags,
         1 - (embedding <=> $1::vector) as similarity
         FROM reference_ads
         WHERE 1 - (embedding <=> $1::vector) > 0.5
         ORDER BY similarity DESC
         LIMIT $2`,
        [`[${embedding.join(',')}]`, limit]
      );
      rows = result.rows;
    } else {
      // Default: recent or random
      const result = await query(
        `SELECT id, image_url, brand_name, industry, vertical, tags
         FROM reference_ads
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );
      rows = result.rows;
    }

    return NextResponse.json({ status: "success", data: rows });
  } catch (error) {
    console.error("Reference ads API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
