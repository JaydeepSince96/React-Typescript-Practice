import type {
  ISubtask,
  ICreateSubtaskPayload,
  IUpdateSubtaskPayload,
  ISubtaskStats,
  IAPIResponse
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Create a new subtask for a task
export const createSubtask = async (
  taskId: string,
  payload: ICreateSubtaskPayload
): Promise<ISubtask> => {
  // Format dates to ISO strings before sending
  const formattedPayload = {
    ...payload,
    startDate: payload.startDate?.toISOString(),
    endDate: payload.endDate?.toISOString(),
  };

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create subtask: ${response.statusText}`);
  }

  const result: IAPIResponse<ISubtask> = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to create subtask');
  }

  return result.data;
};

// Get all subtasks for a task
export const getSubtasksByTaskId = async (taskId: string): Promise<ISubtask[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`);

  if (!response.ok) {
    throw new Error(`Failed to fetch subtasks: ${response.statusText}`);
  }

  const result: IAPIResponse<ISubtask[]> = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch subtasks');
  }

  return result.data;
};

// Get a specific subtask by ID
export const getSubtaskById = async (subtaskId: string): Promise<ISubtask> => {
  const response = await fetch(`${API_BASE_URL}/subtasks/${subtaskId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch subtask: ${response.statusText}`);
  }

  const result: IAPIResponse<ISubtask> = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch subtask');
  }

  return result.data;
};

// Update a subtask
export const updateSubtask = async (
  subtaskId: string,
  payload: IUpdateSubtaskPayload
): Promise<ISubtask> => {
  // Format dates to ISO strings before sending
  const formattedPayload = {
    ...payload,
    startDate: payload.startDate?.toISOString(),
    endDate: payload.endDate?.toISOString(),
  };

  const response = await fetch(`${API_BASE_URL}/subtasks/${subtaskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update subtask: ${response.statusText}`);
  }

  const result: IAPIResponse<ISubtask> = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to update subtask');
  }

  return result.data;
};

// Toggle subtask completion status
export const toggleSubtask = async (subtaskId: string): Promise<ISubtask> => {
  console.log('🌐 API: Calling toggle for subtask:', subtaskId);
  
  const response = await fetch(`${API_BASE_URL}/subtasks/${subtaskId}/toggle`, {
    method: 'PATCH',
  });

  console.log('🌐 API: Toggle response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🌐 API: Toggle failed:', errorText);
    throw new Error(`Failed to toggle subtask: ${response.statusText}`);
  }

  const result: IAPIResponse<ISubtask> = await response.json();
  console.log('🌐 API: Toggle result:', result);
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to toggle subtask');
  }

  console.log('🌐 API: Returning subtask:', result.data);
  return result.data;
};

// Delete a subtask
export const deleteSubtask = async (subtaskId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/subtasks/${subtaskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete subtask: ${response.statusText}`);
  }

  const result: IAPIResponse<{ message: string }> = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to delete subtask');
  }
};

// Get subtask statistics for a task
export const getSubtaskStats = async (taskId: string): Promise<ISubtaskStats> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks/stats`);

  if (!response.ok) {
    throw new Error(`Failed to fetch subtask stats: ${response.statusText}`);
  }

  const result: IAPIResponse<ISubtaskStats> = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch subtask stats');
  }

  return result.data;
};
