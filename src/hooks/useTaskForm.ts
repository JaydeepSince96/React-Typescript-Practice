import { useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formSchema } from '@/schema/TodoFormSchema';
import { TaskLabel } from '@/api/types';
import type { ITask } from '@/api/types';
import { useCreateTask, useUpdateTask } from '@/hooks/useApiHooks';
import { formatDateForAPI, parseDateFromAPI } from '@/utils/dateUtils';

type FormData = z.infer<typeof formSchema>;

// Helper function to safely parse dates from backend format
const parseBackendDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;
  
  try {
    // Try parsing as backend format first (DD-MM-YY, HH:MM)
    if (dateString.includes('-') && dateString.includes(',')) {
      return parseDateFromAPI(dateString);
    }
    // Fallback to regular Date parsing
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

interface UseTaskFormOptions {
  editTask?: ITask | null;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useTaskForm(options: UseTaskFormOptions = {}) {
  const { editTask, onSuccess, onError } = options;
  
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  // Memoized default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => ({
    task: editTask?.title || "",
    startDate: parseBackendDate(editTask?.startDate),
    endDate: parseBackendDate(editTask?.dueDate),
    priority: editTask?.label || TaskLabel.LOW_PRIORITY,
  }), [editTask]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update form when editTask changes
  useEffect(() => {
    if (editTask) {
      form.reset({
        task: editTask.title || "",
        startDate: parseBackendDate(editTask.startDate),
        endDate: parseBackendDate(editTask.dueDate),
        priority: editTask.label || TaskLabel.LOW_PRIORITY,
      });
    } else {
      form.reset({
        task: "",
        startDate: null,
        endDate: null,
        priority: TaskLabel.LOW_PRIORITY,
      });
    }
  }, [editTask, form]);

  // Reset form when editTask changes
  const resetForm = useCallback(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  // Optimized submit handler
  const onSubmit = useCallback(async (data: FormData) => {
    try {
      if (editTask) {
        // Update existing task
        await updateTaskMutation.mutateAsync({
          id: editTask._id,
          payload: { 
            title: data.task,
            startDate: data.startDate ? formatDateForAPI(data.startDate) : undefined,
            dueDate: data.endDate ? formatDateForAPI(data.endDate) : undefined,
            label: data.priority,
          }
        });
      } else {
        // Create new task
        await createTaskMutation.mutateAsync({
          title: data.task,
          label: data.priority,
          startDate: data.startDate ? formatDateForAPI(data.startDate) : formatDateForAPI(new Date()),
          dueDate: data.endDate ? formatDateForAPI(data.endDate) : formatDateForAPI(new Date()),
        });
      }
      
      resetForm();
      onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An unknown error occurred');
      onError?.(err);
      console.error('Error submitting task:', err);
    }
  }, [editTask, updateTaskMutation, createTaskMutation, resetForm, onSuccess, onError]);

  // Form state getters
  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  const isDirty = form.formState.isDirty;

  // Button text computation
  const buttonText = useMemo(() => {
    if (isLoading) return editTask ? 'Updating...' : 'Creating...';
    return editTask ? 'Update Task' : 'Create Task';
  }, [isLoading, editTask]);

  // Title computation
  const title = useMemo(() => 
    `${editTask ? "Edit" : "Add"} Task`, 
    [editTask]
  );

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    resetForm,
    isLoading,
    hasErrors,
    isDirty,
    buttonText,
    title,
    isEditing: !!editTask,
  };
}
