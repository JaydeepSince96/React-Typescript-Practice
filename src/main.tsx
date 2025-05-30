import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import { SidebarProvider } from "./components/ui/sidebar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SidebarProvider>
      <App />
      </SidebarProvider>
    </Provider>
  </StrictMode>
);
