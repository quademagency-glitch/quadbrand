import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a random secure API key
    // Format: qb_live_... (QuadBrand Live)
    const rawKey = crypto.randomBytes(32).toString("hex");
    const apiKey = `qb_live_${rawKey}`;

    // Update in user_profiles
    await query(
      "UPDATE user_profiles SET api_key = $1 WHERE id = $2",
      [apiKey, session.uid]
    );

    return NextResponse.json({ api_key: apiKey });
  } catch (error) {
    console.error("API Key generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate API key" },
      { status: 500 }
    );
  }
}
