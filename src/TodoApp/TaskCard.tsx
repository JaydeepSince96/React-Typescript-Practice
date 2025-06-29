import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
import { BsFillPencilFill } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { priorityLabels } from "@/const/const";
import CalendarPicker from "./CalanderPicker";
import { useState } from "react";
import type { ITodo } from "@/features/Todos/TodoSlice";

type TaskCardProps = {
  todo: ITodo;
  onToggle: () => void;
  onSetPriority: (priority: string) => void;
  onEdit: () => void;
  onDelete: () => void;
};

const TaskCard = ({
  todo,
  onToggle,
  onSetPriority,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Determine card border color based on priority for visual emphasis
  const getPriorityBorderColor = (priority: string | undefined) => {
    // Updated to accept undefined
    if (!priority) return "border-l-4 border-neutral-700"; // Handle undefined case
    switch (priority) {
      case "High":
        return "border-l-4 border-red-500"; // Muted red for High
      case "Medium":
        return "border-l-4 border-yellow-500"; // Muted yellow for Medium
      case "Low":
        return "border-l-4 border-blue-500"; // Muted blue for Low
      default:
        return "border-l-4 border-neutral-700"; // Default border
    }
  };

  return (
    <div
      className={`relative border border-neutral-700 p-4 rounded-lg flex items-start justify-between gap-4 bg-neutral-800 shadow-md transition-all duration-200 ${getPriorityBorderColor(
        todo.priority
      )}`}
    >
      {/* Left Side: Checkbox and Text Info */}
      <div className="flex items-start gap-4">
        {/* Custom styled checkbox for better appearance */}
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={onToggle}
          className="mt-1 size-5 accent-sky-500 focus:ring-sky-500 border-neutral-600 rounded" // Tailwind for custom checkbox look
        />
        <div>
          <p
            className={`font-medium text-lg ${
              todo.isDone ? "line-through text-neutral-400" : "text-amber-50"
            }`}
          >
            {todo.task}
          </p>
          <p className="text-sm text-neutral-400 mt-1">
            Added: {new Date(todo.timeAndDate).toLocaleString()}
          </p>
          <span
            className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
              todo.isDone
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {todo.isDone ? "Done" : "Pending"}
          </span>
        </div>
      </div>

      {/* Right Side: Date Picker, Priority, Edit, Delete */}
      <div className="flex items-center gap-4">
        <CalendarPicker
          selectedDate={selectedDate} // This state needs to be lifted or handled for persistence
          onChange={setSelectedDate}
        />
        <Select
          // FIX: Provide a fallback empty string if todo.priority is undefined
          value={todo.priority ?? ""}
          onValueChange={(value) => onSetPriority(value)}
        >
          <SelectTrigger className="w-[120px] bg-neutral-700 border-neutral-600 text-white hover:border-sky-500 transition-colors">
            <SelectValue placeholder="Set Priority" />
          </SelectTrigger>
          {/* SelectContent needs to be styled in components/ui/select if not already */}
          <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
            {priorityLabels.map((label) => (
              <SelectItem
                key={label.value}
                value={label.value}
                className="hover:bg-neutral-600 focus:bg-neutral-600 focus:text-white"
              >
                {label.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
  );
};

export default TaskCard;
