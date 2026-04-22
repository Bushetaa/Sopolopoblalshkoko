import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import MobileSidebar from "@/components/layout/MobileSidebar";
import CommandPalette from "@/components/layout/CommandPalette";
import { LayoutProvider } from "@/context/LayoutContext";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <div className="flex h-screen bg-gray-950 text-gray-50 overflow-hidden">
        <Suspense fallback={null}>
          <Sidebar className="hidden lg:flex" />
        </Suspense>
        <Suspense fallback={null}>
          <MobileSidebar />
        </Suspense>
        <CommandPalette />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
