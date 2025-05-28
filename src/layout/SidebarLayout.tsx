
import type { ReactNode } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"; // adjust path as needed

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-neutral-800 text-white">
        <Sidebar />
        <main className="flex-1 p-6 bg-neutral-900">{children}</main>
      </div>
    </SidebarProvider>
  );
};
