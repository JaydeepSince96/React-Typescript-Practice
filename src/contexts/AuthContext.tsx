import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '@/api/auth/auth-api';
import type { User, LoginRequest, RegisterRequest } from '@/api/auth/auth-api';
import { toast } from 'sonner';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Token management
  const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const getStoredTokens = () => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const { accessToken, refreshToken } = getStoredTokens();
      
      if (accessToken && refreshToken) {
        try {
          // Try to get user profile
          const profileResponse = await authAPI.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data.user);
          } else {
            // If profile fetch fails, try to refresh token
            const refreshResponse = await authAPI.refreshToken({ refreshToken });
            if (refreshResponse.success && refreshResponse.data) {
              setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
              setUser(refreshResponse.data.user);
            } else {
              clearTokens();
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          clearTokens();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authAPI.login(data);
      
      if (response.success && response.data) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);
        toast.success(response.message || 'Login successful!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      if (response.success && response.data) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);
        toast.success(response.message || 'Registration successful!');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const { refreshToken } = getStoredTokens();
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
    }
  }, []);

  // Logout all devices function
  const logoutAll = useCallback(async () => {
    try {
      await authAPI.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      clearTokens();
      setUser(null);
      toast.success('Logged out from all devices');
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
    try {
      const response = await authAPI.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success(response.message || 'Profile updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to update profile');
      throw error;
    }
  }, []);

  // Upload profile picture function
  const uploadProfilePicture = useCallback(async (file: File) => {
    try {
      const response = await authAPI.uploadProfilePicture(file);
      
      if (response.success && response.data) {
        // Update user with new profile picture
        setUser(prev => prev ? { ...prev, profilePicture: response.data!.profilePicture } : null);
        toast.success(response.message || 'Profile picture updated successfully');
      } else {
        throw new Error(response.message || 'Failed to upload profile picture');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to upload profile picture');
      throw error;
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await authAPI.changePassword(data);
      
      if (response.success) {
        // Force logout after password change for security
        clearTokens();
        setUser(null);
        toast.success(response.message || 'Password changed successfully. Please login again.');
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to change password');
      throw error;
    }
  }, []);

  // Delete account function
  const deleteAccount = useCallback(async (password: string) => {
    try {
      const response = await authAPI.deleteAccount({ password });
      
      if (response.success) {
        clearTokens();
        setUser(null);
        toast.success(response.message || 'Account deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete account');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to delete account');
      throw error;
    }
  }, []);

  // Refresh authentication
  const refreshAuth = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      clearTokens();
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    uploadProfilePicture,
    changePassword,
    deleteAccount,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
