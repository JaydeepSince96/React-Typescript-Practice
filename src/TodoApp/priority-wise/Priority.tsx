import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@/utils/useQuery";
import { useNavigate } from "react-router-dom";

import { toggleTodo, setPriority, deleteTodo, updateTodo } from "@/features/Todos/TodoSlice";
import type { RootState } from "@/store";
import type { ITodo, PriorityLevel } from "@/features/Todos/TodoSlice";

import { formSchema } from "@/schema/TodoFormSchema";
import { z } from "zod";

import TaskCard from "../TaskCard";
import { Dialog} from "@/components/ui/dialog";
import TodoDialogForm from "../TodoDialogForm";
import { Button } from "@/components/ui/button";


const Priority: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();
  const currentPriority = query.get("level") as PriorityLevel;

  const todos = useSelector((state: RootState) => state.todo);
  const filteredTodos = todos.filter((todo) => todo.priority === currentPriority);

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
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Todos with Priority: <span className="capitalize">{currentPriority}</span>
      </h2>
      <div>
        <Button variant={"outline"} onClick={()=>navigate("/")} >Back</Button>
      </div>

      {filteredTodos.length === 0 ? (
        <p>No todos with this priority.</p>
      ) : (
        filteredTodos.map((todo) => (
          <TaskCard
            key={todo.id}
            todo={todo}
            onToggle={() => dispatch(toggleTodo(todo.id))}
            onSetPriority={(priority) =>
              dispatch(setPriority({ id: todo.id, priority: priority as PriorityLevel }))
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

      <Dialog open={open} onOpenChange={setOpen}>
        <TodoDialogForm onSubmit={onSubmit} form={form} />
      </Dialog>
    </div>
  );
};

export default Priority;
