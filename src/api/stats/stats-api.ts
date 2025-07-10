import { API_ENDPOINTS, createAPIHeaders, handleAPIError } from '../config';
import type { IStatsResponse, IAPIResponse } from '../types';

// Interface for stats filter options
export interface StatsFilterOptions {
  period?: 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
  week?: number;
}

// Stats API functions
export const statsAPI = {
  // Get task statistics with optional filtering
  getTaskStats: async (filters?: StatsFilterOptions): Promise<IStatsResponse> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const url = `${API_ENDPOINTS.STATS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Fetching stats with URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createAPIHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IAPIResponse<IStatsResponse> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch task statistics');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      throw new Error(handleAPIError(error));
    }
  },

  // Test stats endpoint
  testStatsEndpoint: async (): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.STATS}/test`, {
        method: 'GET',
        headers: createAPIHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error testing stats endpoint:', error);
      throw new Error(handleAPIError(error));
    }
  },
};

// Export individual functions for easier importing
export const {
  getTaskStats,
  testStatsEndpoint,
} = statsAPI;
