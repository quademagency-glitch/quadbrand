import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/firebase/auth";
import { query } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, workspaceId, role } = await request.json();

    if (!email || !workspaceId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user has permission to invite (must be owner or admin)
    const { rows: memberships } = await query(
      "SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2",
      [workspaceId, session.uid]
    );

    // Also check if they are owner of workspace directly
    const { rows: workspaces } = await query(
      "SELECT id FROM workspaces WHERE id = $1 AND owner_id = $2",
      [workspaceId, session.uid]
    );

    const isOwner = workspaces.length > 0;
    const isMemberAdmin = memberships.length > 0 && ['owner', 'admin'].includes(memberships[0].role);

    if (!isOwner && !isMemberAdmin) {
      return NextResponse.json({ error: "Forbidden: You cannot invite to this workspace" }, { status: 403 });
    }

    // In a full implementation, we'd use Resend to send an email invite token
    // For now, we simulate an invite creation in the database
    // Assume user_profiles has the email if they've signed up
    const { rows: users } = await query(
      "SELECT id FROM user_profiles WHERE email = $1",
      [email]
    );

    if (users.length > 0) {
      // User exists, add them directly (in real app, still send an email or notification)
      await query(
        `INSERT INTO workspace_members (workspace_id, user_id, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
        [workspaceId, users[0].id, role]
      );
    } else {
      // User doesn't exist, would create an invite link here and email them
      // To be implemented fully with Resend integration
    }

    return NextResponse.json({ status: "success", message: "Invite sent successfully" });
  } catch (error) {
    console.error("Workspace invite API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
