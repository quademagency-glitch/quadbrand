import { redirect } from "next/navigation";
import { DeveloperSettingsClient } from "./DeveloperSettingsClient";
import { createClient } from "@/lib/supabase/server";
import { query } from "@/lib/db/client";

export const metadata = {
  title: "Developer Settings | QuadBrand",
};

export default async function DeveloperSettingsPage() {
  const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;

  if (!session) {
    redirect("/login");
  }

  const { rows } = await query("SELECT * FROM user_profiles WHERE id = $1", [session.uid]);
  const dbUser = rows[0];

  if (!dbUser) {
    redirect("/login");
  }

  // We pass the user object down so we can read api_key
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Developer Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your API keys and webhooks for programmatic access.
        </p>
      </div>

      <DeveloperSettingsClient user={dbUser as any} />
    </div>
  );
}
