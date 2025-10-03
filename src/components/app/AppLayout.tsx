import { Outlet } from "react-router-dom";
import Navbar from "@/components/general/Navbar";
import { OfflineIndicator } from "@/components/OfflineIndicator";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OfflineIndicator />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
