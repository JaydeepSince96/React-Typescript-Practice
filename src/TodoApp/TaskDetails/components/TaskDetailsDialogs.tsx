import React from "react";
import { Dialog } from "@/components/ui/dialog";
import SubtaskDialogForm from "../../common/SubtaskDialogForm";
import TaskDialogForm from "../../common/TaskDialogForm";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import type { ITask, ISubtask } from "@/api/types";

interface TaskDetailsDialogsProps {
  // Task data
  task: ITask | undefined;
  editingSubtask: ISubtask | undefined;
  taskId: string;
  
  // Dialog states
  dialogOpen: boolean;
  taskEditDialogOpen: boolean;
  taskDeleteDialogOpen: boolean;
  subtaskDeleteDialogOpen: boolean;
  
  // Item to delete
  itemToDelete: { id: string; title: string } | null;
  
  // Loading states
  deleteTaskMutationPending: boolean;
  deleteSubtaskMutationPending: boolean;
  
  // Handlers
  onCloseDialog: () => void;
  onCloseTaskEditDialog: () => void;
  onConfirmTaskDelete: () => void;
  onConfirmSubtaskDelete: () => void;
  onCancelTaskDelete: () => void;
  onCancelSubtaskDelete: () => void;
  setTaskDeleteDialogOpen: (open: boolean) => void;
  setSubtaskDeleteDialogOpen: (open: boolean) => void;
}

export const TaskDetailsDialogs: React.FC<TaskDetailsDialogsProps> = ({
  task,
  editingSubtask,
  taskId,
  dialogOpen,
  taskEditDialogOpen,
  taskDeleteDialogOpen,
  subtaskDeleteDialogOpen,
  itemToDelete,
  deleteTaskMutationPending,
  deleteSubtaskMutationPending,
  onCloseDialog,
  onCloseTaskEditDialog,
  onConfirmTaskDelete,
  onConfirmSubtaskDelete,
  onCancelTaskDelete,
  onCancelSubtaskDelete,
  setTaskDeleteDialogOpen,
  setSubtaskDeleteDialogOpen,
}) => {
  return (
    <>
      {/* Subtask Dialog */}
      <Dialog open={dialogOpen} onOpenChange={onCloseDialog}>
        <SubtaskDialogForm
          taskId={taskId}
          subtask={editingSubtask}
          onSuccess={onCloseDialog}
          onCancel={onCloseDialog}
        />
      </Dialog>

      {/* Task Edit Dialog */}
      <Dialog open={taskEditDialogOpen} onOpenChange={onCloseTaskEditDialog}>
        <TaskDialogForm
          editTask={task}
          onSuccess={onCloseTaskEditDialog}
          onCancel={onCloseTaskEditDialog}
        />
      </Dialog>

      {/* Task Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={taskDeleteDialogOpen}
        onOpenChange={setTaskDeleteDialogOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone and will also delete all associated subtasks."
        confirmLabel="Delete Task"
        onConfirm={onConfirmTaskDelete}
        onCancel={onCancelTaskDelete}
        isDestructive={true}
        isLoading={deleteTaskMutationPending}
        itemId={itemToDelete?.id}
        itemType="task"
      />

      {/* Subtask Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={subtaskDeleteDialogOpen}
        onOpenChange={setSubtaskDeleteDialogOpen}
        title="Delete Subtask"
        description="Are you sure you want to delete this subtask? This action cannot be undone."
        confirmLabel="Delete Subtask"
        onConfirm={onConfirmSubtaskDelete}
        onCancel={onCancelSubtaskDelete}
        isDestructive={true}
        isLoading={deleteSubtaskMutationPending}
        itemId={itemToDelete?.id}
        itemType="subtask"
      />
    </>
  );
};
