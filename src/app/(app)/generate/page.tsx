import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import GenerateClient from "./GenerateClient";
import { redirect } from "next/navigation";

export default async function GeneratePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch workspace and credits
  const { rows: workspaces } = await query(
    "SELECT id, credits_pool FROM workspaces WHERE owner_id = $1 LIMIT 1",
    [user.id]
  );
  
  const workspaceId = workspaces[0]?.id;
  const creditsPool = workspaces[0]?.credits_pool || 0;

  // Fetch active brands
  const { rows: brands } = await query(
    "SELECT id, name FROM brands WHERE workspace_id = $1",
    [workspaceId]
  );

  return (
    <GenerateClient 
      brands={brands}
      credits={creditsPool}
      workspaceId={workspaceId}
    />
  );
}
