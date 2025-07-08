import { API_ENDPOINTS, createAPIHeaders, handleAPIError } from '../config';
import type { 
  ITask, 
  ILabelOption, 
  ICreateTaskPayload, 
  IUpdateTaskPayload, 
  IAPIResponse,
  TaskLabel
} from '../types';

// Task API functions
export const taskAPI = {
  // Get all tasks
  getAllTasks: async (): Promise<ITask[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: 'GET',
        headers: createAPIHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IAPIResponse<ITask[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch tasks');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(handleAPIError(error));
    }
  },

  // Get label options
  getLabelOptions: async (): Promise<ILabelOption[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.LABELS, {
        method: 'GET',
        headers: createAPIHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IAPIResponse<ILabelOption[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch label options');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching label options:', error);
      throw new Error(handleAPIError(error));
    }
  },

  // Create a new task
  createTask: async (payload: ICreateTaskPayload): Promise<ITask> => {
    try {
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: 'POST',
        headers: createAPIHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IAPIResponse<ITask> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create task');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error(handleAPIError(error));
    }
  },

  // Update a task
  updateTask: async (id: string, payload: IUpdateTaskPayload): Promise<ITask> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        method: 'PUT',
        headers: createAPIHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IAPIResponse<ITask> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update task');
      }

      return result.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error(handleAPIError(error));
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        method: 'DELETE',
        headers: createAPIHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Note: Backend returns 204 No Content for successful deletion
      // We don't need to parse JSON for 204 responses
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error(handleAPIError(error));
    }
  },

  // Toggle task completion
  toggleTaskCompletion: async (id: string, completed: boolean): Promise<ITask> => {
    return taskAPI.updateTask(id, { completed });
  },

  // Update task label
  updateTaskLabel: async (id: string, label: TaskLabel): Promise<ITask> => {
    return taskAPI.updateTask(id, { label });
  },

  // Update task due date
  updateTaskDueDate: async (id: string, dueDate: string): Promise<ITask> => {
    return taskAPI.updateTask(id, { dueDate });
  },

  // Get filtered tasks
  getFilteredTasks: async (filters: {
    searchId?: string;
    priority?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    tasks: ITask[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.searchId) queryParams.append('searchId', filters.searchId);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const url = `${API_ENDPOINTS.TASKS}/filtered${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🚀 API call:', {
        filters,
        url,
        queryParams: queryParams.toString()
      });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createAPIHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IAPIResponse<{
        tasks: ITask[];
        pagination: {
          totalCount: number;
          totalPages: number;
          currentPage: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }> = await response.json();
      
      console.log('✅ API response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch filtered tasks');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching filtered tasks:', error);
      throw new Error(handleAPIError(error));
    }
  },

  // Get single task by ID
  getTaskById: async (id: string): Promise<ITask> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        method: 'GET',
        headers: createAPIHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IAPIResponse<ITask> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch task');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error(handleAPIError(error));
    }
  },
};

// Export individual functions for easier importing
export const {
  getAllTasks,
  getLabelOptions,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  updateTaskLabel,
  updateTaskDueDate,
  getFilteredTasks,
  getTaskById,
} = taskAPI;