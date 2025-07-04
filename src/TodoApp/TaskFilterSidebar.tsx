import React from "react";
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
import DateRangePicker from "./common/CalanderPicker";
import { IoFilter } from "react-icons/io5";

// Define the shape of the filters
interface TaskFilters {
  searchId: string;
  priority: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface TaskFilterSidebarProps {
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const TaskFilterSidebar: React.FC<TaskFilterSidebarProps> = ({
  filters,
  setFilters,
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const handleClearFilters = () => {
    setFilters({
      searchId: "",
      priority: "All",
      status: "All",
      startDate: null,
      endDate: null,
    });
    setIsFilterOpen(false); // Close sidebar on clear
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
              value={filters.searchId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchId: e.target.value }))
              }
              className="bg-neutral-700 border-neutral-600 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="priority" className="text-neutral-300">
              Priority
            </Label>
            <Select
              value={filters.priority}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priority: value }))
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
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
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
            <div className="mt-2">
              <DateRangePicker
                startDate={filters.startDate}
                endDate={filters.endDate}
                onStartDateChange={(date) =>
                  setFilters((prev) => ({ ...prev, startDate: date }))
                }
                onEndDateChange={(date) =>
                  setFilters((prev) => ({ ...prev, endDate: date }))
                }
              />
            </div>
          </div>
        </div>
        <SheetFooter className="p-6">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="w-full bg-neutral-700 hover:bg-neutral-600 border-neutral-600"
          >
            Clear Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskFilterSidebar;