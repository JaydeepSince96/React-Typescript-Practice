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

const TaskCard = ({ todo, onToggle, onSetPriority, onEdit, onDelete }: TaskCardProps) => {
  return (
    <div className="border p-3 rounded-md flex items-start justify-between gap-4">
      <div className="flex items-start gap-2">
        <Input
          type="checkbox"
          checked={todo.isDone}
          onChange={onToggle}
          className="mt-1"
        />
        <div>
          <h4
            className={`text-lg font-medium ${todo.isDone ? "line-through text-gray-500" : ""}`}
          >
            {todo.task}
          </h4>
          <p className="text-sm text-muted-foreground">
            Added: {new Date(todo.timeAndDate).toLocaleString()}
          </p>
          <p className={`text-sm ${todo.isDone ? "text-green-600" : "text-red-600"}`}>
            {todo.isDone ? "Done" : "Pending"}
          </p>

          <div className="flex gap-2 flex-wrap">
            {priorityLabels.map((label) => (
              <Button
                key={label.value}
                className="m-1"
                variant="link"
                onClick={() => onSetPriority(label.value)}
              >
                {label.value}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <BsFillPencilFill className="cursor-pointer" onClick={onEdit} />
        <MdOutlineDelete className="cursor-pointer" onClick={onDelete} />
      </div>
    </div>
  );
};

export default TaskCard;
