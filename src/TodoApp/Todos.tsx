"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewTodo, deleteTodo, toggleTodo } from "@/features/Todos/TodoSlice";
import { formSchema } from "@/schema/TodoFormSchema";
import type { RootState } from "@/store";
import type { ITodo } from "@/features/Todos/TodoSlice";
import { z } from "zod";
import { updateTodo } from "@/features/Todos/TodoSlice";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TodoDialogForm from "./TodoDialogForm";
import { setPriority } from "@/features/Todos/TodoSlice";
import { priorityLabels } from "@/const/const";
import { useNavigate } from "react-router-dom";
import TaskCard from "./TaskCard";
import { type PriorityLevel } from "@/features/Todos/TodoSlice";

export default function Todos() {
  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<ITodo | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const todoText = useSelector((text: RootState) => text.todo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: "" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editTodo) {
      dispatch(updateTodo({ id: editTodo.id, task: data.task }));
    } else {
      dispatch(addNewTodo(data.task));
    }

    form.reset();
    setEditTodo(null);
    setOpen(false);
  };

  function handleTodoDelete(id: number) {
    dispatch(deleteTodo(id));
  }

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <div className="priority ">
          {priorityLabels.map((item) => (
            <Button
              className="m-2 h-2.5"
              variant={"outline"}
              key={item.value}
              onClick={() =>
                navigate(`/priority?level=${encodeURIComponent(item.value)}`)
              }
            >
              {item.value}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-4 p-4">
        {todoText.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
          todoText.map((todo) => (
            <TaskCard
              key={todo.id}
              todo={todo}
              onToggle={() => dispatch(toggleTodo(todo.id))}
              onSetPriority={(priority) =>
                dispatch(setPriority({ id: todo.id, priority:priority as PriorityLevel }))
              }
              onEdit={() => {
                setEditTodo(todo);
                form.setValue("task", todo.task);
                setOpen(true);
              }}
              onDelete={() => handleTodoDelete(todo.id)}
            />
          ))
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Add new Todo</Button>
        </DialogTrigger>

        <TodoDialogForm onSubmit={onSubmit} form={form} />
      </Dialog>
    </div>
  );
}
