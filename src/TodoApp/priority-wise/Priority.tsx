import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import TaskCard from "../common/TaskCard";
import { Dialog } from "@/components/ui/dialog";
import TaskDialogForm from "../common/TaskDialogForm";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { TbListSearch } from "react-icons/tb";

import {
  useGetAllTasks,
  useDeleteTask,
  useToggleTaskCompletion,
  useUpdateTaskLabel,
} from "@/hooks/useApiHooks";
import { TaskLabel } from "@/api/types";
import type { ITask } from "@/api/types";

const Priority = memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level") || "All";

  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<ITask | null>(null);

  // API hooks
  const { data: allTasks = [], isLoading, error } = useGetAllTasks();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTaskCompletion();
  const updateLabelMutation = useUpdateTaskLabel();

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    if (level === "All") return allTasks;
    
    // Map priority display names to API enum values
    const priorityMap: { [key: string]: TaskLabel } = {
      "High Priority": TaskLabel.HIGH_PRIORITY,
      "Medium Priority": TaskLabel.MEDIUM_PRIORITY,
      "Low Priority": TaskLabel.LOW_PRIORITY,
      "Priority": TaskLabel.PRIORITY,
    };
    
    const targetPriority = priorityMap[level];
    if (!targetPriority) return allTasks;
    
    return allTasks.filter(task => task.label === targetPriority);
  }, [allTasks, level]);

  // Optimized handlers with useCallback
  const handleToggle = useCallback(async (taskId: string, currentCompleted: boolean) => {
    try {
      await toggleTaskMutation.mutateAsync({
        id: taskId,
        completed: !currentCompleted,
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }, [toggleTaskMutation]);

  const handleSetPriority = useCallback(async (taskId: string, priority: TaskLabel) => {
    try {
      await updateLabelMutation.mutateAsync({
        id: taskId,
        label: priority,
      });
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  }, [updateLabelMutation]);

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

  const handleDialogSuccess = useCallback(() => {
    setOpen(false);
    setEditTask(null);
  }, []);

  const handleDialogCancel = useCallback(() => {
    setOpen(false);
    setEditTask(null);
  }, []);

  const handleBackNavigation = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-white">Loading tasks...</div>
        </div>
      </SidebarLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-lg">Error loading tasks: {error.message}</div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="flex-1 h-full w-full p-6 bg-neutral-900 overflow-y-auto">
        <div className="flex items-center mb-6">
          <Button
            variant={"ghost"}
            onClick={handleBackNavigation}
            className="flex items-center gap-2 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition-colors px-3 py-2 rounded-md"
          >
            <IoArrowBack className="text-xl" />
            <span className="text-lg">Back</span>
          </Button>
          <h2 className="text-3xl font-bold ml-4 text-white">
            Tasks with Priority:{" "}
            <span className="capitalize text-sky-400">{level}</span>
          </h2>
        </div>

        <div className="space-y-4 p-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <TbListSearch className="size-20 text-neutral-600 mb-4" />
              <p className="text-neutral-400 text-xl font-semibold">
                No tasks found with "{level}" priority.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={() => handleToggle(task._id, task.completed)}
                onSetPriority={(priority) => handleSetPriority(task._id, priority)}
                onEdit={() => handleEdit(task)}
                onDelete={() => handleDelete(task._id)}
              />
            ))
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <TaskDialogForm 
            editTask={editTask}
            onSuccess={handleDialogSuccess}
            onCancel={handleDialogCancel}
          />
        </Dialog>
      </div>
    </SidebarLayout>
  );
});

// Display name for React DevTools
Priority.displayName = 'Priority';

export default Priority;