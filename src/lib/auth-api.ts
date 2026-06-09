import { NextResponse } from "next/server";
import { query } from "@/lib/db/client";

export async function authenticateApiKey(request: Request) {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 }) };
  }

  const apiKey = authHeader.split(" ")[1];

  try {
    const { rows: users } = await query(
      "SELECT id, email FROM user_profiles WHERE api_key = $1 LIMIT 1",
      [apiKey]
    );

    if (users.length === 0) {
      return { user: null, error: NextResponse.json({ error: "Invalid API Key" }, { status: 401 }) };
    }

    return { user: users[0], error: null };
  } catch (err) {
    console.error("API Auth Error:", err);
    return { user: null, error: NextResponse.json({ error: "Internal server error" }, { status: 500 }) };
  }
}
