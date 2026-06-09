import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";
import { redirect } from "next/navigation";
import BillingClient from "@/components/billing/BillingClient";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch workspace details
  const { rows: workspaces } = await query(
    "SELECT id, credits_pool, plan, paystack_customer_id FROM workspaces WHERE owner_id = $1 LIMIT 1",
    [user.id]
  );

  const workspace = workspaces[0];
  if (!workspace) {
    redirect("/dashboard");
  }

  // Fetch usage stats
  const { rows: generations } = await query(
    "SELECT COUNT(*) as count FROM generations WHERE workspace_id = $1",
    [workspace.id]
  );
  
  const { rows: brands } = await query(
    "SELECT COUNT(*) as count FROM brands WHERE workspace_id = $1",
    [workspace.id]
  );

  return (
    <BillingClient 
      workspace={workspace} 
      generationsCount={parseInt(generations[0]?.count || "0")} 
      brandsCount={parseInt(brands[0]?.count || "0")} 
    />
  );
}
