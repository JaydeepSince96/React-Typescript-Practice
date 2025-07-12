import { API_BASE_URL, createAPIHeaders, handleAPIError } from '@/api/config';
import type { IAPIResponse } from '@/api/types';

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  weeklyReports: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface UserPreferencesResponse {
  preferences: UserPreferences;
}

export const userPreferencesAPI = {
  // Get user preferences
  getPreferences: async (): Promise<IAPIResponse<UserPreferencesResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
        method: 'GET',
        headers: createAPIHeaders(true),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        data: {} as UserPreferencesResponse,
        message: handleAPIError(error),
      };
    }
  },

  // Update user preferences
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<IAPIResponse<UserPreferencesResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: createAPIHeaders(true),
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        data: {} as UserPreferencesResponse,
        message: handleAPIError(error),
      };
    }
  },
};
