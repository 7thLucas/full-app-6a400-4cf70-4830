import { Outlet } from "react-router";
import { TopBar } from "~/care/components/top-bar";
import { BottomNav } from "~/care/components/bottom-nav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <TopBar />
        <main className="flex-1 pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
