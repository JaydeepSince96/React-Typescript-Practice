"use client";
import { type ReactNode, useState, useEffect } from "react";
import {
  useSidebar, // 1. Import the useSidebar hook
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
  MdMenu,
  MdClose,
} from "react-icons/md";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ui/theme-toggle";

// Helper to get icons for sidebar items
const getSidebarIcon = (label: string, isCollapsed = false) => {
  const iconSize = isCollapsed ? "size-5" : "size-5";
  switch (label) {
    case "Productivity Report":
      return <MdOutlineReport className={iconSize} />;
    case "Tasks Reports":
      return <MdOutlineDashboard className={iconSize} />;
    case "Settings":
      return <MdOutlineSettings className={iconSize} />;
    default:
      return null;
  }
};

// Helper to get icons for task sections
const getTaskSectionIcon = (label: string) => {
  switch (label) {
    case "Completed Tasks":
      return <MdOutlinePlaylistAddCheck className="size-4 text-green-500" />;
    case "Uncompleted Tasks":
      return <MdOutlinePendingActions className="size-4 text-orange-500" />;
    case "Overdue Tasks":
      return <MdOutlineTask className="size-4 text-red-500" />;
    default:
      return <MdOutlineTask className="size-4" />;
  }
};

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  // 2. Get state and toggle function from the context instead of local state
  const { state, toggleSidebar, open: isMobileOpen, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [isAllTasksExpanded, setIsAllTasksExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("allTasksExpanded");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("allTasksExpanded", isAllTasksExpanded.toString());
    }
  }, [isAllTasksExpanded]);

  // Toggle body class when mobile sidebar opens/closes
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isMobileOpen) {
        document.body.classList.add("sidebar-open");
      } else {
        document.body.classList.remove("sidebar-open");
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("sidebar-open");
      }
    };
  }, [isMobileOpen]);

  const handleAllTasksClick = () => {
    const isHomePage = location.pathname === "/";
    if (isHomePage) {
      setIsAllTasksExpanded(!isAllTasksExpanded);
    } else {
      setIsAllTasksExpanded(true);
      navigate("/");
    }
    // Removed automatic sidebar closing - let users close it manually
  };

  return (
    <div
      className={`flex min-h-screen text-white relative transition-colors duration-300 ${
        isDark ? "bg-neutral-900" : "bg-gray-50"
      } ${isMobileOpen ? "overflow-hidden" : ""}`}
    >
      {/* Mobile Overlay - Lighter overlay that doesn't create black screen */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[100] md:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar - Hidden on mobile unless open, lower z-index than Sheet */}
      <div
        className={`
        ${isMobileOpen ? "fixed" : "hidden"} md:block
        ${isMobileOpen ? "inset-y-0 left-0 z-[200]" : ""}
        ${
          isDark
            ? "bg-neutral-800 border-neutral-700"
            : "bg-white border-gray-200"
        }
        border-r shadow-xl transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
        ${isMobileOpen ? "w-64" : ""}
      `}
      >
        {/* Sidebar Header */}
        <div
          className={`${
            isCollapsed && !isMobileOpen ? "p-2" : "p-5"
          } text-2xl font-extrabold overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isDark ? "bg-neutral-800 text-sky-400" : "bg-white text-blue-600"
          }`}
        >
          <div className="flex items-center justify-between">
            {(!isCollapsed || isMobileOpen) && (
              <div
                className="cursor-pointer md:text-left"
                onClick={() => {
                  navigate("/");
                  // Removed automatic sidebar closing - let users close it manually
                }}
              >
                TaskSync
              </div>
            )}
            <div className="flex items-center gap-2">
              {(!isCollapsed || isMobileOpen) && (
                <div className={`${isMobileOpen ? "" : "ml-4"}`}>
                  <ThemeToggle />
                </div>
              )}
              {/* Mobile close button - only show on mobile when sidebar is open */}
              {isMobileOpen && (
                <button
                  onClick={() => setOpen(false)}
                  className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
                    isDark
                      ? "hover:bg-neutral-700 text-sky-400"
                      : "hover:bg-gray-100 text-blue-600"
                  }`}
                  title="Close sidebar"
                >
                  <MdClose className="size-5" />
                </button>
              )}
              {/* Desktop toggle button - hidden on mobile */}
              <button
                onClick={toggleSidebar}
                className={`hidden md:block p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "hover:bg-neutral-700 text-sky-400"
                    : "hover:bg-gray-100 text-blue-600"
                }`}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <MdMenu className="size-5" />
                ) : (
                  <MdClose className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div
          className={`flex-grow py-4 transition-colors duration-300 ${
            isDark ? "bg-neutral-800" : "bg-white"
          } overflow-y-auto`}
        >
          {!isCollapsed || isMobileOpen ? (
            <div className="flex flex-col gap-2 p-2">
              {/* All Tasks Section - Collapsible */}
              <div>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    window.location.pathname === "/" && !window.location.search
                      ? isDark
                        ? "bg-neutral-700 text-sky-400 font-semibold"
                        : "bg-blue-50 text-blue-600 font-semibold"
                      : isDark
                      ? "text-neutral-300 hover:bg-neutral-700 hover:text-sky-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={handleAllTasksClick}
                >
                  <MdOutlineTask className="size-5" />
                  <span className="text-lg">All Tasks</span>
                  {isAllTasksExpanded ? (
                    <MdKeyboardArrowDown className="size-4 ml-auto" />
                  ) : (
                    <MdKeyboardArrowRight className="size-4 ml-auto" />
                  )}
                </div>
                {isAllTasksExpanded && (
                  <div className="pl-6 mt-2 space-y-1">
                    {TaskSections.map((section) => (
                      <div
                        key={section.label}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                          window.location.pathname === section.path
                            ? isDark
                              ? "bg-neutral-700 text-sky-400 font-semibold"
                              : "bg-blue-50 text-blue-600 font-semibold"
                            : isDark
                            ? "text-neutral-300 hover:bg-neutral-700 hover:text-sky-400"
                            : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                        }`}
                        onClick={() => {
                          navigate(section.path);
                          // Removed automatic sidebar closing - let users close it manually
                        }}
                      >
                        {getTaskSectionIcon(section.label)}
                        <span className="text-sm">{section.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reports & Settings */}
              <div className="mt-4">
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
                      // Removed automatic sidebar closing - let users close it manually
                    }}
                  >
                    {getSidebarIcon(item.label, false)}
                    <span className="text-lg">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Collapsed state - show only icons (desktop only)
            <div className="flex flex-col gap-2 p-2 items-center">
              <div
                className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  window.location.pathname === "/" && !window.location.search
                    ? isDark
                      ? "bg-neutral-700 text-sky-400"
                      : "bg-blue-50 text-blue-600"
                    : isDark
                    ? "text-neutral-300 hover:bg-neutral-700 hover:text-sky-400"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
                onClick={handleAllTasksClick}
                title="All Tasks"
              >
                <MdOutlineTask className="size-5" />
              </div>
              {SidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    window.location.pathname === item.path
                      ? isDark
                        ? "bg-neutral-700 text-sky-400"
                        : "bg-blue-50 text-blue-600"
                      : isDark
                      ? "text-neutral-300 hover:bg-neutral-700 hover:text-sky-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    // Removed automatic sidebar closing - let users close it manually
                  }}
                  title={item.value}
                >
                  {getSidebarIcon(item.label, true)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div
          className={`${
            isCollapsed && !isMobileOpen ? "p-2" : "p-4"
          } text-sm border-t transition-colors duration-300 ${
            isDark
              ? "bg-neutral-800 text-neutral-400 border-neutral-700"
              : "bg-white text-gray-500 border-gray-200"
          }`}
        >
          {(!isCollapsed || isMobileOpen) && "Copyright PK @2025"}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed && !isMobileOpen ? "md:ml-16" : "md:ml-64"
        } ${isMobileOpen ? "ml-0" : "ml-0"} ${
          isDark ? "bg-neutral-900" : "bg-gray-50"
        }`}
      >
        {/* Mobile Header */}
        <div
          className={`p-4 md:hidden flex items-center justify-between border-b transition-colors duration-300 relative z-20 ${
            isDark
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            onClick={() => setOpen(!isMobileOpen)}
            className={`flex items-center gap-2 rounded-md p-2 shadow-sm transition-colors cursor-pointer ${
              isDark
                ? "text-sky-400 bg-neutral-700 hover:bg-neutral-600"
                : "text-blue-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaBars className="text-xl" />
          </div>
          <span
            className={`text-xl font-bold cursor-pointer ${
              isDark ? "text-sky-400" : "text-blue-600"
            }`}
            onClick={() => {
              navigate("/");
              // Removed automatic sidebar closing - let users close it manually
            }}
          >
            Peak Productivity
          </span>
          <div>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 h-full overflow-y-auto p-4 md:p-6 transition-all duration-300 relative z-10 ${
            isDark ? "bg-neutral-900" : "bg-gray-50"
          } ${isMobileOpen ? (isDark ? "bg-neutral-900" : "bg-gray-50") : ""}`}
          onClick={() => {
            // Close sidebar when clicking on main content on mobile
            if (isMobileOpen) {
              setOpen(false);
            }
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
