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
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ui/theme-toggle";

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
  const { isDark } = useTheme();

  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen min-w-screen text-white overflow-hidden relative transition-colors duration-300 ${
        isDark ? 'bg-neutral-900' : 'bg-gray-50'
      }`}>
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
          className={`border-r shadow-xl z-50 transition-colors duration-300 ${
            isDark 
              ? 'bg-neutral-800 border-neutral-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          {" "}
          {/* z-50 to ensure it's above overlay */}
          <SidebarHeader className={`p-5 text-2xl font-extrabold overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isDark 
              ? 'bg-neutral-800 text-sky-400' 
              : 'bg-white text-blue-600'
          }`}>
            <div className="flex items-center justify-between">
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
              <div className="ml-4">
                <ThemeToggle />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className={`flex-grow py-4 transition-colors duration-300 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <div className="flex flex-col gap-2 p-2">
              {SidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200
                  ${
                    window.location.pathname === item.path
                      ? isDark
                        ? "bg-neutral-700 text-sky-400 font-semibold" // Active state dark
                        : "bg-blue-50 text-blue-600 font-semibold" // Active state light
                      : isDark
                        ? "text-neutral-300 hover:bg-neutral-700 hover:text-sky-400" // Hover state dark
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600" // Hover state light
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
          <SidebarFooter className={`p-4 text-sm border-t transition-colors duration-300 ${
            isDark 
              ? 'bg-neutral-800 text-neutral-400 border-neutral-700' 
              : 'bg-white text-gray-500 border-gray-200'
          }`}>
            Copyright PK @2025
          </SidebarFooter>
          {/* Desktop Sidebar Toggle (hidden on mobile) */}
          {/* This SidebarRail needs to be correctly positioned relative to Sidebar,
              often outside the main Sidebar element if it's truly a 'rail' for toggling.
              Assuming it's meant for desktop collapse/expand only.
              For an `offcanvas` variant, this might behave differently.
              Let's keep it but ensure it's hidden on small screens. */}
          <SidebarRail className={`hidden md:block border-r transition-colors duration-300 ${
            isDark ? 'border-neutral-700' : 'border-gray-200'
          }`} />
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          {" "}
          {/* flex-1 to make main content take remaining space */}
          {/* Mobile Sidebar Trigger (Hamburger Menu) */}
          <div className={`p-4 md:hidden flex items-center justify-between border-b transition-colors duration-300 ${
            isDark 
              ? 'bg-neutral-800 border-neutral-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div 
              onClick={() => sidebar.setOpen ? sidebar.setOpen(!sidebar.open) : setOpen(!open)}
              className={`flex items-center gap-2 rounded-md p-2 shadow-sm transition-colors cursor-pointer ${
                isDark 
                  ? 'text-sky-400 bg-neutral-700 hover:bg-neutral-600'
                  : 'text-blue-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FaBars className="text-xl" /> {/* Hamburger icon */}
            </div>
            <span
              className={`text-xl font-bold cursor-pointer ${
                isDark ? 'text-sky-400' : 'text-blue-600'
              }`}
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
            <div>
              <ThemeToggle />
            </div>
          </div>
          <main className={`flex-1 h-full overflow-y-auto p-4 md:p-6 transition-colors duration-300 ${
            isDark ? 'bg-neutral-900' : 'bg-gray-50'
          }`}>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
