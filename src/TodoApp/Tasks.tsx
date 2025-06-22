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
import TodoDialogForm from "./TaskDialogForm";
import { setPriority } from "@/features/Todos/TodoSlice";
import { priorityLabels } from "@/const/const";
import { useNavigate } from "react-router-dom";
import TaskCard from "./TaskCard";
import { type PriorityLevel } from "@/features/Todos/TodoSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { SidebarLayout } from "@/layout/SidebarLayout";

export default function Tasks() {
  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<ITodo | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const todoText = useSelector((text: RootState) => text.todo);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalTodos = todoText.length;
  const totalPages = Math.ceil(totalTodos / itemsPerPage);

  const paginatedTodos = todoText.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <SidebarLayout>
    <div className="p-4">
      <div className="flex gap-2">
        <div className="priority ml-3.5 pb-2.5 pt-2.5 ">
          {priorityLabels.map((item) => (
            <Button
              className="m-2 h-3"
              variant={"destructive"}
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
        {paginatedTodos.length === 0 ? (
          <p>No Tasks yet.</p>
        ) : (
          paginatedTodos.map((todo) => (
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
              onDelete={() => handleTodoDelete(todo.id)}
            />
          ))
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Add new Task</Button>
        </DialogTrigger>

        <TodoDialogForm onSubmit={onSubmit} form={form} />
      </Dialog>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                  href="#"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination >
      )}
    </div>
    </SidebarLayout>
  );
}
