import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI, statsAPI } from '../api';
import type { ICreateTaskPayload, IUpdateTaskPayload, TaskLabel } from '../api/types';

// Query keys
export const QUERY_KEYS = {
  TASKS: ['tasks'],
  TASK_STATS: ['task-stats'],
  LABEL_OPTIONS: ['label-options'],
} as const;

// Task hooks
export const useGetAllTasks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: taskAPI.getAllTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetLabelOptions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.LABEL_OPTIONS,
    queryFn: taskAPI.getLabelOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes (labels don't change often)
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ICreateTaskPayload) => taskAPI.createTask(payload),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_STATS });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateTaskPayload }) => 
      taskAPI.updateTask(id, payload),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_STATS });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => taskAPI.deleteTask(id),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_STATS });
    },
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      taskAPI.toggleTaskCompletion(id, completed),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_STATS });
    },
  });
};

export const useUpdateTaskLabel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, label }: { id: string; label: TaskLabel }) => 
      taskAPI.updateTaskLabel(id, label),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_STATS });
    },
  });
};

export const useUpdateTaskDueDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dueDate }: { id: string; dueDate: string }) => 
      taskAPI.updateTaskDueDate(id, dueDate),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_STATS });
    },
  });
};

// Stats hooks
export const useGetTaskStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TASK_STATS,
    queryFn: statsAPI.getTaskStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTestStatsEndpoint = () => {
  return useQuery({
    queryKey: ['test-stats'],
    queryFn: statsAPI.testStatsEndpoint,
    enabled: false, // Only run manually
  });
};
