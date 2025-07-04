import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RootState } from "@/store";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  toggleSubtask,
  updateSubtask,
  deleteSubtask,
  addNewSubtask,
} from "@/features/Todos/TodoSlice";
import type { ISubtask } from "@/features/Todos/TodoSlice";
import TaskDialogForm from "./common/TaskDialogForm";
import { formSchema } from "@/schema/TodoFormSchema";
import { z } from "zod";
import {
  IoArrowBack,
  IoTrashOutline,
  IoPencilOutline,
  IoAdd,
} from "react-icons/io5";
import { Dialog } from "@/components/ui/dialog";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const task = useSelector((state: RootState) =>
    state.todo.find((t) => t.id === Number(id))
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<ISubtask | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: "" },
  });

  const handleOpenDialog = (subtask: ISubtask | null) => {
    setEditingSubtask(subtask);
    form.reset({ task: subtask ? subtask.text : "" });
    setDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingSubtask) {
      dispatch(
        updateSubtask({
          taskId: task!.id,
          subtaskId: editingSubtask.id,
          text: data.task,
        })
      );
    } else {
      dispatch(addNewSubtask({ taskId: task!.id, text: data.task }));
    }
    setDialogOpen(false);
  };

  if (!task) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center text-white">Task not found.</div>
      </SidebarLayout>
    );
  }

  const getPriorityClass = (priority: string | undefined) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Low":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-300 border border-neutral-500/30";
    }
  };

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-neutral-300 hover:bg-neutral-800 hover:text-sky-400"
          >
            <IoArrowBack className="size-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Task: <span className="text-sky-400">{task.id}</span>
          </h1>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-amber-50 mb-4">
            {task.task}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Status:</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  task.isDone
                    ? "bg-green-600/20 text-green-400"
                    : "bg-orange-600/20 text-orange-400"
                }`}
              >
                {task.isDone ? "Completed" : "Pending"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Priority:</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(
                  task.priority
                )}`}
              >
                {task.priority || "Not Set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Created:</span>
              <span className="text-neutral-300">
                {new Date(task.timeAndDate).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-sky-400">Subtasks</h3>
            <Button onClick={() => handleOpenDialog(null)}>
              <IoAdd className="mr-2 size-4" />
              Add Subtask
            </Button>
          </div>
          <div className="space-y-3">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-3 p-3 bg-neutral-700/50 rounded-md transition-all"
              >
                <input
                  type="checkbox"
                  checked={subtask.isDone}
                  onChange={() =>
                    dispatch(
                      toggleSubtask({
                        taskId: task.id,
                        subtaskId: subtask.id,
                      })
                    )
                  }
                  className="size-5 accent-sky-500 bg-neutral-600 rounded border-neutral-500 cursor-pointer"
                />
                <span
                  className={`flex-grow text-neutral-200 ${
                    subtask.isDone ? "line-through text-neutral-500" : ""
                  }`}
                >
                  {subtask.text}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(subtask)}
                    className="text-neutral-400 hover:text-amber-400"
                  >
                    <IoPencilOutline className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      dispatch(
                        deleteSubtask({
                          taskId: task.id,
                          subtaskId: subtask.id,
                        })
                      )
                    }
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <IoTrashOutline className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <TaskDialogForm
          form={form}
          onSubmit={onSubmit}
          isSubtask={true}
          isEditing={!!editingSubtask}
        />
      </Dialog>
    </SidebarLayout>
  );
};

export default TaskDetails;