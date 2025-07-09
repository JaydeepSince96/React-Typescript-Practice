import React from "react";
import { Button } from "@/components/ui/button";
import { IoCalendarOutline, IoTrashOutline, IoPencilOutline } from "react-icons/io5";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { useTheme } from "@/contexts/ThemeContext";
import type { ITask } from "@/api/types";

interface TaskInfoCardProps {
  task: ITask;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskInfoCard: React.FC<TaskInfoCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const { isDark } = useTheme();

  const getPriorityClass = (priority: string | undefined) => {
    switch (priority) {
      case "high priority":
        return isDark
          ? "bg-red-500/20 text-red-400 border border-red-500/30"
          : "bg-red-50 text-red-700 border border-red-200";
      case "medium priority":
        return isDark
          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          : "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "low priority":
        return isDark
          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          : "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return isDark
          ? "bg-neutral-500/20 text-neutral-300 border border-neutral-500/30"
          : "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div
      className={`${
        isDark
          ? "bg-neutral-800 border-neutral-700"
          : "bg-white border-gray-200"
      } border rounded-lg p-6 shadow-lg transition-colors`}
    >
      <div className="flex items-start justify-between mb-4">
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-amber-50" : "text-gray-900"
          }`}
        >
          {task.title}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className={`${
              isDark
                ? "text-neutral-400 hover:text-amber-400"
                : "text-gray-500 hover:text-amber-500"
            }`}
          >
            <IoPencilOutline className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className={`${
              isDark
                ? "text-neutral-400 hover:text-red-400"
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            <IoTrashOutline className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`font-bold ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
          >
            Status:
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              task.completed
                ? isDark
                  ? "bg-green-600/20 text-green-400"
                  : "bg-green-50 text-green-700 border border-green-200"
                : isDark
                ? "bg-orange-600/20 text-orange-400"
                : "bg-orange-50 text-orange-700 border border-orange-200"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`font-bold ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
          >
            Priority:
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(
              task.label
            )}`}
          >
            {task.label.charAt(0).toUpperCase() +
              task.label.slice(1).replace(" priority", " Priority")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`font-bold ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
          >
            Created:
          </span>
          <span className={isDark ? "text-neutral-300" : "text-gray-700"}>
            {formatDateForDisplay(task.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <IoCalendarOutline
            className={isDark ? "text-neutral-400" : "text-gray-500"}
          />
          <span
            className={`font-bold ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
          >
            Start:
          </span>
          <span className={isDark ? "text-neutral-300" : "text-gray-700"}>
            {formatDateForDisplay(task.startDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <IoCalendarOutline
            className={isDark ? "text-neutral-400" : "text-gray-500"}
          />
          <span
            className={`font-bold ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
          >
            Due:
          </span>
          <span className={isDark ? "text-neutral-300" : "text-gray-700"}>
            {formatDateForDisplay(task.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`font-bold ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
          >
            Updated:
          </span>
          <span className={isDark ? "text-neutral-300" : "text-gray-700"}>
            {formatDateForDisplay(task.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
