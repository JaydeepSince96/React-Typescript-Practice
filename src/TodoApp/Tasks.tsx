"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskDialogForm from "./common/TaskDialogForm";
import { priorityLabels } from "@/const/const";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { FaPlus } from "react-icons/fa";
import TaskFilterSidebar from "./TaskFilterSidebar";
import TaskList from "./TaskList";
import {
  useGetAllTasks,
  useDeleteTask,
} from "@/hooks/useApiHooks";
import { TaskLabel } from "@/api/types";
import type { ITask } from "@/api/types";
import withLoadingAndError from "@/hoc/withLoadingAndError";

function Tasks() {
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<ITask | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchId: "",
    priority: "All",
    status: "All",
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // API hooks
  const { data: allTasks = [] } = useGetAllTasks();
  const deleteTaskMutation = useDeleteTask();

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const { searchId, priority, status, startDate, endDate } = filters;
      
      // Search by ID - using task._id instead of task.id
      if (searchId && !task._id.includes(searchId)) return false;
      
      // Filter by priority - map API priority to display priority
      if (priority !== "All") {
        const priorityMap: { [key: string]: TaskLabel } = {
          "High Priority": TaskLabel.HIGH_PRIORITY,
          "Medium Priority": TaskLabel.MEDIUM_PRIORITY,
          "Low Priority": TaskLabel.LOW_PRIORITY,
        };
        if (task.label !== priorityMap[priority]) return false;
      }
      
      // Filter by status
      if (status !== "All") {
        if (status === "Done" && !task.completed) return false;
        if (status === "Pending" && task.completed) return false;
      }
      
      // Filter by date range (using createdAt from API)
      if (startDate && new Date(task.createdAt) < startDate) return false;
      if (endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);
        if (new Date(task.createdAt) > adjustedEndDate) return false;
      }
      
      return true;
    });
  }, [allTasks, filters]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = useMemo(() => {
    return filteredTasks.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredTasks, currentPage]);

  // Memoized priority button classes
  const getPriorityButtonClasses = useCallback((priorityValue: string) => {
    const baseClasses =
      "m-1 px-4 py-2 rounded-full font-semibold transition-colors duration-200";
    const colorMap: { [key: string]: string } = {
      "High Priority": "bg-red-700/40 text-red-300 hover:bg-red-600/60 border border-red-700",
      "Medium Priority": "bg-yellow-700/40 text-yellow-300 hover:bg-yellow-600/60 border border-yellow-700",
      "Low Priority": "bg-blue-500/40 text-blue-300 hover:bg-blue-500/60 border border-blue-500",
      "Priority": "bg-neutral-700 text-neutral-300 hover:bg-neutral-600 border border-neutral-600",
    };
    return `${baseClasses} ${
      colorMap[priorityValue] ||
      "bg-neutral-700 text-neutral-300 hover:bg-neutral-600 border border-neutral-600"
    }`;
  }, []);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [filters, totalPages, currentPage]);

  const handleEdit = useCallback((task: ITask) => {
    setEditTask(task);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [deleteTaskMutation]);

  const handleApplyFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setOpen(false);
    setEditTask(null);
  }, []);

  const handleFormCancel = useCallback(() => {
    setOpen(false);
    setEditTask(null);
  }, []);

  const handleAddNewTask = useCallback(() => {
    setOpen(true);
    setEditTask(null);
  }, []);

  const handlePriorityNavigation = useCallback((priorityLabel: string) => {
    navigate(`/priority?level=${encodeURIComponent(priorityLabel)}`);
  }, [navigate]);

  return (
    <SidebarLayout>
      <div className="p-6 bg-neutral-900 min-h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex flex-wrap">
            {priorityLabels.map((item) => (
              <button
                className={getPriorityButtonClasses(item.label)}
                key={item.value}
                onClick={() => handlePriorityNavigation(item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <TaskFilterSidebar
            initialFilters={filters}
            onApplyFilters={handleApplyFilters}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />
        </header>

        <main className="flex-1 flex flex-col p-4">
          <TaskList
            tasks={paginatedTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddNewTask}
              className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-40"
            >
              <FaPlus className="size-4" />
              Add New Task
            </Button>
          </DialogTrigger>
          <TaskDialogForm
            editTask={editTask}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Dialog>

        {totalPages > 1 && (
          <footer className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent className="bg-neutral-800 rounded-lg p-2 shadow-inner border border-neutral-700">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </footer>
        )}
      </div>
    </SidebarLayout>
  );
}

// Create the enhanced component with HOC
interface TasksProps {
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
}

const TasksWithLoadingAndError = withLoadingAndError<TasksProps>(Tasks, {
  showEmpty: true,
  defaultEmptyMessage: "No tasks found. Create your first task!",
});

export default function TasksContainer() {
  const { data: allTasks = [], isLoading, error } = useGetAllTasks();
  
  return (
    <TasksWithLoadingAndError
      isLoading={isLoading}
      error={error}
      isEmpty={allTasks.length === 0}
    />
  );
}
