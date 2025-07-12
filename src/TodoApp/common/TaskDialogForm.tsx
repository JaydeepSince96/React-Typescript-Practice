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
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

type TaskDialogFormProps = {
  editTask?: ITask | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isSubtask?: boolean;
};

const TaskDialogForm = memo<TaskDialogFormProps>(
  ({ editTask, onSuccess, onCancel, isSubtask = false }) => {
    const { isDark } = useTheme();
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
      <DialogContent className={cn(
        "rounded-lg shadow-xl border max-h-[90vh] overflow-y-auto",
        "w-full max-w-[95vw] sm:max-w-lg", // Better mobile width
        isDark 
          ? "bg-neutral-800 text-white border-neutral-700" 
          : "bg-white text-gray-900 border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "text-xl sm:text-2xl font-semibold pr-8", // Add right padding for close button
            isDark ? "text-sky-400" : "text-blue-600"
          )}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(
                    "text-base",
                    isDark ? "text-neutral-300" : "text-gray-700"
                  )}>
                    {label}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      {...field}
                      rows={5}
                      disabled={isLoading}
                      className={cn(
                        isDark 
                          ? "bg-neutral-700 border-neutral-600 text-white focus:border-sky-500" 
                          : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
                      )}
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
                        <FormLabel className={cn(
                          "text-base mb-2",
                          isDark ? "text-neutral-300" : "text-gray-700"
                        )}>
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
                            className={cn(
                              isDark 
                                ? "bg-neutral-700 border-neutral-600 text-white focus:border-sky-500" 
                                : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
                            )}
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
                        <FormLabel className={cn(
                          "text-base mb-2",
                          isDark ? "text-neutral-300" : "text-gray-700"
                        )}>
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
                            className={cn(
                              isDark 
                                ? "bg-neutral-700 border-neutral-600 text-white focus:border-sky-500" 
                                : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
                            )}
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
                      <FormLabel className={cn(
                        "text-base",
                        isDark ? "text-neutral-300" : "text-gray-700"
                      )}>
                        Priority
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className={cn(
                            isDark 
                              ? "bg-neutral-700 border-neutral-600 text-white focus:border-sky-500" 
                              : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
                          )}>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={cn(
                          isDark 
                            ? "bg-neutral-700 border-neutral-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}>
                          {priorityLabels.map((label) => (
                            <SelectItem
                              key={label.value}
                              value={label.value}
                              className={cn(
                                isDark 
                                  ? "hover:bg-neutral-600 focus:bg-neutral-600 focus:text-white" 
                                  : "hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
                              )}
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

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className={cn(
                  "w-full sm:w-auto order-2 sm:order-1 disabled:opacity-50", // Full width on mobile
                  isDark 
                    ? "bg-transparent border border-neutral-600 text-white hover:bg-neutral-700 hover:text-white" 
                    : "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full sm:w-auto order-1 sm:order-2 font-semibold shadow-md disabled:opacity-50", // Full width on mobile
                  isDark 
                    ? "bg-sky-500 hover:bg-sky-600 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                {isLoading ? "Saving..." : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    );
  }
);

TaskDialogForm.displayName = "TaskDialogForm";

export default TaskDialogForm;
