import React, { useState } from "react";
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

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
      navigate('/dashboard'); // Navigate back to task list after deletion
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
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
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
        <div className="p-6 text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent mx-auto mb-4"></div>
          Loading task...
        </div>
      </SidebarLayout>
    );
  }

  if (taskError || !task) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center text-white">
          <p className="text-red-400 mb-4">Failed to load task</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Go Back
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return null;
    }
  };

  return (
    <SidebarLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header - Mobile Responsive */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-neutral-300 hover:bg-neutral-800 hover:text-sky-400 shrink-0"
          >
            <IoArrowBack className="size-5" />
          </Button>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white truncate">
            Task: <span className="text-sky-400">{task._id}</span>
          </h1>
        </div>

        {/* Task Details Card - Mobile Responsive */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-amber-50 min-w-0 flex-1 leading-tight">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenTaskEditDialog}
                className="text-neutral-400 hover:text-amber-400 h-8 w-8 sm:h-10 sm:w-10"
              >
                <IoPencilOutline className="size-3 sm:size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenTaskDeleteDialog}
                className="text-neutral-400 hover:text-red-400 h-8 w-8 sm:h-10 sm:w-10"
              >
                <IoTrashOutline className="size-3 sm:size-4" />
              </Button>
            </div>
          </div>

          {/* TESTING: COMPLETE REPLACEMENT WITH OBVIOUS 2x3 GRID */}
          <div className="bg-yellow-400 p-4 rounded-lg mb-4">
            <h2 className="text-black font-bold text-xl mb-4 text-center">⚡ FORCED GRID TEST ⚡</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-500 text-white p-3 rounded text-center font-bold">
                STATUS: {task.completed ? "Completed" : "Pending"}
              </div>
              <div className="bg-blue-500 text-white p-3 rounded text-center font-bold">
                PRIORITY: {task.label}
              </div>
              <div className="bg-green-500 text-white p-3 rounded text-center font-bold">
                CREATED: {new Date(task.createdAt).toLocaleDateString()}
              </div>
              <div className="bg-purple-500 text-white p-3 rounded text-center font-bold">
                START: {new Date(task.startDate).toLocaleDateString()}
              </div>
              <div className="bg-orange-500 text-white p-3 rounded text-center font-bold">
                DUE: {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <div className="bg-pink-500 text-white p-3 rounded text-center font-bold">
                UPDATED: {new Date(task.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Subtasks Section - Mobile Responsive */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
          <div className="p-4 sm:p-6 border-b border-neutral-700">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-sky-400 mb-3">Subtasks</h3>
                {subtaskStats && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-neutral-400 bg-neutral-700/20 px-2 py-1 rounded">
                      <IoStatsChartOutline className="size-3 sm:size-4" />
                      <span>
                        {subtaskStats.completed}/{subtaskStats.total} completed
                      </span>
                    </div>
                    <div className="px-2 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-medium">
                      {Math.round(subtaskStats.completionRate)}% Complete
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={handleOpenAddDialog}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium shrink-0 h-9 px-3 sm:h-10 sm:px-4 self-start sm:self-center"
              >
                <IoAdd className="mr-1 sm:mr-2 size-4" />
                <span className="text-xs sm:text-sm">Add Subtask</span>
              </Button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {subtasksLoading ? (
              <div className="text-center py-8 sm:py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-sky-400/20 border-t-sky-400 mx-auto mb-3 sm:mb-4"></div>
                  <div className="absolute inset-0 rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-transparent border-t-sky-400/60 animate-ping mx-auto"></div>
                </div>
                <p className="text-neutral-400 font-medium text-sm sm:text-base">
                  Loading subtasks...
                </p>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                  Please wait while we fetch your subtasks
                </p>
              </div>
            ) : subtasks.length === 0 ? (
              <div className="text-center py-8 sm:py-16">
                <div className="bg-neutral-700/30 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <IoAdd className="text-2xl sm:text-4xl text-neutral-400" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-neutral-300 mb-2">
                  No subtasks yet
                </h4>
                <p className="text-neutral-400 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
                  Break down this task into smaller, manageable subtasks to
                  track your progress more effectively.
                </p>
                <Button
                  onClick={handleOpenAddDialog}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 sm:px-6 h-9 sm:h-10"
                >
                  <IoAdd className="mr-1 sm:mr-2 size-4" />
                  <span className="text-xs sm:text-sm">Create First Subtask</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {subtasks.map((subtask) => {
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
                      className="group bg-neutral-700/50 rounded-lg border border-neutral-600/50 transition-all duration-200 hover:bg-neutral-700/70 hover:border-neutral-500/70 hover:shadow-lg"
                    >
                      <div className="p-3 sm:p-5">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="mt-1 relative shrink-0">
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
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <h4
                                className={`text-sm sm:text-base font-medium leading-relaxed transition-all duration-200 min-w-0 flex-1 pr-2 ${
                                  subtask.completed
                                    ? "line-through text-neutral-500"
                                    : "text-neutral-200 group-hover:text-white"
                                }`}
                              >
                                {subtask.title}
                              </h4>
                              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenEditDialog(subtask)}
                                  className="text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10 h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200"
                                >
                                  <IoPencilOutline className="size-3 sm:size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenSubtaskDeleteDialog(subtask)}
                                  className="text-neutral-400 hover:text-red-400 hover:bg-red-400/10 h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200"
                                >
                                  <IoTrashOutline className="size-3 sm:size-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Date information - Mobile Responsive */}
                            {(subtask.startDate || subtask.endDate) && (
                              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm">
                                <div className="flex items-center gap-1 sm:gap-2 text-neutral-400 bg-neutral-600/20 px-2 py-1 rounded">
                                  <IoCalendarOutline className="size-3 sm:size-4 text-sky-400" />
                                  <span className="font-medium leading-tight">
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

                            {/* Status and metadata - Mobile Responsive with Better Spacing */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <span
                                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                    subtask.completed
                                      ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                                      : "bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30"
                                  }`}
                                >
                                  {subtask.completed ? "Completed" : "In Progress"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-xs text-neutral-500">
                                <span className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                  Created {formatDate(subtask.createdAt)}
                                </span>
                                {subtask.completed &&
                                  subtask.updatedAt !== subtask.createdAt && (
                                    <span className="flex items-center gap-1">
                                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
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
