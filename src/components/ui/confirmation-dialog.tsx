import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoWarningOutline, IoTrashOutline } from "react-icons/io5";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
  itemId?: string;
  itemType?: "task" | "subtask";
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
  isLoading = false,
  itemId,
  itemType = "task",
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 text-white rounded-lg shadow-2xl border border-neutral-700 max-w-md">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-8 ring-red-500/20">
            <IoWarningOutline className="h-8 w-8 text-red-400" />
          </div>
          <DialogTitle className="text-xl font-semibold text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-neutral-300 text-base leading-relaxed mt-2">
            {description}
          </DialogDescription>
          {itemId && (
            <div className="mt-3 p-3 bg-neutral-700/50 rounded-lg border border-neutral-600">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-neutral-400">
                  {itemType === "task" ? "Task ID:" : "Subtask ID:"}
                </span>
                <code className="font-mono text-sky-400 bg-neutral-900/50 px-2 py-1 rounded text-xs">
                  {itemId}
                </code>
              </div>
            </div>
          )}
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-transparent border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white disabled:opacity-50 transition-all duration-200"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500/50"
                : "bg-sky-600 hover:bg-sky-700 text-white focus:ring-2 focus:ring-sky-500/50"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <IoTrashOutline className="h-4 w-4" />
                <span>{confirmLabel}</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
