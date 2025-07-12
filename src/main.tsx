import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary.tsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <SidebarProvider>
                <App />
                <Toaster richColors position="top-right" theme="system" />
                <ReactQueryDevtools initialIsOpen={false} />
              </SidebarProvider>
            </Provider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  </StrictMode>
);
