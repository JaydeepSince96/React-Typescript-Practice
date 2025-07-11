"use client";
import { type ReactNode, useState, useEffect } from "react";
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
  MdMenu,
  MdClose,
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
    case "Uncompleted Tasks":
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
  
  // State for collapsible "All Tasks" section with persistence
  const [isAllTasksExpanded, setIsAllTasksExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('allTasksExpanded');
      return saved === 'true';
    }
    return false;
  });

  // State for sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Persist state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('allTasksExpanded', isAllTasksExpanded.toString());
    }
  }, [isAllTasksExpanded]);

  const handleAllTasksClick = () => {
    const isHomePage = location.pathname === '/';
    
    if (isHomePage) {
      // If already on home page, just toggle expansion
      setIsAllTasksExpanded(!isAllTasksExpanded);
    } else {
      // If on another page, navigate to home and expand
      setIsAllTasksExpanded(true);
      navigate('/');
    }
    
    // Close mobile sidebar
    if (isMobileOpen) {
      setOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen min-w-screen text-white overflow-hidden relative transition-colors duration-300 ${
        isDark ? 'bg-neutral-900' : 'bg-gray-50'
      }`}>
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
          className={`border-r shadow-xl z-50 transition-all duration-300 ${
            isDark 
              ? 'bg-neutral-800 border-neutral-700' 
              : 'bg-white border-gray-200'
          } ${isCollapsed ? 'w-16' : 'w-64'}`}
        >
          <SidebarHeader className={`p-5 text-2xl font-extrabold overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isDark 
              ? 'bg-neutral-800 text-sky-400' 
              : 'bg-white text-blue-600'
          }`}>
            <div className="flex items-center justify-between">
              {!isCollapsed && (
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
              )}
              <div className="flex items-center gap-2">
                {!isCollapsed && (
                  <div className="ml-4">
                    <ThemeToggle />
                  </div>
                )}
                <button
                  onClick={toggleSidebar}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDark 
                      ? 'hover:bg-neutral-700 text-sky-400' 
                      : 'hover:bg-gray-100 text-blue-600'
                  }`}
                  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? <MdMenu className="size-5" /> : <MdClose className="size-5" />}
                </button>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className={`flex-grow py-4 transition-colors duration-300 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            {!isCollapsed ? (
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
                          ? 'text-neutral-300 hover:bg-neutral-700 hover:text-sky-400' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
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
              </div>
            ) : (
              // Collapsed state - show only icons
              <div className="flex flex-col gap-2 p-2 items-center">
                {/* All Tasks Icon */}
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    window.location.pathname === "/" && !window.location.search
                      ? isDark
                        ? "bg-neutral-700 text-sky-400"
                        : "bg-blue-50 text-blue-600"
                      : isDark 
                        ? 'text-neutral-300 hover:bg-neutral-700 hover:text-sky-400' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={handleAllTasksClick}
                  title="All Tasks"
                >
                  <MdOutlineTask className="size-5" />
                </div>

                {/* Reports & Settings Icons */}
                {SidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
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
                      if (isMobileOpen) {
                        setOpen(false);
                      }
                    }}
                    title={item.value}
                  >
                    {getSidebarIcon(item.label)}
                  </div>
                ))}
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className={`p-4 text-sm border-t transition-colors duration-300 ${
            isDark 
              ? 'bg-neutral-800 text-neutral-400 border-neutral-700' 
              : 'bg-white text-gray-500 border-gray-200'
          }`}>
            {!isCollapsed && "Copyright PK @2025"}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
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
