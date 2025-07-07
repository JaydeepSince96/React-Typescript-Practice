import { memo } from 'react';
import { SidebarLayout } from '@/layout/SidebarLayout';

interface GlobalSuspenseProps {
  message?: string;
  showLayout?: boolean;
}

const GlobalSuspense = memo<GlobalSuspenseProps>(({ 
  message = 'Loading...', 
  showLayout = true 
}) => {
  const LoadingContent = () => (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-600 border-t-sky-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-sky-500 opacity-20"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">{message}</h2>
          <p className="text-neutral-400 text-sm">Please wait while we load your content</p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
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
