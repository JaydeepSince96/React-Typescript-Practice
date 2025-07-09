import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubtask,
  getSubtasksByTaskId,
  getSubtaskById,
  updateSubtask,
  toggleSubtask,
  deleteSubtask,
  getSubtaskStats
} from '@/api/subtask/subtask-api';
import { taskAPI } from '@/api/task/task-api';
import type {
  ISubtask,
  ICreateSubtaskPayload,
  IUpdateSubtaskPayload,
  ITask
} from '@/api/types';

// Query keys
export const subtaskKeys = {
  all: ['subtasks'] as const,
  byTask: (taskId: string) => [...subtaskKeys.all, 'task', taskId] as const,
  byId: (subtaskId: string) => [...subtaskKeys.all, 'detail', subtaskId] as const,
  stats: (taskId: string) => [...subtaskKeys.all, 'stats', taskId] as const,
};

// Helper function to automatically manage main task completion based on subtasks
const autoManageTaskCompletion = async (taskId: string, queryClient: ReturnType<typeof useQueryClient>) => {
  try {
    // Get current subtask stats
    const subtaskStats = await getSubtaskStats(taskId);
    
    // Get current task data
    const allTasks = queryClient.getQueryData(['tasks']) as ITask[] | undefined;
    const currentTask = allTasks?.find((task: ITask) => task._id === taskId);
    
    if (!currentTask) return;
    
    const shouldBeCompleted = subtaskStats.total > 0 && subtaskStats.completed === subtaskStats.total;
    const shouldBeIncomplete = subtaskStats.total > 0 && subtaskStats.completed < subtaskStats.total;
    
    // Only update if the task completion status needs to change
    if (shouldBeCompleted && !currentTask.completed) {
      // Auto-complete the task
      console.log('🎯 Auto-completing task due to all subtasks completed');
      await taskAPI.toggleTaskCompletion(taskId, true);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } else if (shouldBeIncomplete && currentTask.completed) {
      // Auto-mark as incomplete due to incomplete subtasks
      console.log('🎯 Auto-marking task as incomplete due to incomplete subtasks');
      await taskAPI.toggleTaskCompletion(taskId, false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  } catch (error) {
    console.error('Error in auto task completion management:', error);
  }
};

// Get subtasks for a task
export const useSubtasks = (taskId: string) => {
  return useQuery({
    queryKey: subtaskKeys.byTask(taskId),
    queryFn: () => {
      console.log('📡 Fetching subtasks for task:', taskId);
      return getSubtasksByTaskId(taskId);
    },
    enabled: !!taskId,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnWindowFocus: true,
  });
};

// Get a specific subtask
export const useSubtask = (subtaskId: string) => {
  return useQuery({
    queryKey: subtaskKeys.byId(subtaskId),
    queryFn: () => getSubtaskById(subtaskId),
    enabled: !!subtaskId,
  });
};

// Get subtask statistics
export const useSubtaskStats = (taskId: string) => {
  return useQuery({
    queryKey: subtaskKeys.stats(taskId),
    queryFn: () => getSubtaskStats(taskId),
    enabled: !!taskId,
    staleTime: 60000, // 1 minute
  });
};

// Create subtask mutation
export const useCreateSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: ICreateSubtaskPayload }) =>
      createSubtask(taskId, payload),
    onSuccess: async (_, { taskId }) => {
      // Invalidate and refetch subtasks for this task
      queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) });
      queryClient.invalidateQueries({ queryKey: subtaskKeys.stats(taskId) });
      
      // Auto-manage task completion (mark as incomplete when new subtask is added)
      await autoManageTaskCompletion(taskId, queryClient);
    },
  });
};

