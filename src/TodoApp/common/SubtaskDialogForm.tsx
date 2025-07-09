import { memo, useCallback } from 'react';
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useSubtaskForm } from "@/hooks/useSubtaskForm";
import { useTheme } from "@/contexts/ThemeContext";
import type { ISubtask } from "@/api/types";

type SubtaskDialogFormProps = {
  taskId: string;
  subtask?: ISubtask; // Optional subtask for editing
  onSuccess?: () => void;
  onCancel?: () => void;
};

const SubtaskDialogForm = memo<SubtaskDialogFormProps>(({
  taskId,
  subtask,
  onSuccess,
  onCancel,
}) => {
  const { isDark } = useTheme();
  const {
    form,
    onSubmit,
    resetForm,
    isLoading,
    buttonText,
    title,
  } = useSubtaskForm({
    taskId,
    subtask,
    onSuccess,
    onError: (error) => {
      console.error('Subtask form submission error:', error);
      // You can add toast notifications here
    },
  });

  const handleCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [resetForm, onCancel]);

  return (
    <DialogContent className={`rounded-lg shadow-xl border ${
      isDark 
        ? 'bg-neutral-800 text-white border-neutral-700' 
        : 'bg-white text-gray-900 border-gray-200'
    }`}>
      <DialogHeader>
        <DialogTitle className={`text-2xl font-semibold ${
          isDark ? 'text-sky-400' : 'text-sky-600'
        }`}>
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
                <FormLabel className={`text-base ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  Subtask Description
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Draft the initial project proposal."
                    {...field} 
                    rows={5}
                    disabled={isLoading}
                    className={`border focus:border-sky-500 ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </FormControl>
                <FormMessage className={`text-sm ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`} />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={`text-base mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    Start Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      disabled={isLoading}
                      className={`border focus:border-sky-500 ${
                        isDark 
                          ? 'bg-neutral-700 border-neutral-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </FormControl>
                  <FormMessage className={`text-sm mt-1 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={`text-base mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    End Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      disabled={isLoading}
                      min={form.watch("startDate") ? new Date(form.watch("startDate")!).toISOString().split('T')[0] : undefined}
                      className={`border focus:border-sky-500 ${
                        isDark 
                          ? 'bg-neutral-700 border-neutral-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </FormControl>
                  <FormMessage className={`text-sm mt-1 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className={`border font-medium disabled:opacity-50 ${
                isDark 
                  ? 'bg-transparent border-neutral-600 text-white hover:bg-neutral-700 hover:text-white' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`font-semibold shadow-md disabled:opacity-50 ${
                isDark 
                  ? 'bg-sky-500 hover:bg-sky-600 text-white' 
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
});

// Display name for React DevTools
SubtaskDialogForm.displayName = 'SubtaskDialogForm';

export default SubtaskDialogForm;
