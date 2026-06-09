import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";
import { Generation } from "@/types";

export default async function DashboardPage() {
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

  // Fetch total images generated
  const { rows: genCounts } = await query(
    "SELECT COUNT(*) as count FROM generations WHERE user_id = $1 AND status = 'completed'",
    [user.id]
  );
  const imagesGenerated = parseInt(genCounts[0]?.count || "0", 10);

  // Fetch total active brands
  const { rows: brandCounts } = await query(
    "SELECT COUNT(*) as count FROM brands WHERE workspace_id = $1",
    [workspaceId]
  );
  const activeBrands = parseInt(brandCounts[0]?.count || "0", 10);

  // Fetch avg generation time (mock for now as we don't store time precisely yet, or we could calculate if we add end_time)
  const avgGenerationTime = "5.2s"; 

  // Fetch recent generations
  const { rows: recentGenerations } = await query(
    `SELECT prompt, aspect_ratio as ratio, status, image_url, created_at 
     FROM generations 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT 4`,
    [user.id]
  );

  return (
    <DashboardClient 
      stats={{
        creditsRemaining: creditsPool,
        imagesGenerated,
        activeBrands,
        avgGenerationTime
      }}
      recentGenerations={recentGenerations}
      fullName={user.user_metadata?.full_name || "Creator"}
    />
  );
}
