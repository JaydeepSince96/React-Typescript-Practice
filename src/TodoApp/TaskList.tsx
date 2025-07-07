import React from "react";
import TaskCard from "./common/TaskCard";
import { TbListSearch } from "react-icons/tb";
import type { ITask, TaskLabel } from "@/api/types";
import { useToggleTaskCompletion, useUpdateTaskLabel } from "@/hooks/useApiHooks";

interface TaskListProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const toggleTaskMutation = useToggleTaskCompletion();
  const updateLabelMutation = useUpdateTaskLabel();

  const handleToggle = async (taskId: string, currentCompleted: boolean) => {
    try {
      await toggleTaskMutation.mutateAsync({
        id: taskId,
        completed: !currentCompleted,
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleSetPriority = async (taskId: string, priority: TaskLabel) => {
    try {
      await updateLabelMutation.mutateAsync({
        id: taskId,
        label: priority,
      });
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

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
      {tasks.map((task) => (
        <TaskCard
                key={task._id}
          task={task}
          onToggle={() => handleToggle(task._id, task.completed)}
          onSetPriority={(priority) => handleSetPriority(task._id, priority as TaskLabel)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task._id)}
        />
      ))}
    </div>
  );
};

export default TaskList;