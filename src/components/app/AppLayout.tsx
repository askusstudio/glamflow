import { Outlet } from "react-router-dom";
import Navbar from "@/components/general/Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
