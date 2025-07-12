"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskDialogForm from "./common/TaskDialogForm";
import { priorityLabels } from "@/const/const";
import { useNavigate, useLocation } from "react-router-dom";
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
  useGetFilteredTasks,
} from "@/hooks/useApiHooks";
import type { ITask } from "@/api/types";
import withLoadingAndError from "@/hoc/withLoadingAndError";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useTheme } from "@/contexts/ThemeContext";

function Tasks() {
  const { isDark } = useTheme();
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

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Handle route-based navigation (not URL parameters)
  const routeFilter = useMemo(() => {
    const path = location.pathname;
    if (path === '/completed') return 'completed';
    if (path === '/pending') return 'pending';
    if (path === '/overdue') return 'overdue';
    return null;
  }, [location.pathname]);

  // Handle URL parameters for manual filtering only (not sidebar navigation)
  useEffect(() => {
    // Only process URL parameters if we're on the main route ("/")
    if (location.pathname === '/') {
      const urlParams = new URLSearchParams(location.search);
      const filterParam = urlParams.get('filter');
      
      if (filterParam) {
        console.log('🔗 URL filter detected:', filterParam);
        setFilters(prev => ({
          ...prev,
          status: filterParam === 'completed' ? 'Completed' : 
                  filterParam === 'uncompleted' ? 'Pending' : // uncompleted maps to pending in API
                  filterParam === 'overdue' ? 'Overdue' :
                  'All'
        }));
      } else {
        // Reset status filter if no URL parameter
        setFilters(prev => ({
          ...prev,
          status: 'All'
        }));
      }
    } else {
      // For non-main routes, reset filters to default
      setFilters({
        searchId: "",
        priority: "All",
        status: "All",
        startDate: null,
        endDate: null,
      });
    }
  }, [location.search, location.pathname]);

  // Determine if we should use filtered API or all tasks API
  // Route-based filtering (from sidebar) should not show "filtered results" indicator
  const hasActiveFilters = !!(
    filters.searchId ||
    (filters.priority && filters.priority !== 'All') ||
    (location.pathname === '/' && filters.status && filters.status !== 'All') || // Only count manual status filters on main route
    filters.startDate ||
    filters.endDate
  );

  // Determine if we should use filtered API (includes both manual filters and route-based)
  const shouldUseFilteredAPI = !!(
    filters.searchId ||
    (filters.priority && filters.priority !== 'All') ||
    (filters.status && filters.status !== 'All') ||
    routeFilter || // Include route-based filtering for API calls
    filters.startDate ||
    filters.endDate
  );

  // Convert filters to API format
  const apiFilters = useMemo(() => {
    // Convert route filter to API format (capitalize first letter)
    const routeFilterForAPI = routeFilter ? 
      routeFilter.charAt(0).toUpperCase() + routeFilter.slice(1) : 
      undefined;
    
    const converted = {
      searchId: filters.searchId || undefined,
      priority: filters.priority !== 'All' ? filters.priority : undefined,
      status: routeFilterForAPI || (filters.status !== 'All' ? filters.status : undefined), // Use route filter or manual filter
      startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : undefined,
      endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : undefined,
      page: currentPage,
      limit: itemsPerPage,
    };
    
    // Debug logging
    console.log('🔍 Filter conversion:', {
      originalFilters: filters,
      routeFilter,
      routeFilterForAPI,
      convertedFilters: converted,
      hasActiveFilters,
      shouldUseFilteredAPI
    });
    
    return converted;
  }, [filters, currentPage, itemsPerPage, hasActiveFilters, routeFilter, shouldUseFilteredAPI]);

  // API hooks
  const { data: allTasks = [], isLoading: allTasksLoading, error: allTasksError } = useGetAllTasks();
  const { 
    data: filteredData, 
    isLoading: filteredLoading, 
    error: filteredError 
  } = useGetFilteredTasks(apiFilters);
  
  const deleteTaskMutation = useDeleteTask();

  // Determine which data to use
  const isLoading = shouldUseFilteredAPI ? filteredLoading : allTasksLoading;
  const error = shouldUseFilteredAPI ? filteredError : allTasksError;
  
  // Calculate tasks and pagination
  const { tasks, totalPages, totalCount } = useMemo(() => {
    console.log('📊 Data calculation:', {
      hasActiveFilters,
      shouldUseFilteredAPI,
      filteredData: filteredData ? {
        tasksCount: filteredData.tasks.length,
        totalCount: filteredData.pagination.totalCount,
        totalPages: filteredData.pagination.totalPages
      } : null,
      allTasksCount: allTasks.length,
      currentPage
    });

    if (shouldUseFilteredAPI && filteredData) {
      return {
        tasks: filteredData.tasks,
        totalPages: filteredData.pagination.totalPages,
        totalCount: filteredData.pagination.totalCount,
      };
    } else {
      // For unfiltered data, handle client-side pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedTasks = allTasks.slice(startIndex, endIndex);
      const totalPages = Math.ceil(allTasks.length / itemsPerPage);
      
      return {
        tasks: paginatedTasks,
        totalPages,
        totalCount: allTasks.length,
      };
    }
  }, [hasActiveFilters, shouldUseFilteredAPI, filteredData, allTasks, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Memoized priority button classes
  const getPriorityButtonClasses = useCallback((priorityValue: string) => {
    const baseClasses =
      "m-1 md:m-1 px-4 py-3 md:py-2 rounded-full font-semibold transition-colors duration-200 w-full md:w-auto text-center flex items-center justify-center min-h-[48px] md:min-h-auto";
    
    if (isDark) {
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
    } else {
      const colorMap: { [key: string]: string } = {
        "High Priority": "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300",
        "Medium Priority": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300",
        "Low Priority": "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300",
        "Priority": "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
      };
      return `${baseClasses} ${
        colorMap[priorityValue] ||
        "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
      }`;
    }
  }, [isDark]);

  const handleEdit = useCallback((task: ITask) => {
    setEditTask(task);
    setOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    // Find task from the current tasks array
    const task = tasks.find(t => t._id === id) || allTasks.find(t => t._id === id);
    if (task) {
      setTaskToDelete({ id: task._id, title: task.title });
      setDeleteDialogOpen(true);
    }
  }, [tasks, allTasks]);

  const handleConfirmDelete = useCallback(async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTaskMutation.mutateAsync(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [deleteTaskMutation, taskToDelete]);

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

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className={`p-6 text-center transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4 ${
            isDark ? 'border-sky-400' : 'border-blue-500'
          }`}></div>
          Loading tasks...
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className={`p-6 text-center transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          <p className={`mb-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>Failed to load tasks</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className={`min-h-full flex flex-col transition-colors duration-300 relative z-10 ${
        isDark ? 'bg-neutral-900' : 'bg-gray-50'
      }`}>
        <header className="mb-6">
          {/* Mobile Layout: 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {/* Row 1: High Priority, Medium Priority */}
            <button
              className={getPriorityButtonClasses("High Priority")}
              onClick={() => handlePriorityNavigation("High Priority")}
            >
              High Priority
            </button>
            <button
              className={getPriorityButtonClasses("Medium Priority")}
              onClick={() => handlePriorityNavigation("Medium Priority")}
            >
              Medium Priority
            </button>
            
            {/* Row 2: Filter Tasks, Low Priority */}
            <div className="w-full">
              <TaskFilterSidebar
                initialFilters={filters}
                onApplyFilters={handleApplyFilters}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
              />
            </div>
            <button
              className={getPriorityButtonClasses("Low Priority")}
              onClick={() => handlePriorityNavigation("Low Priority")}
            >
              Low Priority
            </button>
          </div>

          {/* Desktop Layout: Horizontal with Filter on Right */}
          <div className="hidden md:flex justify-between items-center flex-wrap gap-4">
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
          </div>
        </header>

        {/* Filter status indicator */}
        {hasActiveFilters && (
          <div className={`mb-4 p-3 rounded-lg border ${
            isDark 
              ? 'bg-sky-600/10 border-sky-600/30' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                isDark ? 'text-sky-400' : 'text-blue-700'
              }`}>
                Showing {totalCount} filtered result{totalCount !== 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  searchId: "",
                  priority: "All",
                  status: "All",
                  startDate: null,
                  endDate: null,
                })}
                className={
                  isDark 
                    ? "text-sky-400 hover:text-sky-300"
                    : "text-blue-600 hover:text-blue-700"
                }
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col">
          {tasks.length === 0 ? (
            <div className="text-center py-20">
              <div className={`rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 ${
                isDark ? 'bg-neutral-700/30' : 'bg-gray-100'
              }`}>
                <FaPlus className={`text-5xl ${
                  isDark ? 'text-neutral-400' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                isDark ? 'text-neutral-200' : 'text-gray-800'
              }`}>
                {routeFilter === 'completed' ? "No Completed Tasks" :
                 routeFilter === 'pending' ? "No Pending Tasks" :
                 routeFilter === 'overdue' ? "No Overdue Tasks" :
                 hasActiveFilters ? "No tasks match your filters" : "Welcome to TaskSync!"}
              </h3>
              <p className={`text-lg mb-8 max-w-md mx-auto ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>
                {routeFilter === 'completed' ? "You haven't completed any tasks yet. Keep working on your tasks to see them here!" :
                 routeFilter === 'pending' ? "Great! You don't have any pending tasks. All your tasks are either completed or scheduled for the future." :
                 routeFilter === 'overdue' ? "Excellent! You don't have any overdue tasks. Keep up the good work with staying on top of your deadlines!" :
                 hasActiveFilters 
                   ? "Try adjusting your filters or create a new task to get started."
                   : "You don't have any tasks yet. Create your first task to begin organizing your work and boosting your productivity!"
                }
              </p>
              {!hasActiveFilters && !routeFilter && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleAddNewTask}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                      isDark 
                        ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    <FaPlus className="inline mr-2" />
                    Create Your First Task
                  </button>
                  <div className={`text-sm ${
                    isDark ? 'text-neutral-500' : 'text-gray-500'
                  }`}>
                    or use the + button in the bottom right
                  </div>
                </div>
              )}
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
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
              <PaginationContent className={`rounded-lg p-2 shadow-inner border ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </footer>
        )}
      </div>
      
      {/* Task Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone and will also delete all associated subtasks."
        confirmLabel="Delete Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        isDestructive={true}
        isLoading={deleteTaskMutation.isPending}
        itemId={taskToDelete?.id}
        itemType="task"
      />
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
