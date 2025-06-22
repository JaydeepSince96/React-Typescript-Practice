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
import { SidebarItems } from "@/const/const";

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-neutral-800 text-white">
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="p-4 text-lg font-bold bg-neutral-800 text-amber-50">
            Peak Productivity
          </SidebarHeader>

          {SidebarItems.map((items) => (
            <SidebarContent className="bg-neutral-700">
              {
                <div key={items.lable} className="p-4 text-amber-50">
                  {items.value}
                </div>
              }
            </SidebarContent>
          ))}

          {/* <SidebarContent className="bg-neutral-700">
            <div className="p-4">Productivity Report</div>
            <div className="p-4">Tasks Reports </div>
            <div className="p-4">Settings</div>
          </SidebarContent> */}
          <div className="border-s-amber-50 border-1"></div>
          <SidebarFooter className="p-4 bg-neutral-700 text-amber-50">
            Copyright PK @2025
          </SidebarFooter>

          <SidebarRail className="border-r border-border">
            <SidebarTrigger className="m-2" />
          </SidebarRail>
        </Sidebar>

        <SidebarInset>
          {/* Mobile Sidebar Trigger */}
          <div className="p-4 md:hidden">
            <SidebarTrigger className="btn btn-primary" />
          </div>

          <main className="flex-1 w-screen bg-neutral-900">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
