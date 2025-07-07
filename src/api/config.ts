// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/api/task`,
  STATS: `${API_BASE_URL}/api/task/stats`,
  LABELS: `${API_BASE_URL}/api/task/labels`,
} as const;

// API utility functions
export const handleAPIError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { data?: { message?: string } } };
    if (responseError.response?.data?.message) {
      return responseError.response.data.message;
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const messageError = error as { message: string };
    return messageError.message;
  }
  return 'An unexpected error occurred';
};

export const createAPIHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});
