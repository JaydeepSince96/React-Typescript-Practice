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
import { FaPlus } from "react-icons/fa"; // For the new "Add New Task" button icon
import { TbListSearch } from "react-icons/tb"; // New icon for "No Tasks"

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

  // Helper function to get priority button classes
  const getPriorityButtonClasses = (priorityValue: string) => {
    const baseClasses =
      "m-1 px-4 py-2 rounded-full font-semibold transition-colors duration-200";
    let colorClasses = "";
    switch (priorityValue) {
      case "High":
        colorClasses =
          "bg-red-700/40 text-red-300 hover:bg-red-600/60 border border-red-700";
        break;
      case "Medium":
        colorClasses =
          "bg-yellow-700/40 text-yellow-300 hover:bg-yellow-600/60 border border-yellow-700";
        break;
      case "Low":
        colorClasses =
          "bg-blue-700/40 text-blue-300 hover:bg-blue-600/60 border border-blue-700";
        break;
      default:
        colorClasses =
          "bg-neutral-700 text-neutral-300 hover:bg-neutral-600 border border-neutral-600";
        break;
    }
    return `${baseClasses} ${colorClasses}`;
  };

  return (
    <SidebarLayout>
      <div className="p-6 bg-neutral-900 min-h-screen">
        <div className="flex justify-start gap-2 mb-6">
          <div className="priority flex flex-wrap">
            {priorityLabels.map((item) => (
              <button
                className={getPriorityButtonClasses(item.value)}
                key={item.value}
                onClick={() =>
                  navigate(`/priority?level=${encodeURIComponent(item.value)}`)
                }
              >
                {item.value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4 min-h-[400px]">
          {" "}
          {/* Added min-height for consistent layout */}
          {paginatedTodos.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <TbListSearch className="size-20 text-neutral-600 mb-4" />
              <p className="text-neutral-400 text-xl font-semibold">
                No tasks yet. Let's get productive!
              </p>
              <p className="text-neutral-500 mt-2">
                Click "Add New Task" to begin organizing your day.
              </p>
            </div>
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
            <Button
              onClick={() => {
                setOpen(true);
                setEditTodo(null); // Clear edit state when opening for new task
                form.reset(); // Reset form when adding new task
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 mt-8 md:mt-0 float-right mr-4" // Floating action button style
            >
              <FaPlus className="size-4" />
              Add New Task
            </Button>
          </DialogTrigger>
          <TodoDialogForm onSubmit={onSubmit} form={form} />
        </Dialog>

        {totalPages > 1 && (
          <Pagination className="mt-12 flex justify-center">
            <PaginationContent className="bg-neutral-800 rounded-lg p-2 shadow-inner border border-neutral-700">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="text-white hover:bg-neutral-700 rounded-md p-2 transition-colors"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                      href="#"
                      className={`text-white mx-1 rounded-md p-2 transition-colors ${
                        page === currentPage
                          ? "bg-sky-600 hover:bg-sky-700"
                          : "hover:bg-neutral-700"
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="text-white hover:bg-neutral-700 rounded-md p-2 transition-colors"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </SidebarLayout>
  );
}
