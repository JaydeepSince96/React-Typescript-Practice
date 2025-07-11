import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoFilter, IoRefresh, IoCheckmarkCircle } from "react-icons/io5";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Define the shape of the filters
interface TaskFilters {
  searchId: string;
  priority: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface TaskFilterSidebarProps {
  initialFilters: TaskFilters;
  onApplyFilters: (filters: TaskFilters) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const TaskFilterSidebar: React.FC<TaskFilterSidebarProps> = ({
  initialFilters,
  onApplyFilters,
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(initialFilters);
  const { isDark } = useTheme();
  const { setOpen: setSidebarOpen } = useSidebar();

  useEffect(() => {
    if (isFilterOpen) {
      setLocalFilters(initialFilters);
      // Close the navigation sidebar when filter opens on mobile
      setSidebarOpen(false);
    }
  }, [initialFilters, isFilterOpen, setSidebarOpen]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      searchId: "",
      priority: "All",
      status: "All",
      startDate: null,
      endDate: null,
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters); // Apply cleared filters immediately
    setIsFilterOpen(false);
  };

  return (
    <Sheet open={isFilterOpen} onOpenChange={(open) => {
      setIsFilterOpen(open);
      if (open) {
        // Ensure navigation sidebar is closed when filter opens
        setSidebarOpen(false);
      }
    }}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "border transition-colors duration-200 w-full md:w-auto text-center flex items-center justify-center min-h-[40px] sm:min-h-[48px] md:min-h-auto m-0.5 sm:m-1 px-2 sm:px-4 py-2.5 sm:py-3 md:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base",
            isDark 
              ? "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white" 
              : "bg-white border-gray-200 hover:bg-gray-50 text-gray-800"
          )}
          onClick={() => {
            // Close navigation sidebar when opening filter
            setSidebarOpen(false);
          }}
        >
          <IoFilter className="mr-1 sm:mr-2 size-3 sm:size-4" />
          <span className="truncate">Filter Tasks</span>
        </Button>
      </SheetTrigger>
      <SheetContent className={cn(
        // Mobile-first responsive design
        "w-full sm:max-w-md overflow-y-auto",
        // Background and border styling
        isDark 
          ? "bg-neutral-800 border-l border-neutral-700 text-white" 
          : "bg-white border-l border-gray-200 text-gray-900"
      )} side="right">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className={cn(
            "text-xl sm:text-2xl font-semibold",
            isDark ? "text-sky-400" : "text-blue-600"
          )}>
            Filter Tasks
          </SheetTitle>
        </SheetHeader>
        {/* Main content with improved mobile scrolling */}
        <div className="flex-1 px-6 pb-6 space-y-6 overflow-y-auto">
          <div>
            <Label htmlFor="searchId" className={cn(
              isDark ? "text-neutral-300" : "text-gray-700"
            )}>
              Search by Task ID
            </Label>
            <p className={cn(
              "text-xs mt-1 mb-2",
              isDark ? "text-neutral-400" : "text-gray-500"
            )}>
              Enter full or partial Task ID (e.g., "686cf2" or full ID)
            </p>
            <Input
              id="searchId"
              placeholder="Enter Task ID..."
              value={localFilters.searchId}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, searchId: e.target.value }))
              }
              className={cn(
                isDark 
                  ? "bg-neutral-700 border-neutral-600" 
                  : "bg-white border-gray-200"
              )}
            />
          </div>

          <div>
            <Label htmlFor="priority" className={cn(
              isDark ? "text-neutral-300" : "text-gray-700"
            )}>
              Priority
            </Label>
            <Select
              value={localFilters.priority}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger
                id="priority"
                className={cn(
                  "w-full mt-2",
                  isDark 
                    ? "bg-neutral-700 border-neutral-600" 
                    : "bg-white border-gray-200"
                )}
              >
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent className={cn(
                isDark 
                  ? "bg-neutral-800 border-neutral-700 text-white" 
                  : "bg-white border-gray-200 text-gray-900"
              )}>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High Priority">High Priority</SelectItem>
                <SelectItem value="Medium Priority">Medium Priority</SelectItem>
                <SelectItem value="Low Priority">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className={cn(
              isDark ? "text-neutral-300" : "text-gray-700"
            )}>
              Status
            </Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger
                id="status"
                className={cn(
                  "w-full mt-2",
                  isDark 
                    ? "bg-neutral-700 border-neutral-600" 
                    : "bg-white border-gray-200"
                )}
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className={cn(
                isDark 
                  ? "bg-neutral-800 border-neutral-700 text-white" 
                  : "bg-white border-gray-200 text-gray-900"
              )}>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={cn(isDark ? "text-neutral-300" : "text-gray-700")}>
              Filter by Task Date Range
            </Label>
            <p className={cn(
              "text-xs mt-1 mb-3",
              isDark ? "text-neutral-400" : "text-gray-500"
            )}>
              Find tasks that overlap with this date range (based on task start and due dates)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={cn(
                  "text-xs font-medium",
                  isDark ? "text-neutral-400" : "text-gray-600"
                )}>
                  From Date
                </Label>
                <Input
                  type="date"
                  value={localFilters.startDate ? new Date(localFilters.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev, 
                    startDate: e.target.value ? new Date(e.target.value) : null
                  }))}
                  placeholder="From Date"
                  className={cn(
                    "mt-1",
                    isDark 
                      ? "bg-neutral-700 border-neutral-600 text-white focus:border-sky-500"
                      : "bg-white border-gray-200 text-gray-900 focus:border-blue-400"
                  )}
                />
              </div>
              <div>
                <Label className={cn(
                  "text-xs font-medium",
                  isDark ? "text-neutral-400" : "text-gray-600"
                )}>
                  To Date
                </Label>
                <Input
                  type="date"
                  value={localFilters.endDate ? new Date(localFilters.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev, 
                    endDate: e.target.value ? new Date(e.target.value) : null
                  }))}
                  placeholder="To Date"
                  min={localFilters.startDate ? new Date(localFilters.startDate).toISOString().split('T')[0] : ''}
                  className={cn(
                    "mt-1",
                    isDark 
                      ? "bg-neutral-700 border-neutral-600 text-white focus:border-sky-500"
                      : "bg-white border-gray-200 text-gray-900 focus:border-blue-400"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky footer with better mobile spacing */}
        <SheetFooter className={cn(
          "flex flex-col gap-3 p-6 pt-4 border-t mt-auto",
          isDark ? "border-neutral-700" : "border-gray-200"
        )}>
          <Button
            onClick={handleApply}
            className={cn(
              "w-full font-semibold py-3 transition-colors duration-200",
              isDark
                ? "bg-sky-600 hover:bg-sky-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
            )}
          >
            <IoCheckmarkCircle className="mr-2 size-5" />
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            className={cn(
              "w-full py-3 transition-colors duration-200",
              isDark
                ? "bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-white"
                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            )}
          >
            <IoRefresh className="mr-2 size-5" />
            Clear Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskFilterSidebar;