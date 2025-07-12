import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authAPI } from '@/api/auth/auth-api';
import type { AuthContextType } from '../contexts/AuthContext';

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token refresh interceptor
export const useTokenRefresh = () => {
  const { refreshAuth } = useAuth();
  
  useEffect(() => {
    const handleTokenRefresh = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await authAPI.refreshToken({ refreshToken });
          if (response.success && response.data) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            await refreshAuth();
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    // Set up token refresh interval (every 50 minutes for 1-hour tokens)
    const refreshInterval = setInterval(handleTokenRefresh, 50 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [refreshAuth]);
};
