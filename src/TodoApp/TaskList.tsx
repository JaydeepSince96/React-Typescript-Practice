import React from "react";
import TaskCard from "./TaskCard";
import { TbListSearch } from "react-icons/tb";
import type { ITodo, PriorityLevel } from "@/features/Todos/TodoSlice";
import { useDispatch } from "react-redux";
import { toggleTodo, setPriority } from "@/features/Todos/TodoSlice";

interface TaskListProps {
  tasks: ITodo[];
  onEdit: (todo: ITodo) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const dispatch = useDispatch();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center">
        <TbListSearch className="size-20 text-neutral-600 mb-4" />
        <p className="text-neutral-400 text-xl font-semibold">
          No tasks match your filters.
        </p>
        <p className="text-neutral-500 mt-2">
          Try adjusting your filters or adding new tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {tasks.map((todo) => (
        <TaskCard
          key={todo.id}
          todo={todo}
          onToggle={() => dispatch(toggleTodo(todo.id))}
          onSetPriority={(priority) =>
            dispatch(
              setPriority({
                id: todo.id,
                priority: priority as PriorityLevel,
              })
            )
          }
          onEdit={() => onEdit(todo)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;