import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-secondary)]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[250px] transition-all duration-300">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
