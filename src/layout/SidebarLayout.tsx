"use client";
import { type ReactNode, useState } from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarItems, TaskSections } from "@/const/const";
import { FaBars } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineReport,
  MdOutlineSettings,
  MdOutlineTask,
  MdOutlinePlaylistAddCheck,
  MdOutlinePendingActions,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ui/theme-toggle";

// Helper to get icons for sidebar items
const getSidebarIcon = (label: string) => {
  switch (label) {
    case "Productivity Report":
      return <MdOutlineReport className="size-5" />;
    case "Tasks Reports":
      return <MdOutlineDashboard className="size-5" />;
    case "Settings":
      return <MdOutlineSettings className="size-5" />;
    default:
      return null;
  }
};

// Helper to get icons for task sections
const getTaskSectionIcon = (label: string) => {
  switch (label) {
    case "Completed Tasks":
      return <MdOutlinePlaylistAddCheck className="size-4 text-green-500" />;
    case "Pending Tasks":
      return <MdOutlinePendingActions className="size-4 text-orange-500" />;
    case "Overdue Tasks":
      return <MdOutlineTask className="size-4 text-red-500" />;
    default:
      return <MdOutlineTask className="size-4" />;
  }
};

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const { open, setOpen } = useSidebar();
  const isMobileOpen = open ?? false;
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // State for collapsible "All Tasks" section
  const [isAllTasksExpanded, setIsAllTasksExpanded] = useState(false);

  const toggleAllTasks = () => {
    setIsAllTasksExpanded(!isAllTasksExpanded);
  };

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
            onClick={() => setOpen(false)}
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
          <SidebarHeader className={`p-5 text-2xl font-extrabold overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isDark 
              ? 'bg-neutral-800 text-sky-400' 
              : 'bg-white text-blue-600'
          }`}>
            <div className="flex items-center justify-between">
              <div
                className="cursor-pointer md:text-left"
                onClick={() => {
                  navigate("/");
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
              {/* All Tasks Section - Collapsible */}
              <div>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    isDark 
                      ? 'text-neutral-300 hover:bg-neutral-700 hover:text-sky-400' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={toggleAllTasks}
                >
                  <MdOutlineTask className="size-5" />
                  <span className="text-lg flex-1">All Tasks</span>
                  {isAllTasksExpanded ? (
                    <MdKeyboardArrowDown className="size-5" />
                  ) : (
                    <MdKeyboardArrowRight className="size-5" />
                  )}
                </div>
                
                {/* Collapsible Task Sub-sections */}
                {isAllTasksExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {TaskSections.map((section) => (
                      <div
                        key={section.label}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                          window.location.pathname + window.location.search === section.path
                            ? isDark
                              ? "bg-neutral-700 text-sky-400 font-semibold"
                              : "bg-blue-50 text-blue-600 font-semibold"
                            : isDark
                              ? "text-neutral-400 hover:bg-neutral-700 hover:text-sky-400"
                              : "text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        }`}
                        onClick={() => {
                          navigate(section.path);
                          if (isMobileOpen) {
                            setOpen(false);
                          }
                        }}
                      >
                        {getTaskSectionIcon(section.label)}
                        <span className="text-sm">{section.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Regular Sidebar Items */}
              {SidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    window.location.pathname === item.path
                      ? isDark
                        ? "bg-neutral-700 text-sky-400 font-semibold"
                        : "bg-blue-50 text-blue-600 font-semibold"
                      : isDark
                        ? "text-neutral-300 hover:bg-neutral-700 hover:text-sky-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobileOpen) {
                      setOpen(false);
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
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          {/* Mobile Sidebar Trigger (Hamburger Menu) */}
          <div className={`p-4 md:hidden flex items-center justify-between border-b transition-colors duration-300 ${
            isDark 
              ? 'bg-neutral-800 border-neutral-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div 
              onClick={() => setOpen(!open)}
              className={`flex items-center gap-2 rounded-md p-2 shadow-sm transition-colors cursor-pointer ${
                isDark 
                  ? 'text-sky-400 bg-neutral-700 hover:bg-neutral-600'
                  : 'text-blue-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FaBars className="text-xl" />
            </div>
            <span
              className={`text-xl font-bold cursor-pointer ${
                isDark ? 'text-sky-400' : 'text-blue-600'
              }`}
              onClick={() => {
                navigate("/");
                if (open) {
                  setOpen(false);
                }
              }}
            >
              Peak Productivity
            </span>
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
