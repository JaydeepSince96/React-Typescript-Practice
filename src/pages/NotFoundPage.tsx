import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/layout/SidebarLayout';

const NotFoundPage = memo(() => {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <SidebarLayout>
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-8xl font-bold text-neutral-700 select-none">
              4
              <span className="inline-block animate-bounce text-sky-500">0</span>
              4
            </div>
            <div className="absolute inset-0 text-8xl font-bold text-sky-500/20 blur-sm select-none">
              4
              <span className="inline-block animate-bounce">0</span>
              4
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-neutral-400 text-lg mb-2">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-neutral-500 text-sm">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-8">
            <svg
              className="mx-auto w-32 h-32 text-neutral-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 text-base"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Home
            </Button>
            
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="bg-transparent border-neutral-600 text-white hover:bg-neutral-700 px-6 py-3 text-base"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </Button>
          </div>

          {/* Quick Navigation */}
          <div className="mt-12 pt-8 border-t border-neutral-700">
            <h3 className="text-neutral-300 font-semibold mb-4">Quick Navigation</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="text-sky-400 hover:text-sky-300 text-sm underline"
              >
                All Tasks
              </button>
              <span className="text-neutral-600">•</span>
              <button
                onClick={() => navigate('/priority')}
                className="text-sky-400 hover:text-sky-300 text-sm underline"
              >
                Priority Tasks
              </button>
              <span className="text-neutral-600">•</span>
              <button
                onClick={() => navigate('/chart')}
                className="text-sky-400 hover:text-sky-300 text-sm underline"
              >
                Reports
              </button>
            </div>
          </div>

          {/* Fun Easter Egg */}
          <div className="mt-8 text-xs text-neutral-600">
            <p>Lost? Don't worry, even the best explorers sometimes take wrong turns! 🧭</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
});

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;
