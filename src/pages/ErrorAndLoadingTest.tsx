import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/layout/SidebarLayout';

const ErrorAndLoadingTest = memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldError, setShouldError] = useState(false);

  const handleLoadingTest = useCallback(async () => {
    setIsLoading(true);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
  }, []);

  const handleErrorTest = useCallback(() => {
    setShouldError(true);
  }, []);

  const handleAsyncErrorTest = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShouldError(true);
  }, []);

  if (shouldError) {
    // Intentionally throw an error to test error boundary
    throw new Error('Test error for error boundary testing');
  }

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-600 border-t-sky-500 mx-auto mb-4"></div>
          <p className="text-white">Loading test in progress...</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Error & Loading Test Page
          </h1>
          
          <div className="bg-neutral-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Global Error Boundary
            </h2>
            <p className="text-neutral-300 mb-4">
              Click the button below to trigger an error and test the global error boundary:
            </p>
            <Button 
              onClick={handleErrorTest}
              variant="destructive"
              className="w-full"
            >
              Trigger Error
            </Button>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Loading States
            </h2>
            <p className="text-neutral-300 mb-4">
              Click the button below to test loading states:
            </p>
            <Button 
              onClick={handleLoadingTest}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Testing Loading...' : 'Test Loading (3s)'}
            </Button>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Async Error
            </h2>
            <p className="text-neutral-300 mb-4">
              Test loading followed by error:
            </p>
            <Button 
              onClick={handleAsyncErrorTest}
              variant="destructive"
              className="w-full"
            >
              Test Async Error
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-neutral-400 text-sm">
              This page is for testing error boundaries and loading states.
              <br />
              Navigate to <a href="/non-existent-page" className="text-sky-400 hover:text-sky-300 underline">
                /non-existent-page
              </a> to test the 404 page.
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
});

ErrorAndLoadingTest.displayName = 'ErrorAndLoadingTest';

export default ErrorAndLoadingTest;
