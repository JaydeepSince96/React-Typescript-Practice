import { memo, useCallback } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { priorityLabels } from "@/const/const";
import { useTaskForm } from "@/hooks/useTaskForm";
import type { ITask } from "@/api/types";

type TaskDialogFormProps = {
  editTask?: ITask | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isSubtask?: boolean;
};

const TaskDialogForm = memo<TaskDialogFormProps>(
  ({ editTask, onSuccess, onCancel, isSubtask = false }) => {
    const { form, onSubmit, resetForm, isLoading, buttonText, title } =
      useTaskForm({
        editTask,
        onSuccess,
        onError: (error) => {
          console.error("Form submission error:", error);
          // You can add toast notifications here
        },
      });

    const handleCancel = useCallback(() => {
      resetForm();
      onCancel?.();
    }, [resetForm, onCancel]);

    const label = `${isSubtask ? "Subtask" : "Task"} Description`;
    const placeholder = isSubtask
      ? "e.g., Draft the initial project proposal."
      : "e.g. Do a meeting with Product Manager to discuss Q3 strategy and action items.";

    return (
      <DialogContent className="bg-neutral-800 text-white rounded-lg shadow-xl border border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-sky-400">
            {title}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6 p-4">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300 text-base">
                    {label}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      {...field}
                      rows={5}
                      disabled={isLoading}
                      className="bg-neutral-700 border-neutral-600 text-white focus:border-sky-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            {!isSubtask && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-neutral-300 text-base mb-2">
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? new Date(e.target.value) : null
                              )
                            }
                            disabled={isLoading}
                            className="bg-neutral-700 border-neutral-600 text-white focus:border-sky-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-neutral-300 text-base mb-2">
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? new Date(e.target.value) : null
                              )
                            }
                            disabled={isLoading}
                            min={
                              form.watch("startDate")
                                ? new Date(form.watch("startDate")!)
                                    .toISOString()
                                    .split("T")[0]
                                : undefined
                            }
                            className="bg-neutral-700 border-neutral-600 text-white focus:border-sky-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-300 text-base">
                        Priority
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white focus:border-sky-500">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
                          {priorityLabels.map((label) => (
                            <SelectItem
                              key={label.value}
                              value={label.value}
                              className="hover:bg-neutral-600 focus:bg-neutral-600 focus:text-white"
                            >
                              {label.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-transparent border border-neutral-600 text-white hover:bg-neutral-700 hover:text-white disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md disabled:opacity-50"
              >
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    );
  }
);

// Display name for React DevTools
TaskDialogForm.displayName = "TaskDialogForm";

export default TaskDialogForm;
