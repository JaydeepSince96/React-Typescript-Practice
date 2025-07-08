import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { SubtaskCheckbox } from "@/components/ui/subtask-checkbox";
import { useGetAllTasks, useDeleteTask } from "@/hooks/useApiHooks";
import {
  useSubtasks,
  useToggleSubtask,
  useDeleteSubtask,
  useSubtaskStats
} from "@/hooks/useSubtaskHooks";
import type { ISubtask } from "@/api/types";
import {
  IoArrowBack,
  IoTrashOutline,
  IoPencilOutline,
  IoAdd,
  IoStatsChartOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { Dialog } from "@/components/ui/dialog";
import SubtaskDialogForm from "./common/SubtaskDialogForm";
import TaskDialogForm from "./common/TaskDialogForm";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Fetch task and subtasks data
  const {
    data: allTasks,
    isLoading: taskLoading,
    error: taskError,
  } = useGetAllTasks();
  const task = allTasks?.find((t) => t._id === id);
  const { data: subtasks = [], isLoading: subtasksLoading } = useSubtasks(
    id || ""
  );
  const { data: subtaskStats } = useSubtaskStats(id || "");

  // Mutations
  const toggleSubtaskMutation = useToggleSubtask();
  const deleteSubtaskMutation = useDeleteSubtask();
  const deleteTaskMutation = useDeleteTask();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<ISubtask | undefined>(
    undefined
  );
  const [taskEditDialogOpen, setTaskEditDialogOpen] = useState(false);
  
  // Confirmation dialog states
  const [taskDeleteDialogOpen, setTaskDeleteDialogOpen] = useState(false);
  const [subtaskDeleteDialogOpen, setSubtaskDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate paginated subtasks
  const { paginatedSubtasks, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = subtasks.slice(startIndex, endIndex);
    const total = Math.ceil(subtasks.length / itemsPerPage);
    
    return {
      paginatedSubtasks: paginated,
      totalPages: total,
      totalCount: subtasks.length,
    };
  }, [subtasks, currentPage, itemsPerPage]);

  const handleOpenAddDialog = () => {
    setEditingSubtask(undefined);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (subtask: ISubtask) => {
    setEditingSubtask(subtask);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSubtask(undefined);
    
    // Reset to last page when adding a new subtask to see the latest addition
    setTimeout(() => {
      const newTotalPages = Math.ceil(subtasks.length / itemsPerPage);
      if (newTotalPages > 0 && !editingSubtask) {
        setCurrentPage(newTotalPages); // Go to last page to see new subtask
      }
    }, 100);
  };

  const handleOpenTaskEditDialog = () => {
    setTaskEditDialogOpen(true);
  };

  const handleCloseTaskEditDialog = () => {
    setTaskEditDialogOpen(false);
  };

  // Task deletion handlers
  const handleOpenTaskDeleteDialog = () => {
    if (task) {
      setItemToDelete({ id: task._id, title: task.title });
      setTaskDeleteDialogOpen(true);
    }
  };

  const handleConfirmTaskDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteTaskMutation.mutateAsync(itemToDelete.id);
      setTaskDeleteDialogOpen(false);
      setItemToDelete(null);
      navigate('/'); // Navigate back to task list after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Subtask deletion handlers
  const handleOpenSubtaskDeleteDialog = (subtask: ISubtask) => {
    setItemToDelete({ id: subtask._id, title: subtask.title });
    setSubtaskDeleteDialogOpen(true);
  };

  const handleConfirmSubtaskDelete = async () => {
    if (!itemToDelete || !id) return;
    
    try {
      await deleteSubtaskMutation.mutateAsync({ 
        subtaskId: itemToDelete.id, 
        taskId: id 
      });
      setSubtaskDeleteDialogOpen(false);
      setItemToDelete(null);
      
      // Reset to first page if current page becomes empty after deletion
      const newTotalPages = Math.ceil((subtasks.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    console.log("🔄 Starting toggle for subtask:", subtaskId);
    console.log("🔄 Current mutation state:", {
      isPending: toggleSubtaskMutation.isPending,
      isError: toggleSubtaskMutation.isError,
      error: toggleSubtaskMutation.error,
    });

    try {
      console.log("🚀 Calling toggleSubtaskMutation...");
      const result = await toggleSubtaskMutation.mutateAsync(subtaskId);
      console.log("✅ Toggle result:", result);
    } catch (error) {
      console.error("❌ Error toggling subtask:", error);
    }
  };

  if (taskLoading) {
    return (
      <SidebarLayout>
        <div className={`p-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent mx-auto mb-4"></div>
          Loading task...
        </div>
      </SidebarLayout>
    );
  }

  if (taskError || !task) {
    return (
      <SidebarLayout>
        <div className={`p-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <p className="text-red-400 mb-4">Failed to load task</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Back
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  const getPriorityClass = (priority: string | undefined) => {
    switch (priority) {
      case "high priority":
        return isDark 
          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
          : "bg-red-50 text-red-700 border border-red-200";
      case "medium priority":
        return isDark 
          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
          : "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "low priority":
        return isDark 
          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
          : "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return isDark 
          ? "bg-neutral-500/20 text-neutral-300 border border-neutral-500/30" 
          : "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      return formatDateForDisplay(dateString);
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return null;
    }
  };

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className={`${
              isDark 
                ? 'text-neutral-300 hover:bg-neutral-800 hover:text-sky-400' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-sky-600'
            }`}
          >
            <IoArrowBack className="size-5" />
          </Button>
          <h1 className={`text-2xl md:text-3xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Task: <span className="text-sky-400">#{task._id.slice(-6)}</span>
          </h1>
        </div>

        <div className={`${
          isDark 
            ? 'bg-neutral-800 border-neutral-700' 
            : 'bg-white border-gray-200'
        } border rounded-lg p-6 shadow-lg transition-colors`}>
          <div className="flex items-start justify-between mb-4">
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-amber-50' : 'text-gray-900'
            }`}>
              {task.title}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenTaskEditDialog}
                className={`${
                  isDark 
                    ? 'text-neutral-400 hover:text-amber-400' 
                    : 'text-gray-500 hover:text-amber-500'
                }`}
              >
                <IoPencilOutline className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenTaskDeleteDialog}
                className={`${
                  isDark 
                    ? 'text-neutral-400 hover:text-red-400' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <IoTrashOutline className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>Status:</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${ 
                  task.completed
                    ? isDark 
                      ? "bg-green-600/20 text-green-400" 
                      : "bg-green-50 text-green-700 border border-green-200"
                    : isDark 
                      ? "bg-orange-600/20 text-orange-400" 
                      : "bg-orange-50 text-orange-700 border border-orange-200"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`font-bold ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>Priority:</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(
                  task.label
                )}`}
              >
                {task.label
                  .charAt(0)
                  .toUpperCase() +
                  task.label.slice(1).replace(" priority", " Priority")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`font-bold ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>Created:</span>
              <span className={isDark ? 'text-neutral-300' : 'text-gray-700'}>
                {formatDateForDisplay(task.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <IoCalendarOutline className={isDark ? 'text-neutral-400' : 'text-gray-500'} />
              <span className={`font-bold ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>Start:</span>
              <span className={isDark ? 'text-neutral-300' : 'text-gray-700'}>
                {formatDateForDisplay(task.startDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <IoCalendarOutline className={isDark ? 'text-neutral-400' : 'text-gray-500'} />
              <span className={`font-bold ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>Due:</span>
              <span className={isDark ? 'text-neutral-300' : 'text-gray-700'}>
                {formatDateForDisplay(task.dueDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`font-bold ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>Updated:</span>
              <span className={isDark ? 'text-neutral-300' : 'text-gray-700'}>
                {formatDateForDisplay(task.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className={`${
          isDark 
            ? 'bg-neutral-800 border border-neutral-700' 
            : 'bg-white border border-gray-200'
        } rounded-lg shadow-lg transition-colors`}>
          <div className={`p-6 ${
            isDark ? 'border-b border-neutral-700' : 'border-b border-gray-200'
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className={`text-xl font-semibold ${
                  isDark ? 'text-sky-400' : 'text-sky-600'
                }`}>Subtasks</h3>
                {subtaskStats && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className={`flex items-center gap-2 ${
                      isDark ? 'text-neutral-400' : 'text-gray-500'
                    }`}>
                      <IoStatsChartOutline />
                      <span>
                        {subtaskStats.completed}/{subtaskStats.total} completed
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDark 
                        ? 'bg-sky-500/20 text-sky-400' 
                        : 'bg-sky-50 text-sky-600 border border-sky-200'
                    }`}>
                      {Math.round(subtaskStats.completionRate)}% Complete
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={handleOpenAddDialog}
                className={`font-medium ${
                  isDark 
                    ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                <IoAdd className="mr-2 size-4" />
                Add Subtask
              </Button>
            </div>
          </div>

          <div className="p-6">
            {subtasksLoading ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className={`animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4 ${
                    isDark 
                      ? 'border-sky-400/20 border-t-sky-400' 
                      : 'border-sky-200 border-t-sky-600'
                  }`}></div>
                  <div className={`absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent animate-ping mx-auto ${
                    isDark ? 'border-t-sky-400/60' : 'border-t-sky-600/60'
                  }`}></div>
                </div>
                <p className={`font-medium ${
                  isDark ? 'text-neutral-400' : 'text-gray-600'
                }`}>
                  Loading subtasks...
                </p>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-neutral-500' : 'text-gray-500'
                }`}>
                  Please wait while we fetch your subtasks
                </p>
              </div>
            ) : subtasks.length === 0 ? (
              <div className="text-center py-16">
                <div className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ${
                  isDark ? 'bg-neutral-700/30' : 'bg-gray-100'
                }`}>
                  <IoAdd className={`text-4xl ${
                    isDark ? 'text-neutral-400' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className={`text-xl font-semibold mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-800'
                }`}>
                  No subtasks yet
                </h4>
                <p className={`mb-6 max-w-md mx-auto ${
                  isDark ? 'text-neutral-400' : 'text-gray-600'
                }`}>
                  Break down this task into smaller, manageable subtasks to
                  track your progress more effectively.
                </p>
                <Button
                  onClick={handleOpenAddDialog}
                  className={`font-medium px-6 ${
                    isDark 
                      ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  <IoAdd className="mr-2 size-4" />
                  Create First Subtask
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedSubtasks.map((subtask) => {
                  // Debug: Log subtask data to console
                  console.log("Rendering subtask:", {
                    id: subtask._id,
                    title: subtask.title,
                    completed: subtask.completed,
                    startDate: subtask.startDate,
                    endDate: subtask.endDate,
                  });

                  return (
                    <div
                      key={`${subtask._id}-${subtask.completed}-${subtask.updatedAt}`}
                      className={`group rounded-lg border transition-all duration-200 hover:shadow-lg ${
                        isDark 
                          ? 'bg-neutral-700/50 border-neutral-600/50 hover:bg-neutral-700/70 hover:border-neutral-500/70' 
                          : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 relative">
                            <SubtaskCheckbox
                              checked={subtask.completed}
                              onCheckedChange={(newChecked) => {
                                console.log(
                                  `🎯 TaskDetails: Checkbox change for ${subtask._id}: ${subtask.completed} -> ${newChecked}`
                                );
                                handleToggleSubtask(subtask._id);
                              }}
                              disabled={toggleSubtaskMutation.isPending}
                              subtaskId={subtask._id}
                            />
                            {toggleSubtaskMutation.isPending && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            )}
                          </div>

                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4
                                className={`text-base font-medium leading-relaxed transition-all duration-200 ${
                                  subtask.completed
                                    ? isDark 
                                      ? "line-through text-neutral-500" 
                                      : "line-through text-gray-500"
                                    : isDark 
                                      ? "text-neutral-200 group-hover:text-white" 
                                      : "text-gray-800 group-hover:text-gray-900"
                                }`}
                              >
                                {subtask.title}
                              </h4>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenEditDialog(subtask)}
                                  className={`h-8 w-8 transition-all duration-200 ${
                                    isDark 
                                      ? 'text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10' 
                                      : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
                                  }`}
                                >
                                  <IoPencilOutline className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenSubtaskDeleteDialog(subtask)}
                                  className={`h-8 w-8 transition-all duration-200 ${
                                    isDark 
                                      ? 'text-neutral-400 hover:text-red-400 hover:bg-red-400/10' 
                                      : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                                  }`}
                                >
                                  <IoTrashOutline className="size-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Date information */}
                            {(subtask.startDate || subtask.endDate) && (
                              <div className="flex items-center gap-4 mb-3 text-sm">
                                <div className={`flex items-center gap-2 ${
                                  isDark ? 'text-neutral-400' : 'text-gray-500'
                                }`}>
                                  <IoCalendarOutline className={`size-4 ${
                                    isDark ? 'text-sky-400' : 'text-sky-600'
                                  }`} />
                                  <span className="font-medium">
                                    {subtask.startDate && subtask.endDate
                                      ? `${formatDate(
                                          subtask.startDate
                                        )} - ${formatDate(subtask.endDate)}`
                                      : subtask.startDate
                                      ? `Start: ${formatDate(subtask.startDate)}`
                                      : subtask.endDate
                                      ? `Due: ${formatDate(subtask.endDate)}`
                                      : null}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Status and metadata */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                    subtask.completed
                                      ? isDark 
                                        ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30" 
                                        : "bg-green-50 text-green-700 ring-1 ring-green-200"
                                      : isDark 
                                        ? "bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30" 
                                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                  }`}
                                >
                                  {subtask.completed ? "Completed" : "In Progress"}
                                </span>
                              </div>
                              <div className={`flex items-center gap-4 text-xs ${
                                isDark ? 'text-neutral-500' : 'text-gray-500'
                              }`}>
                                <span className="flex items-center gap-1">
                                  <span className={`w-1 h-1 rounded-full ${
                                    isDark ? 'bg-neutral-500' : 'bg-gray-400'
                                  }`}></span>
                                  Created {formatDate(subtask.createdAt)}
                                </span>
                                {subtask.completed &&
                                  subtask.updatedAt !== subtask.createdAt && (
                                    <span className="flex items-center gap-1">
                                      <span className={`w-1 h-1 rounded-full ${
                                        isDark ? 'bg-green-500' : 'bg-green-600'
                                      }`}></span>
                                      Completed {formatDate(subtask.updatedAt)}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtask Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <SubtaskDialogForm
          taskId={id!}
          subtask={editingSubtask}
          onSuccess={handleCloseDialog}
          onCancel={handleCloseDialog}
        />
      </Dialog>

      {/* Task Edit Dialog */}
      <Dialog open={taskEditDialogOpen} onOpenChange={handleCloseTaskEditDialog}>
        <TaskDialogForm
          editTask={task}
          onSuccess={handleCloseTaskEditDialog}
          onCancel={handleCloseTaskEditDialog}
        />
      </Dialog>

      {/* Task Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={taskDeleteDialogOpen}
        onOpenChange={setTaskDeleteDialogOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone and will also delete all associated subtasks."
        confirmLabel="Delete Task"
        onConfirm={handleConfirmTaskDelete}
        onCancel={() => {
          setTaskDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        isDestructive={true}
        isLoading={deleteTaskMutation.isPending}
        itemId={itemToDelete?.id}
        itemType="task"
      />

      {/* Subtask Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={subtaskDeleteDialogOpen}
        onOpenChange={setSubtaskDeleteDialogOpen}
        title="Delete Subtask"
        description="Are you sure you want to delete this subtask? This action cannot be undone."
        confirmLabel="Delete Subtask"
        onConfirm={handleConfirmSubtaskDelete}
        onCancel={() => {
          setSubtaskDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        isDestructive={true}
        isLoading={deleteSubtaskMutation.isPending}
        itemId={itemToDelete?.id}
        itemType="subtask"
      />
    </SidebarLayout>
  );
};

export default TaskDetails;
