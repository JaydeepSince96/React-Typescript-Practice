import { memo, useCallback, useMemo } from "react";
import {
  Select,
  // SelectTrigger,
  // SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BsFillPencilFill } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { priorityLabels } from "@/const/const";
import type { ITask, TaskLabel } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDateForDisplay, formatDateTimeForDisplay } from "@/utils/dateUtils";

// Utility function to truncate text - memoized
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 4) + "...."; // -4 for the dots
};

// Priority border color mapping for better performance
const PRIORITY_BORDER_COLORS: Record<TaskLabel, string> = {
  "high priority": "border-l-4 border-red-500",
  "medium priority": "border-l-4 border-yellow-500",
  "low priority": "border-l-4 border-blue-500",
};

type TaskCardProps = {
  task: ITask;
  onToggle: () => void;
  onSetPriority: (priority: TaskLabel) => void;
  onEdit: () => void;
  onDelete: () => void;
};

const TaskCard = memo<TaskCardProps>(
  ({ task, onToggle, onSetPriority, onEdit, onDelete }) => {
    const navigate = useNavigate();

    // Memoized priority border color
    const priorityBorderColor = useMemo(() => {
      if (!task.label) return "border-l-4 border-neutral-700";
      return (
        PRIORITY_BORDER_COLORS[task.label] || "border-l-4 border-neutral-700"
      );
    }, [task.label]);

    // Memoized truncated title
    const truncatedTitle = useMemo(
      () => truncateText(task.title, 44),
      [task.title]
    );

    // Memoized date displays
    const dateDisplays = useMemo(
      () => ({
        createdAt: formatDateTimeForDisplay(task.createdAt),
        startDate: formatDateForDisplay(task.startDate),
        dueDate: formatDateForDisplay(task.dueDate),
      }),
      [task.createdAt, task.startDate, task.dueDate]
    );

    // Memoized completion status display
    const completionStatus = useMemo(
      () => ({
        className: `mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
          task.completed
            ? "bg-green-600/20 text-green-400"
            : "bg-red-600/20 text-red-400"
        }`,
        text: task.completed ? "Done" : "Pending",
      }),
      [task.completed]
    );

    // Memoized text styling
    const textStyle = useMemo(
      () =>
        `font-medium text-lg cursor-pointer ${
          task.completed ? "line-through text-neutral-400" : "text-amber-50"
        }`,
      [task.completed]
    );

    // Optimized navigation handler
    const handleTaskTextClick = useCallback(() => {
      navigate(`/task/${task._id}`);
    }, [navigate, task._id]);

    // Optimized priority change handler
    const handlePriorityChange = useCallback(
      (value: string) => {
        onSetPriority(value as TaskLabel);
      },
      [onSetPriority]
    );

    return (
      <div
        className={cn(
          "relative border border-neutral-700 p-5 rounded-xl flex items-start justify-between gap-4 bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-neutral-600 group",
          priorityBorderColor
        )}
      >
        {/* Task ID Badge */}
        <div className="absolute top-3 right-3 bg-sky-500/10 border border-sky-500/30 rounded-full px-3 py-1 backdrop-blur-sm">
          <span className="text-xs font-mono text-sky-400 font-medium">
            ID: {task._id.slice(-6)}
          </span>
        </div>

        {/* Action Icons */}
        <div className="absolute top-5 right-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <BsFillPencilFill
            className="cursor-pointer size-5 text-neutral-400 hover:text-sky-400 transition-colors"
            onClick={onEdit}
          />
          <MdOutlineDelete
            className="cursor-pointer size-6 text-neutral-400 hover:text-red-500 transition-colors"
            onClick={onDelete}
          />
        </div>

        {/* Left Side: Checkbox and Text Info */}
        <div className="flex items-start gap-4 flex-1 pr-32">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            className="mt-1 size-5 accent-sky-500 focus:ring-sky-500 border-neutral-600 rounded transition-all duration-200"
          />
          <div className="flex-1">
            <p className={textStyle} onClick={handleTaskTextClick}>
              {truncatedTitle}
            </p>
            <div className="flex gap-2">
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                <span className="font-medium">Created</span>
                <span className="text-neutral-300">{dateDisplays.createdAt}</span>
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                <span className="font-medium">From</span>
                <span className="text-neutral-300">{dateDisplays.startDate}</span>
              </p>
              <p className="text-sm text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                <span className="font-medium">To</span>
                <span className="text-neutral-300">{dateDisplays.dueDate}</span>
              </p>
            </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={completionStatus.className}>
                {completionStatus.text}
              </span>
              {/* Priority Badge */}
              <div className={`px-2 py-1 text-xs font-medium rounded-md ${
                task.label === 'high priority' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                task.label === 'medium priority' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                task.label === 'low priority' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-neutral-500/20 text-neutral-400 border border-neutral-500/30'
              }`}>
                {task.label?.replace(' priority', '').toUpperCase() || 'NONE'}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Dropdown (Hidden but functional) */}
        <div className="hidden">
          <Select value={task.label} onValueChange={handlePriorityChange}>
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
        </div>
      </div>
    );
  }
);

// Display name for React DevTools
TaskCard.displayName = "TaskCard";

export default TaskCard;
