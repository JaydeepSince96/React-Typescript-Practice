import { Suspense } from "react";
import GlobalSuspense from "@/components/GlobalSuspense";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

interface RouteWrapperProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const RouteWrapper = ({ children, fallbackMessage = "Loading page..." }: RouteWrapperProps) => (
  <GlobalErrorBoundary>
    <Suspense fallback={<GlobalSuspense message={fallbackMessage} />}>
      {children}
    </Suspense>
  </GlobalErrorBoundary>
);

export default RouteWrapper;
