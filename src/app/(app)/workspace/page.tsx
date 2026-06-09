import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import { redirect } from "next/navigation";
import WorkspaceClient from "@/components/workspace/WorkspaceClient";

export default async function WorkspacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch workspace details
  const { rows: workspaces } = await query(
    "SELECT id, name, logo_url FROM workspaces WHERE owner_id = $1 LIMIT 1",
    [user.id]
  );

  const workspace = workspaces[0];
  if (!workspace) {
    redirect("/dashboard");
  }

  // Fetch members (In Phase 3 we only show owner + future invites, but let's query workspace_members if we had them)
  const { rows: members } = await query(
    \`SELECT u.id, u.full_name, u.email, u.avatar_url, 'owner' as role 
     FROM users u 
     WHERE u.id = $1\`,
    [user.id]
  );

  // Future: query workspace_members and UNION it

  return (
    <WorkspaceClient 
      workspace={workspace} 
      members={members} 
    />
  );
}
