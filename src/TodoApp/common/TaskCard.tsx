import { memo, useCallback, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { BsFillPencilFill } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { priorityLabels } from "@/const/const";
import type { ITask, TaskLabel } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { useSubtaskStats } from "@/hooks/useSubtaskHooks";

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
    const { isDark } = useTheme();
    const [showCopyTooltip, setShowCopyTooltip] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showSubtaskTooltip, setShowSubtaskTooltip] = useState(false);
    const [shouldFetchSubtasks, setShouldFetchSubtasks] = useState(false);

    // Only fetch subtask stats when user hovers for tooltip (lazy loading)
    const { data: subtaskStats } = useSubtaskStats(task._id, {
      enabled: shouldFetchSubtasks,
    });

    // Handler to enable subtask fetching when user hovers over subtask area
    const handleSubtaskHover = () => {
      if (!shouldFetchSubtasks) {
        setShouldFetchSubtasks(true);
      }
      setShowSubtaskTooltip(true);
    };

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
        createdAt: formatDateForDisplay(task.createdAt),
        startDate: formatDateForDisplay(task.startDate),
        dueDate: formatDateForDisplay(task.dueDate),
      }),
      [task.createdAt, task.startDate, task.dueDate]
    );

    // Memoized completion status display
    const completionStatus = useMemo(
      () => ({
        className: `mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
          task.completed
            ? isDark
              ? "bg-green-600/20 text-green-400 border border-green-500/30"
              : "bg-green-100 text-green-700 border border-green-300"
            : isDark
            ? "bg-red-600/20 text-red-400 border border-red-500/30"
            : "bg-orange-100 text-orange-700 border border-orange-300"
        }`,
        text: task.completed ? "Done" : "Pending",
      }),
      [task.completed, isDark]
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

    // Copy task ID to clipboard
    const handleCopyTaskId = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent other click handlers
        try {
          await navigator.clipboard.writeText(task._id);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
          console.error("Failed to copy task ID:", err);
        }
      },
      [task._id, setCopied]
    );

    return (
      <div
        className={cn(
          "relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group",
          // Responsive padding: smaller on mobile, larger on desktop
          "p-4 sm:p-6",
          isDark
            ? "border border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900 hover:border-neutral-600"
            : "border border-slate-200/60 bg-gradient-to-br from-white via-slate-50/50 to-white hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/30 backdrop-blur-sm",
          priorityBorderColor
        )}
      >
        {/* Desktop Layout: Task ID Badge (Top Right) */}
        <div className="hidden sm:block absolute top-3 right-3 group/id">
          <div
            className={`
              px-3 py-1 backdrop-blur-sm cursor-pointer rounded-full transition-all duration-200 border
              ${
                isDark
                  ? "bg-sky-500/10 border-sky-500/30 hover:bg-sky-500/20 hover:border-sky-500/50"
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/80 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 shadow-sm hover:shadow-md"
              }
            `}
            onClick={handleCopyTaskId}
            onMouseEnter={() => setShowCopyTooltip(true)}
            onMouseLeave={() => setShowCopyTooltip(false)}
          >
            <span
              className={`text-xs font-mono font-medium ${
                isDark ? "text-sky-400" : "text-blue-700"
              }`}
            >
              ID: {task._id.slice(-6)}
            </span>
          </div>
          {/* Desktop Tooltip */}
          {(showCopyTooltip || copied) && (
            <div
              className={`
              absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded shadow-lg border whitespace-nowrap z-50
              ${
                isDark
                  ? "bg-neutral-900 text-white border-neutral-600"
                  : "bg-slate-800 text-white border-slate-600 shadow-xl"
              }
            `}
            >
              {copied ? "Copied!" : "Click to copy ID"}
            </div>
          )}
        </div>

        {/* Desktop Layout: Action Icons (Top Right, next to Task ID) */}
        <div className="hidden sm:flex absolute top-5 right-28 items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <BsFillPencilFill
            className={`cursor-pointer w-5 h-5 transition-colors ${
              isDark
                ? "text-neutral-400 hover:text-sky-400"
                : "text-gray-400 hover:text-blue-600"
            }`}
            onClick={onEdit}
          />
          <MdOutlineDelete
            className={`cursor-pointer w-6 h-6 transition-colors ${
              isDark
                ? "text-neutral-400 hover:text-red-400"
                : "text-gray-400 hover:text-red-600"
            }`}
            onClick={onDelete}
          />
        </div>

        {/* Mobile Layout: Top Row (Task ID & Action Icons) - Only visible on mobile */}
        <div className="flex sm:hidden items-center justify-between mb-4">
          {/* Mobile Task ID Badge */}
          <div className="group/id">
            <div
              className={`
                px-2 py-1 backdrop-blur-sm cursor-pointer rounded-full transition-all duration-200 border
                ${
                  isDark
                    ? "bg-sky-500/10 border-sky-500/30 hover:bg-sky-500/20 hover:border-sky-500/50"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/80 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 shadow-sm hover:shadow-md"
                }
              `}
              onClick={handleCopyTaskId}
              onMouseEnter={() => setShowCopyTooltip(true)}
              onMouseLeave={() => setShowCopyTooltip(false)}
            >
              <span
                className={`text-xs font-mono font-medium ${
                  isDark ? "text-sky-400" : "text-blue-700"
                }`}
              >
                ID: {task._id.slice(-6)}
              </span>
            </div>
            {/* Mobile Tooltip */}
            {(showCopyTooltip || copied) && (
              <div
                className={`
                absolute top-full mt-1 left-0 text-xs px-2 py-1 rounded shadow-lg border whitespace-nowrap z-50
                ${
                  isDark
                    ? "bg-neutral-900 text-white border-neutral-600"
                    : "bg-slate-800 text-white border-slate-600 shadow-xl"
                }
              `}
              >
                {copied ? "Copied!" : "Click to copy ID"}
              </div>
            )}
          </div>

          {/* Mobile Action Icons - Always visible */}
          <div className="flex items-center gap-2">
            <BsFillPencilFill
              className={`cursor-pointer w-4 h-4 transition-colors ${
                isDark
                  ? "text-neutral-400 hover:text-sky-400"
                  : "text-gray-400 hover:text-blue-600"
              }`}
              onClick={onEdit}
            />
            <MdOutlineDelete
              className={`cursor-pointer w-5 h-5 transition-colors ${
                isDark
                  ? "text-neutral-400 hover:text-red-400"
                  : "text-gray-400 hover:text-red-600"
              }`}
              onClick={onDelete}
            />
          </div>
        </div>

        {/* Main Content Layout: Checkbox and Task Info */}
        <div
          className={cn(
            "flex items-start gap-4",
            // Desktop: no right padding needed for content, Mobile: full width
            "sm:pr-32"
          )}
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            className={`mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded transition-all duration-200 flex-shrink-0 ${
              isDark
                ? "accent-sky-500 focus:ring-sky-500 border-neutral-600"
                : "accent-blue-600 focus:ring-blue-500 border-gray-300 shadow-sm"
            }`}
          />

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Task Title */}
            <p
              className={`font-medium text-base sm:text-lg cursor-pointer transition-colors duration-200 break-words ${
                task.completed
                  ? `line-through ${
                      isDark ? "text-neutral-400" : "text-gray-400"
                    }`
                  : `${isDark ? "text-amber-50" : "text-gray-800"}`
              }`}
              onClick={handleTaskTextClick}
            >
              {truncatedTitle}
            </p>

            {/* Dates Section */}
            <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
              {/* Created Date - Mobile: stacked, Desktop: original layout */}
              <div className="sm:flex sm:items-center sm:gap-3">
                <p
                  className={`text-xs sm:text-sm flex items-center gap-1 ${
                    isDark ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isDark ? "bg-neutral-400" : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="font-medium">Created</span>
                  <span
                    className={`${
                      isDark ? "text-neutral-300" : "text-gray-700"
                    } break-words`}
                  >
                    {dateDisplays.createdAt}
                  </span>
                </p>
              </div>

              {/* Start and Due Dates */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p
                  className={`text-xs sm:text-sm flex items-center gap-1 ${
                    isDark ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                  <span className="font-medium">From</span>
                  <span
                    className={`${
                      isDark ? "text-neutral-300" : "text-gray-700"
                    } break-words`}
                  >
                    {dateDisplays.startDate}
                  </span>
                </p>
                <p
                  className={`text-xs sm:text-sm flex items-center gap-1 ${
                    isDark ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                  <span className="font-medium">To</span>
                  <span
                    className={`${
                      isDark ? "text-neutral-300" : "text-gray-700"
                    } break-words`}
                  >
                    {dateDisplays.dueDate}
                  </span>
                </p>
              </div>
            </div>

            {/* Status and Priority Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
              {/* Completion Status */}
              <span
                className={`inline-block px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold rounded-full transition-colors duration-200 flex-shrink-0 ${
                  task.completed
                    ? isDark
                      ? "bg-green-600/20 text-green-400 border border-green-500/30"
                      : "bg-green-100 text-green-700 border border-green-300"
                    : isDark
                    ? "bg-red-600/20 text-red-400 border border-red-500/30"
                    : "bg-orange-100 text-orange-700 border border-orange-300"
                }`}
              >
                {completionStatus.text}
              </span>

              {/* Priority Badge */}
              <div
                className={`px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium rounded-lg border flex-shrink-0 ${
                  task.label === "high priority"
                    ? isDark
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-red-50 text-red-700 border-red-200 shadow-sm"
                    : task.label === "medium priority"
                    ? isDark
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm"
                    : task.label === "low priority"
                    ? isDark
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    : isDark
                    ? "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
                    : "bg-gray-50 text-gray-600 border-gray-200 shadow-sm"
                }`}
              >
                {task.label?.replace(" priority", "").toUpperCase() || "NONE"}
              </div>

              {/* Enhanced SubTask Label with Analytics */}
              <div
                className={`relative px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors duration-200 border flex-shrink-0 ${
                  isDark
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30 hover:text-purple-300"
                    : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800 shadow-sm hover:shadow-md"
                }`}
                onClick={handleTaskTextClick}
                onMouseEnter={handleSubtaskHover}
                onMouseLeave={() => setShowSubtaskTooltip(false)}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">SUBTASKS</span>
                  <span className="sm:hidden">SUB</span>
                  {subtaskStats && subtaskStats.total > 0 && (
                    <span
                      className={`px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full text-xs font-bold ${
                        isDark
                          ? "bg-purple-600 text-white"
                          : "bg-purple-600 text-white"
                      }`}
                    >
                      {subtaskStats.completed}/{subtaskStats.total}
                    </span>
                  )}
                </div>

                {/* Subtask Stats Tooltip */}
                {showSubtaskTooltip &&
                  subtaskStats &&
                  subtaskStats.total > 0 && (
                    <div
                      className={`
                    absolute bottom-full left-0 mb-2 p-3 rounded-lg border shadow-lg z-50 w-48 sm:min-w-48
                    ${
                      isDark
                        ? "bg-neutral-800 border-neutral-600 text-white"
                        : "bg-white border-gray-200 text-gray-900 shadow-xl"
                    }
                  `}
                    >
                      <div className="text-xs font-semibold mb-2">
                        Subtask Progress
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs">Completed:</span>
                          <span className="text-xs font-medium">
                            {subtaskStats.completed}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Pending:</span>
                          <span className="text-xs font-medium">
                            {subtaskStats.pending}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Progress:</span>
                          <span className="text-xs font-bold">
                            {subtaskStats.completionRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div
                          className={`w-full bg-gray-200 rounded-full h-1.5 ${
                            isDark ? "bg-neutral-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${subtaskStats.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Dropdown (Hidden but functional) */}
        <div className="hidden">
          <Select value={task.label} onValueChange={handlePriorityChange}>
            <SelectContent
              className={
                isDark
                  ? "bg-neutral-700 border-neutral-600 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }
            >
              {priorityLabels.map((label) => (
                <SelectItem
                  key={label.value}
                  value={label.value}
                  className={
                    isDark
                      ? "hover:bg-neutral-600 focus:bg-neutral-600 focus:text-white"
                      : "hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
                  }
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
