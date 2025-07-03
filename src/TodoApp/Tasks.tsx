"use client";
import React, { useState, useMemo } from "react";
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
import TaskDialogForm from "./TaskDialogForm";
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
import { FaPlus } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateRangePicker from "./CalanderPicker";
import { IoFilter } from "react-icons/io5";

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
  const todoText = useSelector((state: RootState) => state.todo);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredTodos = useMemo(() => {
    return todoText.filter((todo) => {
      const { searchId, priority, status, startDate, endDate } = filters;

      if (searchId && !todo.id.toString().includes(searchId)) {
        return false;
      }

      if (priority !== "All" && todo.priority !== priority) {
        return false;
      }

      if (status !== "All") {
        if (status === "Done" && !todo.isDone) return false;
        if (status === "Pending" && todo.isDone) return false;
      }

      if (startDate && new Date(todo.timeAndDate) < startDate) {
        return false;
      }
      if (endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999); // Include the entire end day
        if (new Date(todo.timeAndDate) > adjustedEndDate) {
          return false;
        }
      }

      return true;
    });
  }, [todoText, filters]);

  const totalTodos = filteredTodos.length;
  const totalPages = Math.ceil(totalTodos / itemsPerPage);

  const paginatedTodos = useMemo(() => {
     return filteredTodos.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredTodos, currentPage]);


  React.useEffect(() => {
    if(currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    } else if (totalPages === 0) {
        setCurrentPage(1);
    }
  }, [filters, totalPages, currentPage]);


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
      <div className="p-6 bg-neutral-900 min-h-screen flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
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
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
              >
                <IoFilter className="mr-2 size-4" />
                Filter Tasks
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-neutral-800 border-l border-neutral-700 text-white w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-sky-400 text-2xl">
                  Filter Tasks
                </SheetTitle>
              </SheetHeader>
              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="searchId" className="text-neutral-300">
                    Search by Task ID
                  </Label>
                  <Input
                    id="searchId"
                    placeholder="Enter Task ID..."
                    value={filters.searchId}
                    onChange={(e) =>
                      setFilters({ ...filters, searchId: e.target.value })
                    }
                    className="bg-neutral-700 border-neutral-600 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="priority" className="text-neutral-300">
                    Priority
                  </Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) =>
                      setFilters({ ...filters, priority: value })
                    }
                  >
                    <SelectTrigger
                      id="priority"
                      className="w-full mt-2 bg-neutral-700 border-neutral-600"
                    >
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                      <SelectItem value="All">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-neutral-300">
                    Status
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className="w-full mt-2 bg-neutral-700 border-neutral-600"
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-neutral-300">
                    Filter by Creation Date
                  </Label>
                  <div className="mt-2">
                    <DateRangePicker
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      onStartDateChange={(date) =>
                        setFilters({ ...filters, startDate: date })
                      }
                      onEndDateChange={(date) =>
                        setFilters({ ...filters, endDate: date })
                      }
                    />
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      searchId: "",
                      priority: "All",
                      status: "All",
                      startDate: null,
                      endDate: null,
                    });
                    setIsFilterOpen(false);
                  }}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 border-neutral-600"
                >
                  Clear Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 flex flex-col p-4">
          {paginatedTodos.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <TbListSearch className="size-20 text-neutral-600 mb-4" />
              <p className="text-neutral-400 text-xl font-semibold">
                No tasks match your filters.
              </p>
              <p className="text-neutral-500 mt-2">
                Try adjusting your filters or adding new tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {paginatedTodos.map((todo) => (
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
              ))}
            </div>
          )}
        </div>

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