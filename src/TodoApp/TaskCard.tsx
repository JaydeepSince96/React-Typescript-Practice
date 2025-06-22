import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BsFillPencilFill } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { priorityLabels } from "@/const/const";
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
  return (
    <div className="border p-3 rounded-md flex items-start justify-between gap-4">
      {/* Left Side: Checkbox and Text Info */}
      <div className="flex items-start gap-2">
        <Input
          type="checkbox"
          checked={todo.isDone}
          onChange={onToggle}
          className="mt-1 size-5"
        />
        <div>
          <p
            className={`font-medium ${
              todo.isDone ? "line-through text-gray-500" : ""
            }`}
          >
            {todo.task}
          </p>
          <p className="text-sm text-muted-foreground">
            Added: {new Date(todo.timeAndDate).toLocaleString()}
          </p>
          <p
            className={`text-sm ${
              todo.isDone ? "text-green-600" : "text-red-600"
            }`}
          >
            {todo.isDone ? "Done" : "Pending"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mr-10">
        <Select
          value={todo.priority ?? ""}
          onValueChange={(value) => onSetPriority(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityLabels.map((label) => (
              <SelectItem key={label.value} value={label.value}>
                {label.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <BsFillPencilFill className="cursor-pointer size-5" onClick={onEdit} />
        <MdOutlineDelete className="cursor-pointer size-5" onClick={onDelete} />
      </div>
    </div>
  );
};

export default TaskCard;
