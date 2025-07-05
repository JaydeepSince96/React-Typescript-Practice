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
import SingleDatePicker from "./common/SingleDatePicker";
import { IoFilter, IoRefresh, IoCheckmarkCircle } from "react-icons/io5";

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

  useEffect(() => {
    if (isFilterOpen) {
      setLocalFilters(initialFilters);
    }
  }, [initialFilters, isFilterOpen]);

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
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
        >
          <IoFilter className="mr-2 size-4" />
          Filter Tasks
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-neutral-800 border-l border-neutral-700 text-white w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="p-6">
          <SheetTitle className="text-sky-400 text-2xl">
            Filter Tasks
          </SheetTitle>
        </SheetHeader>
        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="searchId" className="text-neutral-300">
              Search by Task ID
            </Label>
            <Input
              id="searchId"
              placeholder="Enter Task ID..."
              value={localFilters.searchId}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, searchId: e.target.value }))
              }
              className="bg-neutral-700 border-neutral-600 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="priority" className="text-neutral-300">
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
                className="w-full mt-2 bg-neutral-700 border-neutral-600"
              >
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="text-neutral-300">
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
                className="w-full mt-2 bg-neutral-700 border-neutral-600"
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-neutral-300">Filter by Creation Date</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <SingleDatePicker
                selected={localFilters.startDate}
                onChange={(date) => setLocalFilters(prev => ({...prev, startDate: date}))}
                placeholderText="From Date"
              />
              <SingleDatePicker
                selected={localFilters.endDate}
                onChange={(date) => setLocalFilters(prev => ({...prev, endDate: date}))}
                placeholderText="To Date"
                minDate={localFilters.startDate || undefined}
              />
            </div>
          </div>
        </div>
        <SheetFooter className="flex flex-col gap-3 p-6 pt-4 border-t border-neutral-700">
          <Button
            onClick={handleApply}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3"
          >
            <IoCheckmarkCircle className="mr-2 size-5" />
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full bg-neutral-700 hover:bg-neutral-600 border-neutral-600 py-3"
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