import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useCreateSubtask, useUpdateSubtask } from "./useSubtaskHooks";
import type { ISubtask } from "@/api/types";

const subtaskFormSchema = z.object({
  task: z.string().min(1, "Subtask description is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type SubtaskFormData = z.infer<typeof subtaskFormSchema>;

interface UseSubtaskFormProps {
  taskId: string;
  subtask?: ISubtask; // Optional subtask for editing
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useSubtaskForm = ({ taskId, subtask, onSuccess, onError }: UseSubtaskFormProps) => {
  const createSubtaskMutation = useCreateSubtask();
  const updateSubtaskMutation = useUpdateSubtask();
  
  const isEditing = !!subtask;

  const form = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskFormSchema),
    defaultValues: {
      task: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (subtask) {
      form.reset({
        task: subtask.title,
        startDate: subtask.startDate ? new Date(subtask.startDate) : undefined,
        endDate: subtask.endDate ? new Date(subtask.endDate) : undefined,
      });
    } else {
      form.reset({
        task: "",
        startDate: undefined,
        endDate: undefined,
      });
    }
  }, [subtask, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (isEditing) {
        await updateSubtaskMutation.mutateAsync({
          subtaskId: subtask._id,
          payload: {
            title: data.task,
            startDate: data.startDate,
            endDate: data.endDate,
          }
        });
      } else {
        await createSubtaskMutation.mutateAsync({
          taskId,
          payload: {
            title: data.task,
            startDate: data.startDate,
            endDate: data.endDate,
          }
        });
      }
      
      resetForm();
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    }
  });

  const resetForm = () => {
    form.reset({
      task: "",
      startDate: undefined,
      endDate: undefined,
    });
  };

  const isLoading = createSubtaskMutation.isPending || updateSubtaskMutation.isPending;

  return {
    form,
    onSubmit,
    resetForm,
    isLoading,
    buttonText: isEditing ? "Update Subtask" : "Add Subtask",
    title: isEditing ? "Edit Subtask" : "Add New Subtask",
  };
};
