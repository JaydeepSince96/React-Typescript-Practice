import { useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formSchema } from '@/schema/TodoFormSchema';
import { TaskLabel } from '@/api/types';
import type { ITask } from '@/api/types';
import { useCreateTask, useUpdateTask } from '@/hooks/useApiHooks';
import { formatDateForAPI } from '@/utils/dateUtils';

type FormData = z.infer<typeof formSchema>;

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
    startDate: editTask?.startDate ? new Date(editTask.startDate) : null,
    endDate: editTask?.dueDate ? new Date(editTask.dueDate) : null,
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
        startDate: editTask.startDate ? new Date(editTask.startDate) : null,
        endDate: editTask.dueDate ? new Date(editTask.dueDate) : null,
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
