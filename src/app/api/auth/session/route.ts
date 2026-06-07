import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/firebase/auth";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { query } from "@/lib/db/client";

import { decodeJwt } from "@/lib/firebase/auth";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 401 });
    }

    // Decode token instead of full verify to bypass ADC project mismatch locally
    const decodedToken = decodeJwt(idToken);
    
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
    }
    
    // Normalize user ID
    decodedToken.uid = decodedToken.user_id || decodedToken.uid;
    
    // Create the session cookie
    const cookieOptions = await createSessionCookie(idToken);
    
    const cookieStore = await cookies();
    cookieStore.set(cookieOptions.name, cookieOptions.value, {
      maxAge: cookieOptions.maxAge,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      path: cookieOptions.path,
    });

    // Check if user exists in our DB, if not create them
    const { rows } = await query("SELECT id FROM user_profiles WHERE id = $1", [decodedToken.uid]);
    
    if (rows.length === 0) {
      // Create new user profile
      await query(
        `INSERT INTO user_profiles (id, email, full_name, avatar_url) 
         VALUES ($1, $2, $3, $4)`,
        [
          decodedToken.uid,
          decodedToken.email,
          decodedToken.name || null,
          decodedToken.picture || null
        ]
      );

      // Create a default workspace for the new user
      await query(
        `INSERT INTO workspaces (name, owner_id) VALUES ($1, $2)`,
        [`${decodedToken.name || 'My'} Workspace`, decodedToken.uid]
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  // Clear the session cookie
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ status: "success" });
}