// Update subtask mutation
export const useUpdateSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subtaskId, payload }: { subtaskId: string; payload: IUpdateSubtaskPayload }) =>
      updateSubtask(subtaskId, payload),
    onSuccess: (updatedSubtask) => {
      // Update the specific subtask in cache
      queryClient.setQueryData(
        subtaskKeys.byId(updatedSubtask._id),
        updatedSubtask
      );
      
      // Invalidate subtasks list for the task
      queryClient.invalidateQueries({ 
        queryKey: subtaskKeys.byTask(updatedSubtask.taskId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: subtaskKeys.stats(updatedSubtask.taskId) 
      });
    },
  });
};

// Toggle subtask mutation
export const useToggleSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ISubtask, Error, string, { previousSubtasks?: ISubtask[]; taskId?: string }>({
    mutationFn: (subtaskId: string) => {
      console.log('🔄 Calling toggleSubtask API for:', subtaskId);
      return toggleSubtask(subtaskId);
    },
    onMutate: async (subtaskId) => {
      console.log('🎯 onMutate: Starting optimistic update for:', subtaskId);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: subtaskKeys.all });
      
      // Find the subtask in all cached data to get its taskId
      let taskId: string | null = null;
      const queryCache = queryClient.getQueryCache();
      
      queryCache.getAll().forEach((query) => {
        if (query.queryKey[0] === 'subtasks' && query.queryKey[1] === 'task') {
          const data = query.state.data as ISubtask[] | undefined;
          if (data) {
            const subtask = data.find(s => s._id === subtaskId);
            if (subtask) {
              taskId = subtask.taskId;
            }
          }
        }
      });
      
      if (taskId) {
        console.log('🎯 onMutate: Found taskId:', taskId, 'for subtask:', subtaskId);
        
        // Optimistically update the subtasks list
        const previousSubtasks = queryClient.getQueryData(subtaskKeys.byTask(taskId)) as ISubtask[] | undefined;
        
        queryClient.setQueryData(
          subtaskKeys.byTask(taskId),
          (oldData: ISubtask[] | undefined) => {
            if (!oldData) return oldData;
            console.log('🎯 onMutate: Updating subtask in cache...');
            return oldData.map(subtask => 
              subtask._id === subtaskId 
                ? { ...subtask, completed: !subtask.completed, updatedAt: new Date().toISOString() }
                : subtask
            );
          }
        );
        
        return { previousSubtasks, taskId };
      }
      
      return {};
    },
    onSuccess: async (updatedSubtask, _, context) => {
      console.log('✅ Toggle mutation successful:', updatedSubtask);
      
      if (context?.taskId) {
        console.log('🔄 Updating cache with server response...');
        
        // Update with the actual server response
        queryClient.setQueryData(
          subtaskKeys.byTask(context.taskId),
          (oldData: ISubtask[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map(subtask => 
              subtask._id === updatedSubtask._id ? updatedSubtask : subtask
            );
          }
        );
        
        // Update stats
        queryClient.invalidateQueries({ 
          queryKey: subtaskKeys.stats(context.taskId) 
        });
        
        // Auto-manage task completion when subtask status changes
        await autoManageTaskCompletion(context.taskId, queryClient);
      }
    },
    onError: (error, _, context) => {
      console.error('❌ Failed to toggle subtask:', error);
      
      // Revert the optimistic update
      if (context?.previousSubtasks && context?.taskId) {
        console.log('🔄 Reverting optimistic update...');
        queryClient.setQueryData(
          subtaskKeys.byTask(context.taskId),
          context.previousSubtasks
        );
      }
    },
  });
};

// Delete subtask mutation
export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subtaskId }: { subtaskId: string; taskId: string }) => {
      return deleteSubtask(subtaskId);
    },
    onSuccess: async (_, { subtaskId, taskId }) => {
      // Remove the subtask from cache
      queryClient.removeQueries({ queryKey: subtaskKeys.byId(subtaskId) });
      
      // Invalidate subtasks list for the task
      queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) });
      queryClient.invalidateQueries({ queryKey: subtaskKeys.stats(taskId) });
      
      // Auto-manage task completion when subtask is deleted
      await autoManageTaskCompletion(taskId, queryClient);
    },
  });
};
