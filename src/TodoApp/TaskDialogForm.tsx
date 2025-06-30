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

import { z } from "zod";
// import { Input } from "@/components/ui/input"; // No longer needed for task input
import { Button } from "@/components/ui/button";
import { formSchema } from "@/schema/TodoFormSchema";
import type { UseFormReturn } from "react-hook-form";

// If you have a custom textarea component in components/ui, import it here.
// For now, we'll use a direct <textarea> HTML element.
// Example: import { Textarea } from "@/components/ui/textarea";

type TodoDialogFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
};

const TaskDialogForm = ({ onSubmit, form }: TodoDialogFormProps) => {
  return (
    <div>
      <DialogContent className="bg-neutral-800 text-white rounded-lg shadow-xl border border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-sky-400">
            {form.getValues("task") ? "Edit Task" : "Add a New Task"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300 text-base">Task Description</FormLabel> {/* Updated label */}
                  <FormControl>
                    {/* Replaced Input with textarea */}
                    <textarea
                      placeholder="e.g. Do a meeting with Product Manager to discuss Q3 strategy and action items."
                      {...field}
                      rows={5} // Set default number of rows for the textarea
                      className="flex min-h-[80px] w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder:text-neutral-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y" // Tailwind classes for textarea styling
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(); // Reset form fields
                  // If you have a custom state for dialog, reset them here too if needed
                }}
                className="bg-transparent border border-neutral-600 text-white hover:bg-neutral-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md"
              >
                {form.getValues("task") ? "Update" : "Add Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </div>
  );
};

export default TaskDialogForm;