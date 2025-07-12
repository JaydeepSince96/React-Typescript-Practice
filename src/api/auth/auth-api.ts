import { API_BASE_URL, createAPIHeaders, handleAPIError } from '../config';

// Authentication API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  googleId?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: createAPIHeaders(false), // No auth needed for registration
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Making login API request to:', `${API_BASE_URL}/api/auth/login`);
      console.log('Login data:', { email: data.email, password: '[HIDDEN]' });
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: createAPIHeaders(false), // No auth needed for login
        body: JSON.stringify(data),
      });

      console.log('Login response status:', response.status);
      const result = await response.json();
      console.log('Login response data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Refresh access token
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: createAPIHeaders(false), // No auth needed for token refresh
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Token refresh failed');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Logout user
  logout: async (refreshToken: string): Promise<APIResponse<null>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          ...createAPIHeaders(),
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Logout failed');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Logout from all devices
  logoutAll: async (): Promise<APIResponse<null>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout-all`, {
        method: 'POST',
        headers: {
          ...createAPIHeaders(),
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Logout failed');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Get user profile
  getProfile: async (): Promise<APIResponse<{ user: User }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'GET',
        headers: createAPIHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get profile');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<APIResponse<{ user: User }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          ...createAPIHeaders(),
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<APIResponse<{ profilePicture: string }>> => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`${API_BASE_URL}/api/auth/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload profile picture');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<APIResponse<null>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          ...createAPIHeaders(),
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to change password');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Delete account
  deleteAccount: async (data: DeleteAccountRequest): Promise<APIResponse<null>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/account`, {
        method: 'DELETE',
        headers: {
          ...createAPIHeaders(),
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete account');
      }

      return result;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Google OAuth - Get login URL
  getGoogleAuthUrl: (): string => {
    return `${API_BASE_URL}/api/auth/google`;
  }
};
