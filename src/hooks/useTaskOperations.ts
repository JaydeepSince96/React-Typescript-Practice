import { useCallback, useMemo } from 'react';
import {
  useGetAllTasks,
  useDeleteTask,
  useToggleTaskCompletion,
  useUpdateTaskLabel,
} from '@/hooks/useApiHooks';
import { TaskLabel } from '@/api/types';
import type { ITask } from '@/api/types';

interface UseTaskOperationsOptions {
  onSuccess?: (operation: string, task?: ITask) => void;
  onError?: (error: Error, operation: string) => void;
}

export function useTaskOperations(options: UseTaskOperationsOptions = {}) {
  const { onSuccess, onError } = options;
  
  const { data: allTasks = [], isLoading, error } = useGetAllTasks();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTaskCompletion();
  const updateLabelMutation = useUpdateTaskLabel();

  // Memoized handlers to prevent unnecessary re-renders
  const handleToggle = useCallback(async (taskId: string, currentCompleted: boolean) => {
    try {
      await toggleTaskMutation.mutateAsync({
        id: taskId,
        completed: !currentCompleted,
      });
      onSuccess?.('toggle');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to toggle task');
      onError?.(err, 'toggle');
      console.error('Error toggling task:', err);
    }
  }, [toggleTaskMutation, onSuccess, onError]);

  const handleSetPriority = useCallback(async (taskId: string, priority: TaskLabel) => {
    try {
      await updateLabelMutation.mutateAsync({
        id: taskId,
        label: priority,
      });
      onSuccess?.('priority');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update priority');
      onError?.(err, 'priority');
      console.error('Error updating task priority:', err);
    }
  }, [updateLabelMutation, onSuccess, onError]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await deleteTaskMutation.mutateAsync(id);
      onSuccess?.('delete');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to delete task');
      onError?.(err, 'delete');
      console.error('Error deleting task:', err);
    }
  }, [deleteTaskMutation, onSuccess, onError]);

  // Memoized computed values
  const taskStats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, pending, completionRate };
  }, [allTasks]);

  const tasksByPriority = useMemo(() => {
    return allTasks.reduce((acc, task) => {
      const priority = task.label;
      if (!acc[priority]) {
        acc[priority] = [];
      }
      acc[priority].push(task);
      return acc;
    }, {} as Record<TaskLabel, ITask[]>);
  }, [allTasks]);

  const isOperationLoading = 
    deleteTaskMutation.isPending || 
    toggleTaskMutation.isPending || 
    updateLabelMutation.isPending;

  return {
    // Data
    allTasks,
    taskStats,
    tasksByPriority,
    
    // States
    isLoading,
    error,
    isOperationLoading,
    
    // Operations
    handleToggle,
    handleSetPriority,
    handleDelete,
  };
}
