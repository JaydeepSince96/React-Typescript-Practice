import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSubtask } from "./useSubtaskHooks";

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
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useSubtaskForm = ({ taskId, onSuccess, onError }: UseSubtaskFormProps) => {
  const createSubtaskMutation = useCreateSubtask();

  const form = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskFormSchema),
    defaultValues: {
      task: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createSubtaskMutation.mutateAsync({
        taskId,
        payload: {
          title: data.task,
          startDate: data.startDate,
          endDate: data.endDate,
        }
      });
      
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

  return {
    form,
    onSubmit,
    resetForm,
    isLoading: createSubtaskMutation.isPending,
    buttonText: "Add Subtask",
    title: "Add New Subtask",
  };
};
