"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewTodo } from "@/features/Todos/TodoSlice"; 
import { formSchema } from "@/schema/TodoFormSchema";
import type { RootState } from "@/store";
import { z } from "zod";

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TodoDialogForm from "./TodoDialogForm";

export default function Todos() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const todoText = useSelector((text:RootState)=>text.todo)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: "" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    dispatch(addNewTodo(data.task));
    form.reset();
    setOpen(false);
  };

  return (
    <div className="p-4">
        <div className="space-y-4 p-4">
      {todoText.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        todoText.map((todo) => (
          <div key={todo.id} className="border p-3 rounded-md">
            <h4 className="text-lg font-medium">{todo.task}</h4>
            <p className="text-sm text-muted-foreground">
              Added: {new Date(todo.timeAndDate).toLocaleString()}
            </p>
            <p className={`text-sm ${todo.isDone ? "text-green-600" : "text-red-600"}`}>
              {todo.isDone ? "Done" : "Pending"}
            </p>
          </div>
        ))
      )}
    </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Add new Todo</Button>
        </DialogTrigger>

        <TodoDialogForm onSubmit={onSubmit} form={form}/>
      </Dialog>
    </div>
  );
}
