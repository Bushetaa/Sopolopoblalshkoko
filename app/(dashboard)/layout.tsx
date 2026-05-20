import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import MobileSidebar from "@/components/layout/MobileSidebar";
import CommandPalette from "@/components/layout/CommandPalette";
import { LayoutProvider } from "@/context/LayoutContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { Suspense } from "react";
import Chatbot from "@/components/dashboard/Chatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-gray-950"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AuthGuard>
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
            <Chatbot />
          </div>
        </LayoutProvider>
      </AuthGuard>
    </Suspense>
  );
}
