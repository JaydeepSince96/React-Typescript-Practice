"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewTodo, deleteTodo, toggleTodo } from "@/features/Todos/TodoSlice";
import { formSchema } from "@/schema/TodoFormSchema";
import type { RootState } from "@/store";
import type { ITodo } from "@/features/Todos/TodoSlice";
import { BsFillPencilFill } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { z } from "zod";
import { updateTodo } from "@/features/Todos/TodoSlice";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TodoDialogForm from "./TodoDialogForm";

export default function Todos() {
  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<ITodo | null>(null);

  const dispatch = useDispatch();
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

  function handleTodoDelete(id:number){
      dispatch(deleteTodo(id))
  }
  

  return (
    <div className="p-4">
      <div className="space-y-4 p-4">
        {todoText.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
            todoText.map((todo) => (
                <div
                  key={todo.id}
                  className="border p-3 rounded-md flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={todo.isDone}
                      onChange={() => dispatch(toggleTodo(todo.id))}
                      className="mt-1"
                    />
                    <div>
                      <h4
                        className={`text-lg font-medium ${
                          todo.isDone ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.task}
                      </h4>
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
              
                  <div className="flex items-center gap-3">
                    <BsFillPencilFill
                      className="cursor-pointer"
                      onClick={() => {
                        setEditTodo(todo);
                        form.setValue("task", todo.task);
                        setOpen(true);
                      }}
                    />
                    <MdOutlineDelete
                      className="cursor-pointer"
                      onClick={() => handleTodoDelete(todo.id)}
                    />
                  </div>
                </div>
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
