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
import DateRangePicker from "./CalanderPicker"; // Assuming CalanderPicker.tsx is now DateRangePicker.tsx
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const getPriorityBorderColor = (priority: string | undefined) => {
    if (!priority) return "border-l-4 border-neutral-700";
    switch (priority) {
      case "High":
        return "border-l-4 border-red-500";
      case "Medium":
        return "border-l-4 border-yellow-500";
      case "Low":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-neutral-700";
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
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={onToggle}
          className="mt-1 size-5 accent-sky-500 focus:ring-sky-500 border-neutral-600 rounded"
        />
        <div>
          <p
            className={`font-medium text-lg ${
              todo.isDone ? "line-through text-neutral-400" : "text-amber-50"
            }`}
          >
            {todo.task}
          </p>
          <div className="flex gap-2">
            <p className="text-sm text-neutral-400 mt-1">
              <span className="font-bold">Created At</span>:{" "}
              {new Date(todo.timeAndDate).toLocaleString()}
            </p>
            <div className="flex gap-1">
              {startDate && (
                <p className="text-sm text-neutral-400 mt-0.5">
                  <span className="font-bold">From</span>:{" "}
                  {startDate.toLocaleDateString()}
                </p>
              )}
              {endDate && (
                <p className="text-sm text-neutral-400 mt-0.5">
                  <span className="font-bold">To</span>:{" "}
                  {endDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
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

      {/* Right Side: Date Pickers, Priority, Edit, Delete - ALL IN ONE ROW */}
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {" "}
        {/* Adjusted gap, removed md:gap-4 for consistency */}
        {/* Date pickers component. It will now lay out its buttons horizontally internally. */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <Select
          value={todo.priority ?? ""}
          onValueChange={(value) => onSetPriority(value)}
        >
          <SelectTrigger className="w-[100px] bg-neutral-700 border-neutral-600 text-white hover:border-sky-500 transition-colors">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
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
        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {" "}
          {/* Consistent gap */}
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
};

export default TaskCard;
