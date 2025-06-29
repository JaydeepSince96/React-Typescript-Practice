import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@/utils/useQuery"; // Assuming this hook works
import { useNavigate } from "react-router-dom";

import {
  toggleTodo,
  setPriority,
  deleteTodo,
  updateTodo,
} from "@/features/Todos/TodoSlice";
import type { RootState } from "@/store";
import type { ITodo, PriorityLevel } from "@/features/Todos/TodoSlice";

import { formSchema } from "@/schema/TodoFormSchema";
import { z } from "zod";

import TaskCard from "../TaskCard";
import { Dialog } from "@/components/ui/dialog";
import TodoDialogForm from "../TaskDialogForm";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5"; // For a more elegant back icon
import { SidebarLayout } from "@/layout/SidebarLayout"; // Ensure SidebarLayout wraps this
import { TbListSearch } from "react-icons/tb";

const Priority: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();
  const currentPriority = query.get("level") as PriorityLevel;

  const todos = useSelector((state: RootState) => state.todo);
  const filteredTodos = todos.filter(
    (todo) => todo.priority === currentPriority
  );

  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<ITodo | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: "" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editTodo) {
      dispatch(updateTodo({ id: editTodo.id, task: data.task }));
    }
    setEditTodo(null);
    setOpen(false);
    form.reset();
  };

  return (
    <SidebarLayout> {/* Wrap with SidebarLayout */}
      <div className="flex-1 h-full w-full p-6 bg-neutral-900 overflow-y-auto">
        <div className="flex items-center mb-6">
          <Button
            variant={"ghost"} // Use ghost variant or custom class for subtle button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition-colors px-3 py-2 rounded-md"
          >
            <IoArrowBack className="text-xl" />
            <span className="text-lg">Back</span>
          </Button>
          <h2 className="text-3xl font-bold ml-4 text-white">
            Tasks with Priority:{" "}
            <span className="capitalize text-sky-400">{currentPriority}</span>
          </h2>
        </div>

        <div className="space-y-4 p-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <TbListSearch className="size-20 text-neutral-600 mb-4" />
              <p className=" text-neutral-400 text-xl font-semibold">
                No tasks found with "{currentPriority}" priority.
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
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
                onEdit={() => {
                  setEditTodo(todo);
                  form.setValue("task", todo.task);
                  setOpen(true);
                }}
                onDelete={() => dispatch(deleteTodo(todo.id))}
              />
            ))
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <TodoDialogForm onSubmit={onSubmit} form={form} />
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

export default Priority;