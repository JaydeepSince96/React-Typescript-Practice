import React from 'react';
import type { ComponentType } from 'react';

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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
              <p className="text-neutral-400 text-sm">Loading...</p>
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
            <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-700">
              <div className="text-red-400 text-xl mb-2">⚠️</div>
              <h3 className="text-red-300 font-semibold mb-2">Something went wrong</h3>
              <p className="text-red-400 text-sm">{error.message}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center p-6">
            <div className="text-neutral-500 text-6xl mb-4">📭</div>
            <p className="text-neutral-400 text-lg">{emptyMessage}</p>
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
