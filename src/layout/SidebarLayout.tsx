import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-neutral-800 text-white">
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="p-4 text-lg font-bold">
            Peak Productivity
          </SidebarHeader>

          <SidebarContent>
            <div className="p-4">Productivity Report</div>
            <div className="p-4">Tasks Reports </div>
            <div className="p-4">Settings</div>
          </SidebarContent>

          <SidebarFooter className="p-4">Footer</SidebarFooter>

          <SidebarRail className="border-r border-border">
            <SidebarTrigger className="m-2" />
          </SidebarRail>
        </Sidebar>

        <SidebarInset>
          {/* Mobile Sidebar Trigger */}
          <div className="p-4 md:hidden">
            <SidebarTrigger className="btn btn-primary" />
          </div>

          <main className="flex-1 w-screen bg-neutral-700">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
