"use client";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarItems } from "@/const/const";
import { FaArrowRightLong } from "react-icons/fa6";

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sidebar: any = useSidebar(); // fallback if typing not available
  const isCollapsed = sidebar.collapsed ?? sidebar.isCollapsed ?? false;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen bg-neutral-800 text-white overflow-hidden">
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="p-4 text-lg font-bold bg-neutral-800 text-amber-50">
            Peak Productivity
          </SidebarHeader>

          <SidebarContent className="bg-neutral-700">
            <div className="flex flex-col gap-1 p-2">
              {SidebarItems.map((items) => (
                <div
                  key={items.label}
                  className="text-amber-50 px-2 m-4 py-1 rounded hover:bg-neutral-600 cursor-pointer"
                >
                  {items.value}
                </div>
              ))}
            </div>
          </SidebarContent>

          <div className="border-s-amber-50 border-1" />
          <SidebarFooter className="p-4 bg-neutral-700 text-amber-50">
            Copyright PK @2025
          </SidebarFooter>

          {/* Desktop Sidebar Toggle (with arrow) */}
          <SidebarRail className="border-r border-border">
            <SidebarTrigger className="m-2 p-2 rounded bg-neutral-600 hover:bg-neutral-500 transition">
              <FaArrowRightLong
                className={`text-amber-50 transition-transform duration-200 ${
                  isCollapsed ? "" : "rotate-180"
                }`}
              />
            </SidebarTrigger>
          </SidebarRail>
        </Sidebar>

        <SidebarInset>
          {/* Mobile Sidebar Toggle (with arrow) */}
          <div className="p-4 md:hidden">
            <SidebarTrigger className="btn btn-primary flex items-center gap-2 text-amber-50">
              <FaArrowRightLong
                className={`transition-transform duration-200 ${
                  isCollapsed ? "" : "rotate-180"
                }`}
              />
            </SidebarTrigger>
          </div>

          <main className="flex-1 h-screen overflow-y-auto bg-neutral-900 p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
