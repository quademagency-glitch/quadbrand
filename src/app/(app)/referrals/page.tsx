import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { query } from "@/lib/db/client";
import ReferralsClient from "./ReferralsClient";

export const metadata = {
  title: "Refer & Earn | QuadBrand",
};

export default async function ReferralsPage() {
  const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;

  if (!session) {
    redirect("/login");
  }

  const { rows: users } = await query("SELECT * FROM user_profiles WHERE id = $1", [session.uid]);
  const dbUser = users[0];

  if (!dbUser) {
    redirect("/login");
  }

  // Get all users who were referred by this user
  const { rows: referredUsers } = await query(
    "SELECT id, full_name, email, created_at FROM user_profiles WHERE referred_by = $1 ORDER BY created_at DESC",
    [session.uid]
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Refer & Earn
        </h1>
        <p className="text-[var(--text-secondary)]">
          Invite friends to QuadBrand. When they sign up, you both get 50 free credits!
        </p>
      </div>

      <ReferralsClient userId={session.uid} referredUsers={referredUsers} />
    </div>
  );
}
