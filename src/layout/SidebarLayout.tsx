"use client";
import { type ReactNode } from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  useSidebar, // Assuming useSidebar provides a way to get collapsed state for the trigger
} from "@/components/ui/sidebar";
import { SidebarItems } from "@/const/const";
import { FaBars } from "react-icons/fa6"; // Import FaBars for hamburger icon
import { useNavigate } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineReport,
  MdOutlineSettings,
} from "react-icons/md";

// Helper to get icons for sidebar items
const getSidebarIcon = (label: string) => {
  switch (label) {
    case "Productivity Report":
      return <MdOutlineReport className="size-5" />;
    case "Tasks Reports": // Assuming this maps to Charts
      return <MdOutlineDashboard className="size-5" />;
    case "Test Page":
      return <MdOutlineSettings className="size-5" />;
    case "Settings":
      return <MdOutlineSettings className="size-5" />;
    default:
      return null;
  }
};

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sidebar: any = useSidebar(); // Assuming useSidebar provides current state
  const isMobileOpen = sidebar.open ?? false; // Assuming 'open' state for offcanvas on mobile
  const { open, setOpen } = useSidebar();

  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen bg-neutral-900 text-white overflow-hidden relative">
        {" "}
        {/* Added relative for overlay positioning */}
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden transition-opacity duration-300"
            onClick={() => sidebar.setOpen(false)} // Close sidebar on overlay click
          ></div>
        )}
        <Sidebar
          variant="sidebar"
          collapsible="offcanvas"
          className="bg-neutral-800 border-r border-neutral-700 shadow-xl z-50"
        >
          {" "}
          {/* z-50 to ensure it's above overlay */}
          <SidebarHeader className="p-5 text-2xl font-extrabold bg-neutral-800 text-sky-400 overflow-hidden whitespace-nowrap transition-all duration-300">
            <div
              className="cursor-pointer md:text-left"
              onClick={() => {
                navigate("/"); // This line navigates to the home screen
                if (open) {
                  setOpen(false);
                }
              }}
            >
              TaskSync
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-neutral-800 flex-grow py-4">
            <div className="flex flex-col gap-2 p-2">
              {SidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200
                  ${
                    window.location.pathname === item.path
                      ? "bg-neutral-700 text-sky-400 font-semibold" // Active state
                      : "text-neutral-300 hover:bg-neutral-700 hover:text-sky-400" // Hover state
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobileOpen) {
                      // Close sidebar on mobile after navigation
                      sidebar.setOpen(false);
                    }
                  }}
                >
                  {getSidebarIcon(item.label)}
                  <span className="text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </SidebarContent>
          <SidebarFooter className="p-4 bg-neutral-800 text-neutral-400 text-sm border-t border-neutral-700">
            Copyright PK @2025
          </SidebarFooter>
          {/* Desktop Sidebar Toggle (hidden on mobile) */}
          {/* This SidebarRail needs to be correctly positioned relative to Sidebar,
              often outside the main Sidebar element if it's truly a 'rail' for toggling.
              Assuming it's meant for desktop collapse/expand only.
              For an `offcanvas` variant, this might behave differently.
              Let's keep it but ensure it's hidden on small screens. */}
          <SidebarRail className="hidden md:block border-r border-neutral-700" />
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          {" "}
          {/* flex-1 to make main content take remaining space */}
          {/* Mobile Sidebar Trigger (Hamburger Menu) */}
          <div className="p-4 md:hidden flex items-center justify-between bg-neutral-800 border-b border-neutral-700">
            <div 
              onClick={() => sidebar.setOpen ? sidebar.setOpen(!sidebar.open) : setOpen(!open)}
              className="flex items-center gap-2 text-sky-400 bg-neutral-700 rounded-md p-2 shadow-sm hover:bg-neutral-600 transition-colors cursor-pointer"
            >
              <FaBars className="text-xl" /> {/* Hamburger icon */}
            </div>
            <span
              className="text-xl font-bold text-sky-400 cursor-pointer"
              onClick={() => {
                navigate("/"); // This line navigates to the home screen
                if (open) {
                  setOpen(false); // Close sidebar after navigation on mobile
                }
              }}
            >
              Peak Productivity
            </span>
            {/* Mobile Header Title */}
          </div>
          <main className="flex-1 h-full overflow-y-auto bg-neutral-900 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
