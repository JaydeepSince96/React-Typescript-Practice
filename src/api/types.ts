// API Types based on backend models

export type TaskLabel =
  | "low priority"
  | "medium priority"
  | "high priority";

export const TaskLabel = {
  LOW_PRIORITY: "low priority" as TaskLabel,
  MEDIUM_PRIORITY: "medium priority" as TaskLabel,
  HIGH_PRIORITY: "high priority" as TaskLabel
};

export interface ITask {
  _id: string;
  title: string;
  completed: boolean;
  label: TaskLabel;
  startDate: string; // Formatted date string from backend
  dueDate: string; // Formatted date string from backend
  createdAt: string; // Formatted date string from backend
  updatedAt: string; // Formatted date string from backend
}

export interface ISubtask {
  _id: string;
  title: string;
  completed: boolean;
  taskId: string; // Reference to main task
  startDate?: string; // Formatted date string from backend
  endDate?: string; // Formatted date string from backend
  createdAt: string;
  updatedAt: string;
}

export interface ILabelOption {
  value: TaskLabel;
  label: string;
}

export interface ICreateTaskPayload {
  title: string;
  label: TaskLabel;
  startDate: string; // dd/mm/yyyy format
  dueDate: string; // dd/mm/yyyy format
}

export interface IUpdateTaskPayload {
  title?: string;
  completed?: boolean;
  label?: TaskLabel;
  startDate?: string; // dd/mm/yyyy format
  dueDate?: string; // dd/mm/yyyy format
}

export interface ICreateSubtaskPayload {
  title: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IUpdateSubtaskPayload {
  title?: string;
  completed?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface ISubtaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export interface ITaskStats {
  label: TaskLabel;
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  overdue: number;
}

export interface IOverallStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  overallCompletionRate: number;
}

export interface IStatsResponse {
  labelStats: ITaskStats[];
  overallStats: IOverallStats;
}

export interface IAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface IAPIError {
  success: false;
  message: string;
}
