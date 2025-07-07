import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { SubtaskCheckbox } from "@/components/ui/subtask-checkbox";
import { useGetAllTasks } from "@/hooks/useApiHooks";
import {
  useSubtasks,
  useToggleSubtask,
  useDeleteSubtask,
  useSubtaskStats
} from "@/hooks/useSubtaskHooks";
import {
  IoArrowBack,
  IoTrashOutline,
  IoPencilOutline,
  IoAdd,
  IoStatsChartOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { Dialog } from "@/components/ui/dialog";
import SubtaskDialogForm from "./common/SubtaskDialogForm";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch task and subtasks data
  const { data: allTasks, isLoading: taskLoading, error: taskError } = useGetAllTasks();
  const task = allTasks?.find(t => t._id === id);
  const { data: subtasks = [], isLoading: subtasksLoading } = useSubtasks(id || '');
  const { data: subtaskStats } = useSubtaskStats(id || '');

  // Mutations
  const toggleSubtaskMutation = useToggleSubtask();
  const deleteSubtaskMutation = useDeleteSubtask();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    console.log('🔄 Starting toggle for subtask:', subtaskId);
    console.log('🔄 Current mutation state:', {
      isPending: toggleSubtaskMutation.isPending,
      isError: toggleSubtaskMutation.isError,
      error: toggleSubtaskMutation.error
    });
    
    try {
      console.log('🚀 Calling toggleSubtaskMutation...');
      const result = await toggleSubtaskMutation.mutateAsync(subtaskId);
      console.log('✅ Toggle result:', result);
    } catch (error) {
      console.error('❌ Error toggling subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!id) return;
    
    try {
      await deleteSubtaskMutation.mutateAsync({ subtaskId, taskId: id });
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  if (taskLoading) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent mx-auto mb-4"></div>
          Loading task...
        </div>
      </SidebarLayout>
    );
  }

  if (taskError || !task) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center text-white">
          <p className="text-red-400 mb-4">Failed to load task</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Back
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  const getPriorityClass = (priority: string | undefined) => {
    switch (priority) {
      case "high priority":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "medium priority":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "low priority":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-300 border border-neutral-500/30";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return null;
    }
  };

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-neutral-300 hover:bg-neutral-800 hover:text-sky-400"
          >
            <IoArrowBack className="size-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Task: <span className="text-sky-400">{task._id}</span>
          </h1>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-amber-50">
              {task.title}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-amber-400"
              >
                <IoPencilOutline className="size-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Status:</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  task.completed
                    ? "bg-green-600/20 text-green-400"
                    : "bg-orange-600/20 text-orange-400"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Priority:</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(
                  task.label
                )}`}
              >
                {task.label.charAt(0).toUpperCase() + task.label.slice(1).replace(" priority", " Priority")}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Created:</span>
              <span className="text-neutral-300">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <IoCalendarOutline className="text-neutral-400" />
              <span className="font-bold text-neutral-400">Start:</span>
              <span className="text-neutral-300">
                {new Date(task.startDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <IoCalendarOutline className="text-neutral-400" />
              <span className="font-bold text-neutral-400">Due:</span>
              <span className="text-neutral-300">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Updated:</span>
              <span className="text-neutral-300">
                {new Date(task.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
          <div className="p-6 border-b border-neutral-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-sky-400">Subtasks</h3>
                {subtaskStats && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <IoStatsChartOutline />
                      <span>{subtaskStats.completed}/{subtaskStats.total} completed</span>
                    </div>
                    <div className="px-2 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-medium">
                      {Math.round(subtaskStats.completionRate)}% Complete
                    </div>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleOpenDialog}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium"
              >
                <IoAdd className="mr-2 size-4" />
                Add Subtask
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {subtasksLoading ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400/20 border-t-sky-400 mx-auto mb-4"></div>
                  <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-sky-400/60 animate-ping mx-auto"></div>
                </div>
                <p className="text-neutral-400 font-medium">Loading subtasks...</p>
                <p className="text-neutral-500 text-sm mt-1">Please wait while we fetch your subtasks</p>
              </div>
            ) : subtasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-neutral-700/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <IoAdd className="text-4xl text-neutral-400" />
                </div>
                <h4 className="text-xl font-semibold text-neutral-300 mb-2">No subtasks yet</h4>
                <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                  Break down this task into smaller, manageable subtasks to track your progress more effectively.
                </p>
                <Button 
                  onClick={handleOpenDialog}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-6"
                >
                  <IoAdd className="mr-2 size-4" />
                  Create First Subtask
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {subtasks.map((subtask) => {
                  // Debug: Log subtask data to console
                  console.log('Rendering subtask:', { 
                    id: subtask._id, 
                    title: subtask.title, 
                    completed: subtask.completed,
                    startDate: subtask.startDate,
                    endDate: subtask.endDate
                  });
                  
                  return (
                    <div
                      key={`${subtask._id}-${subtask.completed}-${subtask.updatedAt}`}
                      className="group bg-neutral-700/50 rounded-lg border border-neutral-600/50 transition-all duration-200 hover:bg-neutral-700/70 hover:border-neutral-500/70 hover:shadow-lg"
                    >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 relative">
                          <SubtaskCheckbox
                            checked={subtask.completed}
                            onCheckedChange={(newChecked) => {
                              console.log(`🎯 TaskDetails: Checkbox change for ${subtask._id}: ${subtask.completed} -> ${newChecked}`);
                              handleToggleSubtask(subtask._id);
                            }}
                            disabled={toggleSubtaskMutation.isPending}
                            subtaskId={subtask._id}
                          />
                          {toggleSubtaskMutation.isPending && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4
                              className={`text-base font-medium leading-relaxed transition-all duration-200 ${
                                subtask.completed 
                                  ? "line-through text-neutral-500" 
                                  : "text-neutral-200 group-hover:text-white"
                              }`}
                            >
                              {subtask.title}
                            </h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleOpenDialog}
                                className="text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10 h-8 w-8 transition-all duration-200"
                              >
                                <IoPencilOutline className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteSubtask(subtask._id)}
                                className="text-neutral-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 transition-all duration-200"
                              >
                                <IoTrashOutline className="size-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Date information */}
                          {(subtask.startDate || subtask.endDate) && (
                            <div className="flex items-center gap-4 mb-3 text-sm">
                              <div className="flex items-center gap-2 text-neutral-400">
                                <IoCalendarOutline className="size-4 text-sky-400" />
                                <span className="font-medium">
                                  {subtask.startDate && subtask.endDate ? (
                                    `${formatDate(subtask.startDate)} - ${formatDate(subtask.endDate)}`
                                  ) : subtask.startDate ? (
                                    `Start: ${formatDate(subtask.startDate)}`
                                  ) : subtask.endDate ? (
                                    `Due: ${formatDate(subtask.endDate)}`
                                  ) : null}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Status and metadata */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                  subtask.completed
                                    ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                                    : "bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30"
                                }`}
                              >
                                {subtask.completed ? "Completed" : "In Progress"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                Created {formatDate(subtask.createdAt)}
                              </span>
                              {subtask.completed && subtask.updatedAt !== subtask.createdAt && (
                                <span className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                  Completed {formatDate(subtask.updatedAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <SubtaskDialogForm
          taskId={id!}
          onSuccess={() => setDialogOpen(false)}
          onCancel={() => setDialogOpen(false)}
        />
      </Dialog>
    </SidebarLayout>
  );
};

export default TaskDetails;