import { memo, useCallback, useMemo } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BsFillPencilFill } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { priorityLabels } from "@/const/const";
import type { ITask, TaskLabel } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDateTimeForDisplay } from "@/utils/dateUtils";

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
  "priority": "border-l-4 border-neutral-700",
};

type TaskCardProps = {
  task: ITask;
  onToggle: () => void;
  onSetPriority: (priority: TaskLabel) => void;
  onEdit: () => void;
  onDelete: () => void;
};

const TaskCard = memo<TaskCardProps>(({
  task,
  onToggle,
  onSetPriority,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  // Memoized priority border color
  const priorityBorderColor = useMemo(() => {
    if (!task.label) return "border-l-4 border-neutral-700";
    return PRIORITY_BORDER_COLORS[task.label] || "border-l-4 border-neutral-700";
  }, [task.label]);

  // Memoized truncated title
  const truncatedTitle = useMemo(() => 
    truncateText(task.title, 44), 
    [task.title]
  );

  // Memoized date displays
  const dateDisplays = useMemo(() => ({
    createdAt: formatDateTimeForDisplay(task.createdAt),
    startDate: formatDateTimeForDisplay(task.startDate),
    dueDate: formatDateTimeForDisplay(task.dueDate),
  }), [task.createdAt, task.startDate, task.dueDate]);

  // Memoized completion status display
  const completionStatus = useMemo(() => ({
    className: `mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
      task.completed
        ? "bg-green-600/20 text-green-400"
        : "bg-red-600/20 text-red-400"
    }`,
    text: task.completed ? "Done" : "Pending",
  }), [task.completed]);

  // Memoized text styling
  const textStyle = useMemo(() => 
    `font-medium text-lg cursor-pointer ${
      task.completed 
        ? "line-through text-neutral-400" 
        : "text-amber-50"
    }`,
    [task.completed]
  );

  // Optimized navigation handler
  const handleTaskTextClick = useCallback(() => {
    navigate(`/task/${task._id}`);
  }, [navigate, task._id]);

  // Optimized priority change handler
  const handlePriorityChange = useCallback((value: string) => {
    onSetPriority(value as TaskLabel);
  }, [onSetPriority]);

  return (
    <div
      className={cn(
        "relative border border-neutral-700 p-4 rounded-lg flex items-start justify-between gap-4 bg-neutral-800 shadow-md transition-all duration-200",
        priorityBorderColor
      )}
    >
      {/* Left Side: Checkbox and Text Info */}
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="mt-1 size-5 accent-sky-500 focus:ring-sky-500 border-neutral-600 rounded"
        />
        <div>
          <p
            className={textStyle}
            onClick={handleTaskTextClick}
          >
            {truncatedTitle}
          </p>
          <div className="flex gap-2 flex-wrap">
            <p className="text-sm text-neutral-400 mt-1">
              <span className="font-bold">Created At</span>:{" "}
              {dateDisplays.createdAt}
            </p>
            <div className="flex gap-1 flex-wrap">
              <p className="text-sm text-neutral-400 mt-0.5">
                <span className="font-bold">From</span>:{" "}
                {dateDisplays.startDate}
              </p>
              <p className="text-sm text-neutral-400 mt-0.5">
                <span className="font-bold">To</span>:{" "}
                {dateDisplays.dueDate}
              </p>
            </div>
          </div>
          <span className={completionStatus.className}>
            {completionStatus.text}
          </span>
        </div>
      </div>

      {/* Right Side: Priority, Edit, Delete */}
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        <Select
          value={task.label}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[120px] bg-neutral-700 border-neutral-600 text-white hover:border-sky-500 transition-colors">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
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
        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <BsFillPencilFill
            className="cursor-pointer size-5 text-neutral-400 hover:text-sky-400 transition-colors"
            onClick={onEdit}
          />
          <MdOutlineDelete
            className="cursor-pointer size-6 text-neutral-400 hover:text-red-500 transition-colors"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
});

// Display name for React DevTools
TaskCard.displayName = 'TaskCard';

export default TaskCard;
