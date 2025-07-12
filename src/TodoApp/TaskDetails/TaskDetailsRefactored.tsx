import React from "react";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useTaskDetails } from "./hooks/useTaskDetails";
import { TaskDetailsHeader } from "./components/TaskDetailsHeader";
import { TaskInfoCard } from "./components/TaskInfoCard";
import { SubtasksSection } from "./components/SubtasksSection";
import { TaskDetailsDialogs } from "./components/TaskDetailsDialogs";
import type { ISubtask } from "@/api/types";

const TaskDetailsRefactored: React.FC = () => {
  const { isDark } = useTheme();
  const {
    // Data
    id,
    task,
    subtasks,
    subtaskStats,
    paginatedSubtasks,
    totalPages,
    currentPage,
    
    // Loading and error states
    taskLoading,
    taskError,
    subtasksLoading,
    
    // Dialog states
    dialogOpen,
    editingSubtask,
    taskEditDialogOpen,
    taskDeleteDialogOpen,
    subtaskDeleteDialogOpen,
    itemToDelete,
    
    // Mutations
    toggleSubtaskMutation,
    deleteSubtaskMutation,
    deleteTaskMutation,
    
    // Setters
    setDialogOpen,
    setEditingSubtask,
    setTaskEditDialogOpen,
    setTaskDeleteDialogOpen,
    setSubtaskDeleteDialogOpen,
    setItemToDelete,
    setCurrentPage,
    
    // Navigation
    navigate,
  } = useTaskDetails();

  // Handler functions
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
      const newTotalPages = Math.ceil(subtasks.length / 4);
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
      navigate("/dashboard"); // Navigate back to task list after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
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
        taskId: id,
      });
      setSubtaskDeleteDialogOpen(false);
      setItemToDelete(null);

      // Reset to first page if current page becomes empty after deletion
      const newTotalPages = Math.ceil((subtasks.length - 1) / 4);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("Error deleting subtask:", error);
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

  // Loading state
  if (taskLoading) {
    return (
      <SidebarLayout>
        <div
          className={`p-6 text-center ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <div className={`animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4 ${
            isDark 
              ? "border-gray-600 border-t-sky-400" 
              : "border-gray-200 border-t-sky-600"
          }`}></div>
          <p className={`text-lg font-medium ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Loading task...
          </p>
        </div>
      </SidebarLayout>
    );
  }

  // Error state
  if (taskError || !task) {
    return (
      <SidebarLayout>
        <div
          className={`p-6 text-center ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <p className="text-red-400 mb-4">Failed to load task</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Go Back
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 space-y-6">
        <TaskDetailsHeader
          taskId={task._id}
          onBack={() => navigate(-1)}
        />

        <TaskInfoCard
          task={task}
          onEdit={handleOpenTaskEditDialog}
          onDelete={handleOpenTaskDeleteDialog}
        />

        <SubtasksSection
          subtasks={subtasks}
          paginatedSubtasks={paginatedSubtasks}
          subtaskStats={subtaskStats}
          isLoading={subtasksLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          isToggling={toggleSubtaskMutation.isPending}
          onAddSubtask={handleOpenAddDialog}
          onEditSubtask={handleOpenEditDialog}
          onDeleteSubtask={handleOpenSubtaskDeleteDialog}
          onToggleSubtask={handleToggleSubtask}
          onPageChange={handlePageChange}
        />

        <TaskDetailsDialogs
          task={task}
          editingSubtask={editingSubtask}
          taskId={id!}
          dialogOpen={dialogOpen}
          taskEditDialogOpen={taskEditDialogOpen}
          taskDeleteDialogOpen={taskDeleteDialogOpen}
          subtaskDeleteDialogOpen={subtaskDeleteDialogOpen}
          itemToDelete={itemToDelete}
          deleteTaskMutationPending={deleteTaskMutation.isPending}
          deleteSubtaskMutationPending={deleteSubtaskMutation.isPending}
          onCloseDialog={handleCloseDialog}
          onCloseTaskEditDialog={handleCloseTaskEditDialog}
          onConfirmTaskDelete={handleConfirmTaskDelete}
          onConfirmSubtaskDelete={handleConfirmSubtaskDelete}
          onCancelTaskDelete={() => {
            setTaskDeleteDialogOpen(false);
            setItemToDelete(null);
          }}
          onCancelSubtaskDelete={() => {
            setSubtaskDeleteDialogOpen(false);
            setItemToDelete(null);
          }}
          setTaskDeleteDialogOpen={setTaskDeleteDialogOpen}
          setSubtaskDeleteDialogOpen={setSubtaskDeleteDialogOpen}
        />
      </div>
    </SidebarLayout>
  );
};

export default TaskDetailsRefactored;
