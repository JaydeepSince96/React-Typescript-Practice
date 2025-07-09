import { memo } from 'react';
import { SidebarLayout } from '@/layout/SidebarLayout';
import { useTheme } from '@/contexts/ThemeContext';

interface GlobalSuspenseProps {
  message?: string;
  showLayout?: boolean;
}

const GlobalSuspense = memo<GlobalSuspenseProps>(({ 
  message = 'Loading...', 
  showLayout = true 
}) => {
  const { isDark } = useTheme();

  const LoadingContent = () => (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-neutral-900' : 'bg-gray-50'
    }`}>
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Loading Spinner */}
        <div className="relative">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 transition-colors duration-300 ${
            isDark 
              ? 'border-neutral-600 border-t-sky-500' 
              : 'border-gray-300 border-t-blue-500'
          }`}></div>
          <div className={`absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 opacity-20 transition-colors duration-300 ${
            isDark ? 'border-sky-500' : 'border-blue-500'
          }`}></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{message}</h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-neutral-400' : 'text-gray-600'
          }`}>Please wait while we load your content</p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex space-x-1">
          <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] transition-colors duration-300 ${
            isDark ? 'bg-sky-500' : 'bg-blue-500'
          }`}></div>
          <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] transition-colors duration-300 ${
            isDark ? 'bg-sky-500' : 'bg-blue-500'
          }`}></div>
          <div className={`w-2 h-2 rounded-full animate-bounce transition-colors duration-300 ${
            isDark ? 'bg-sky-500' : 'bg-blue-500'
          }`}></div>
        </div>
      </div>
    </div>
  );

  if (showLayout) {
    return (
      <SidebarLayout>
        <LoadingContent />
      </SidebarLayout>
    );
  }

  return <LoadingContent />;
});

GlobalSuspense.displayName = 'GlobalSuspense';

export default GlobalSuspense;
