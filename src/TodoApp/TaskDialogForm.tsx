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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/schema/TodoFormSchema";
import type { UseFormReturn } from "react-hook-form";

type TodoDialogFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
};

const TodoDialogForm = ({ onSubmit, form }: TodoDialogFormProps) => {
  return (
    <div>
      <DialogContent className="bg-neutral-800 text-white rounded-lg shadow-xl border border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-amber-50">
            {form.getValues("task") ? "Edit Task" : "Add a New Task"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4"
          >
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300 text-base">
                    Task
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Do a meeting with Product Manager"
                      {...field}
                      className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-500 focus:border-sky-500 focus-visible:ring-sky-500"
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
                onClick={() => form.reset()} // Assuming a way to close or cancel the dialog
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

export default TodoDialogForm;
