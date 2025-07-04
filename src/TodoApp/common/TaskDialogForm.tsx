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
import { Button } from "@/components/ui/button";
import { formSchema } from "@/schema/TodoFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import SingleDatePicker from "./SingleDatePicker";

type TodoDialogFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isSubtask?: boolean;
  isEditing?: boolean;
};

const TaskDialogForm = ({
  onSubmit,
  form,
  isSubtask = false,
  isEditing = false,
}: TodoDialogFormProps) => {
  const title = `${isEditing ? "Edit" : "Add"} ${
    isSubtask ? "Subtask" : "Task"
  }`;
  const label = `${isSubtask ? "Subtask" : "Task"} Description`;
  const placeholder = isSubtask
    ? "e.g., Draft the initial project proposal."
    : "e.g. Do a meeting with Product Manager to discuss Q3 strategy and action items.";
  const buttonText = `${isEditing ? "Update" : "Add"} ${
    isSubtask ? "Subtask" : "Task"
  }`;

  return (
    <DialogContent className="bg-neutral-800 text-white rounded-lg shadow-xl border border-neutral-700">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold text-sky-400">
          {title}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-300 text-base">
                  {label}
                </FormLabel>
                <FormControl>
                  <Textarea placeholder={placeholder} {...field} rows={5} />
                </FormControl>
                <FormMessage className="text-red-400 text-sm" />
              </FormItem>
            )}
          />

          {!isSubtask && (
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
                      <SingleDatePicker
                        placeholderText="From Date"
                        selected={field.value}
                        onChange={field.onChange}
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
                      <SingleDatePicker
                        placeholderText="To Date"
                        selected={field.value}
                        onChange={field.onChange}
                        minDate={form.watch("startDate") || undefined}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>
          )}

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="bg-transparent border border-neutral-600 text-white hover:bg-neutral-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md"
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default TaskDialogForm;