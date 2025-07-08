import React from 'react';
import type { ComponentType } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// HOC Props Interface
interface WithLoadingAndErrorProps {
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

// Generic HOC for handling loading and error states
function withLoadingAndError<T extends object>(
  WrappedComponent: ComponentType<T>,
  options?: {
    showEmpty?: boolean;
    defaultEmptyMessage?: string;
  }
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithLoadingAndErrorComponent = (props: T & WithLoadingAndErrorProps) => {
    const { isDark } = useTheme();
    const {
      isLoading = false,
      error = null,
      isEmpty = false,
      emptyMessage = options?.defaultEmptyMessage || 'No data available',
      loadingComponent,
      errorComponent,
      ...restProps
    } = props;

    // Loading State
    if (isLoading) {
      return (
        loadingComponent || (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center space-y-4">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                isDark ? 'border-sky-400' : 'border-sky-600'
              }`}></div>
              <p className={`text-sm ${
                isDark ? 'text-neutral-400' : 'text-gray-600'
              }`}>Loading...</p>
            </div>
          </div>
        )
      );
    }

    // Error State
    if (error) {
      return (
        errorComponent || (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className={`text-center p-6 rounded-lg border ${
              isDark 
                ? 'bg-red-900/20 border-red-700' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="text-red-400 text-xl mb-2">⚠️</div>
              <h3 className={`font-semibold mb-2 ${
                isDark ? 'text-red-300' : 'text-red-700'
              }`}>Something went wrong</h3>
              <p className={`text-sm ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>{error.message}</p>
              <button 
                onClick={() => window.location.reload()} 
                className={`mt-4 px-4 py-2 rounded transition-colors ${
                  isDark 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Retry
              </button>
            </div>
          </div>
        )
      );
    }

    // Empty State
    if (options?.showEmpty && isEmpty) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-8">
            <div className={`rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 ${
              isDark ? 'bg-neutral-700/30' : 'bg-gray-100'
            }`}>
              <span className="text-6xl">📭</span>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-neutral-300' : 'text-gray-800'
            }`}>No Data Available</h3>
            <p className={`text-lg ${
              isDark ? 'text-neutral-400' : 'text-gray-600'
            }`}>{emptyMessage}</p>
          </div>
        </div>
      );
    }

    // Render the wrapped component
    return <WrappedComponent {...(restProps as T)} />;
  };

  WithLoadingAndErrorComponent.displayName = `withLoadingAndError(${displayName})`;
  
  return WithLoadingAndErrorComponent;
}

export default withLoadingAndError;
