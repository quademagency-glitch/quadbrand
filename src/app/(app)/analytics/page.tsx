import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnalyticsClient from "./AnalyticsClient";

export const metadata = {
  title: "Analytics | QuadBrand",
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Usage Analytics
        </h1>
        <p className="text-[var(--text-secondary)]">
          Insights into your brand's creative velocity and asset generation.
        </p>
      </div>

      <AnalyticsClient />
    </div>
  );
}
