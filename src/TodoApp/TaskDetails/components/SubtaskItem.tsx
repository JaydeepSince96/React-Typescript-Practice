import React from "react";
import { Button } from "@/components/ui/button";
import { SubtaskCheckbox } from "@/components/ui/subtask-checkbox";
import { IoCalendarOutline, IoTrashOutline, IoPencilOutline } from "react-icons/io5";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { useTheme } from "@/contexts/ThemeContext";
import type { ISubtask } from "@/api/types";

interface SubtaskItemProps {
  subtask: ISubtask;
  onToggle: (subtaskId: string) => void;
  onEdit: (subtask: ISubtask) => void;
  onDelete: (subtask: ISubtask) => void;
  isToggling: boolean;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  onToggle,
  onEdit,
  onDelete,
  isToggling,
}) => {
  const { isDark } = useTheme();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      return formatDateForDisplay(dateString);
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return null;
    }
  };

  return (
    <div
      key={`${subtask._id}-${subtask.completed}-${subtask.updatedAt}`}
      className={`group rounded-lg border transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "bg-neutral-700/50 border-neutral-600/50 hover:bg-neutral-700/70 hover:border-neutral-500/70"
          : "bg-gray-50/80 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="mt-1 relative">
            <SubtaskCheckbox
              checked={subtask.completed}
              onCheckedChange={() => {
                console.log(
                  `🎯 SubtaskItem: Checkbox change for ${subtask._id}: ${subtask.completed} -> ${!subtask.completed}`
                );
                onToggle(subtask._id);
              }}
              disabled={isToggling}
              subtaskId={subtask._id}
            />
            {isToggling && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4
                className={`text-base font-medium leading-relaxed transition-all duration-200 ${
                  subtask.completed
                    ? isDark
                      ? "line-through text-neutral-500"
                      : "line-through text-gray-500"
                    : isDark
                    ? "text-neutral-200 group-hover:text-white"
                    : "text-gray-800 group-hover:text-gray-900"
                }`}
              >
                {subtask.title}
              </h4>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(subtask)}
                  className={`h-8 w-8 transition-all duration-200 ${
                    isDark
                      ? "text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10"
                      : "text-gray-500 hover:text-amber-500 hover:bg-amber-50"
                  }`}
                >
                  <IoPencilOutline className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(subtask)}
                  className={`h-8 w-8 transition-all duration-200 ${
                    isDark
                      ? "text-neutral-400 hover:text-red-400 hover:bg-red-400/10"
                      : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <IoTrashOutline className="size-4" />
                </Button>
              </div>
            </div>

            {/* Date information */}
            {(subtask.startDate || subtask.endDate) && (
              <div className="flex items-center gap-4 mb-3 text-sm">
                <div
                  className={`flex items-center gap-2 ${
                    isDark ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  <IoCalendarOutline
                    className={`size-4 ${
                      isDark ? "text-sky-400" : "text-sky-600"
                    }`}
                  />
                  <span className="font-medium">
                    {subtask.startDate && subtask.endDate
                      ? `${formatDate(subtask.startDate)} - ${formatDate(
                          subtask.endDate
                        )}`
                      : subtask.startDate
                      ? `Start: ${formatDate(subtask.startDate)}`
                      : subtask.endDate
                      ? `Due: ${formatDate(subtask.endDate)}`
                      : null}
                  </span>
                </div>
              </div>
            )}

            {/* Status and metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    subtask.completed
                      ? isDark
                        ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                        : "bg-green-50 text-green-700 ring-1 ring-green-200"
                      : isDark
                      ? "bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30"
                      : "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                  }`}
                >
                  {subtask.completed ? "Completed" : "In Progress"}
                </span>
              </div>
              <div
                className={`flex items-center gap-4 text-xs ${
                  isDark ? "text-neutral-500" : "text-gray-500"
                }`}
              >
                <span className="flex items-center gap-1">
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isDark ? "bg-neutral-500" : "bg-gray-400"
                    }`}
                  ></span>
                  Created {formatDate(subtask.createdAt)}
                </span>
                {subtask.completed &&
                  subtask.updatedAt !== subtask.createdAt && (
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isDark ? "bg-green-500" : "bg-green-600"
                        }`}
                      ></span>
                      Completed {formatDate(subtask.updatedAt)}
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
