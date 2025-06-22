import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

        <div className="flex gap-2 ml-10">
          {priorityLabels.map((label) => {
            const isSelected = todo.priority === label.value;
            return (
              <Button
                key={label.value}
                onClick={() => onSetPriority(label.value)}
                variant="link"
                className={`w-20 h-8 flex items-center justify-center text-sm rounded-full transition-colors px-2 py-1
          ${
            isSelected
              ? label.value === "High"
                ? "bg-red-100 text-red-700 font-semibold"
                : label.value === "Medium"
                ? "bg-yellow-100 text-yellow-700 font-semibold"
                : "bg-green-100 text-green-700 font-semibold"
              : "text-gray-500 hover:text-black"
          }`}
              >
                {label.value}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center mr-7 gap-3">
        <BsFillPencilFill className="cursor-pointer size-5" onClick={onEdit} />
        <MdOutlineDelete className="cursor-pointer size-5" onClick={onDelete} />
      </div>
    </div>
  );
};

export default TaskCard;
