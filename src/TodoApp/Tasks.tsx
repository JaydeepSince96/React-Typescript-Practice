"use client";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewTodo, deleteTodo, updateTodo } from "@/features/Todos/TodoSlice";
import { formSchema } from "@/schema/TodoFormSchema";
import type { RootState } from "@/store";
import type { ITodo } from "@/features/Todos/TodoSlice";
import { z } from "zod";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskDialogForm from "./common/TaskDialogForm";
import { priorityLabels } from "@/const/const";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { FaPlus } from "react-icons/fa";
import TaskFilterSidebar from "./TaskFilterSidebar";
import TaskList from "./TaskList";

export default function Tasks() {
  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<ITodo | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchId: "",
    priority: "All",
    status: "All",
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allTodos = useSelector((state: RootState) => state.todo);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredTodos = useMemo(() => {
    return allTodos.filter((todo) => {
      const { searchId, priority, status, startDate, endDate } = filters;
      if (searchId && !todo.id.toString().includes(searchId)) return false;
      if (priority !== "All" && todo.priority !== priority) return false;
      if (status !== "All") {
        if (status === "Done" && !todo.isDone) return false;
        if (status === "Pending" && todo.isDone) return false;
      }
      if (startDate && new Date(todo.timeAndDate) < startDate) return false;
      if (endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);
        if (new Date(todo.timeAndDate) > adjustedEndDate) return false;
      }
      return true;
    });
  }, [allTodos, filters]);

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const paginatedTodos = useMemo(() => {
    return filteredTodos.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredTodos, currentPage]);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [filters, totalPages, currentPage]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      startDate: null,
      endDate: null,
    },
  });

  const handleEdit = (todo: ITodo) => {
    setEditTodo(todo);
    form.setValue("task", todo.task);
    form.setValue("startDate", todo.startDate ? new Date(todo.startDate) : null);
    form.setValue("endDate", todo.endDate ? new Date(todo.endDate) : null);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editTodo) {
      dispatch(updateTodo({ id: editTodo.id, task: data.task }));
    } else {
      dispatch(addNewTodo(data));
    }
    form.reset();
    setEditTodo(null);
    setOpen(false);
  };

  const getPriorityButtonClasses = (priorityValue: string) => {
    const baseClasses =
      "m-1 px-4 py-2 rounded-full font-semibold transition-colors duration-200";
    const colorMap: { [key: string]: string } = {
      High:
        "bg-red-700/40 text-red-300 hover:bg-red-600/60 border border-red-700",
      Medium:
        "bg-yellow-700/40 text-yellow-300 hover:bg-yellow-600/60 border border-yellow-700",
      Low:
        "bg-blue-500/40 text-blue-300 hover:bg-blue-500/60 border border-blue-500",
    };
    return `${baseClasses} ${
      colorMap[priorityValue] ||
      "bg-neutral-700 text-neutral-300 hover:bg-neutral-600 border border-neutral-600"
    }`;
  };

  return (
    <SidebarLayout>
      <div className="p-6 bg-neutral-900 min-h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex flex-wrap">
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
          <TaskFilterSidebar
            filters={filters}
            setFilters={setFilters}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />
        </header>

        <main className="flex-1 flex flex-col p-4">
          <TaskList
            tasks={paginatedTodos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setOpen(true);
                setEditTodo(null);
                form.reset();
              }}
              className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-40"
            >
              <FaPlus className="size-4" />
              Add New Task
            </Button>
          </DialogTrigger>
          <TaskDialogForm
            onSubmit={onSubmit}
            form={form}
            isEditing={!!editTodo}
          />
        </Dialog>

        {totalPages > 1 && (
          <footer className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent className="bg-neutral-800 rounded-lg p-2 shadow-inner border border-neutral-700">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </footer>
        )}
      </div>
    </SidebarLayout>
  );
}