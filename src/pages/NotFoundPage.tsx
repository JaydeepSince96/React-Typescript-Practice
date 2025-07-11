import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/layout/SidebarLayout';
import { useTheme } from '@/contexts/ThemeContext';

const NotFoundPage = memo(() => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleGoHome = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <SidebarLayout>
      <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        isDark ? 'bg-neutral-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-lg w-full text-center">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className={`text-8xl font-bold select-none transition-colors duration-300 ${
              isDark ? 'text-neutral-700' : 'text-gray-300'
            }`}>
              4
              <span className={`inline-block animate-bounce ${
                isDark ? 'text-sky-500' : 'text-blue-500'
              }`}>0</span>
              4
            </div>
            <div className={`absolute inset-0 text-8xl font-bold blur-sm select-none transition-colors duration-300 ${
              isDark ? 'text-sky-500/20' : 'text-blue-500/20'
            }`}>
              4
              <span className="inline-block animate-bounce">0</span>
              4
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Page Not Found
            </h1>
            <p className={`text-lg mb-2 transition-colors duration-300 ${
              isDark ? 'text-neutral-400' : 'text-gray-600'
            }`}>
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-neutral-500' : 'text-gray-500'
            }`}>
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-8">
            <svg
              className={`mx-auto w-32 h-32 transition-colors duration-300 ${
                isDark ? 'text-neutral-600' : 'text-gray-400'
              }`}
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
              className={`px-6 py-3 text-base transition-colors duration-300 ${
                isDark 
                  ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
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
              className={`px-6 py-3 text-base transition-colors duration-300 ${
                isDark 
                  ? 'bg-transparent border-neutral-600 text-white hover:bg-neutral-700' 
                  : 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
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
          <div className={`mt-12 pt-8 border-t transition-colors duration-300 ${
            isDark ? 'border-neutral-700' : 'border-gray-300'
          }`}>
            <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-neutral-300' : 'text-gray-700'
            }`}>Quick Navigation</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className={`text-sm underline transition-colors duration-300 ${
                  isDark ? 'text-sky-400 hover:text-sky-300' : 'text-blue-500 hover:text-blue-400'
                }`}
              >
                All Tasks
              </button>
              <span className={`transition-colors duration-300 ${
                isDark ? 'text-neutral-600' : 'text-gray-400'
              }`}>•</span>
              <button
                onClick={() => navigate('/priority')}
                className={`text-sm underline transition-colors duration-300 ${
                  isDark ? 'text-sky-400 hover:text-sky-300' : 'text-blue-500 hover:text-blue-400'
                }`}
              >
                Priority Tasks
              </button>
              <span className={`transition-colors duration-300 ${
                isDark ? 'text-neutral-600' : 'text-gray-400'
              }`}>•</span>
              <button
                onClick={() => navigate('/chart')}
                className={`text-sm underline transition-colors duration-300 ${
                  isDark ? 'text-sky-400 hover:text-sky-300' : 'text-blue-500 hover:text-blue-400'
                }`}
              >
                Reports
              </button>
            </div>
          </div>

          {/* Fun Easter Egg */}
          <div className="mt-8">
            <p className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-neutral-600' : 'text-gray-500'
            }`}>
              Lost? Don't worry, even the best explorers sometimes take wrong turns! 🧭
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
});

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;
