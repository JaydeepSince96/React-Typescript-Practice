import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllTasks, useDeleteTask } from "@/hooks/useApiHooks";
import {
  useSubtasks,
  useToggleSubtask,
  useDeleteSubtask,
  useSubtaskStats,
} from "@/hooks/useSubtaskHooks";
import type { ISubtask } from "@/api/types";

export const useTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch task and subtasks data
  const {
    data: allTasks,
    isLoading: taskLoading,
    error: taskError,
  } = useGetAllTasks();
  const task = allTasks?.find((t) => t._id === id);
  const { data: subtasks = [], isLoading: subtasksLoading } = useSubtasks(
    id || ""
  );
  const { data: subtaskStats } = useSubtaskStats(id || "");

  // Mutations
  const toggleSubtaskMutation = useToggleSubtask();
  const deleteSubtaskMutation = useDeleteSubtask();
  const deleteTaskMutation = useDeleteTask();

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<ISubtask | undefined>(
    undefined
  );
  const [taskEditDialogOpen, setTaskEditDialogOpen] = useState(false);

  // Confirmation dialog states
  const [taskDeleteDialogOpen, setTaskDeleteDialogOpen] = useState(false);
  const [subtaskDeleteDialogOpen, setSubtaskDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate paginated subtasks
  const { paginatedSubtasks, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = subtasks.slice(startIndex, endIndex);
    const total = Math.ceil(subtasks.length / itemsPerPage);

    return {
      paginatedSubtasks: paginated,
      totalPages: total,
      totalCount: subtasks.length,
    };
  }, [subtasks, currentPage, itemsPerPage]);

  return {
    // Data
    id,
    task,
    subtasks,
    subtaskStats,
    paginatedSubtasks,
    totalPages,
    currentPage,
    itemsPerPage,
    
    // Loading and error states
    taskLoading,
    taskError,
    subtasksLoading,
    
    // Dialog states
    dialogOpen,
    editingSubtask,
    taskEditDialogOpen,
    taskDeleteDialogOpen,
    subtaskDeleteDialogOpen,
    itemToDelete,
    
    // Mutations
    toggleSubtaskMutation,
    deleteSubtaskMutation,
    deleteTaskMutation,
    
    // Setters
    setDialogOpen,
    setEditingSubtask,
    setTaskEditDialogOpen,
    setTaskDeleteDialogOpen,
    setSubtaskDeleteDialogOpen,
    setItemToDelete,
    setCurrentPage,
    
    // Navigation
    navigate,
  };
};
