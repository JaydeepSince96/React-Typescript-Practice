import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import RouteWrapper from "@/components/RouteWrapper";
import NotFoundPage from "@/pages/NotFoundPage";
import ErrorAndLoadingTest from "@/pages/ErrorAndLoadingTest";

// Lazy load components for better performance
const Tasks = lazy(() => import("@/TodoApp/Tasks"));
const Priority = lazy(() => import("@/TodoApp/priority-wise/Priority"));
const ProductivityReports = lazy(() => import("@/TodoApp/reports/ProductivityReports"));
const TaskDetails = lazy(() => import("@/TodoApp/TaskDetails"));
const TaskReport = lazy(() => import("@/TodoApp/reports/TaskReport"));
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteWrapper fallbackMessage="Loading tasks...">
        <Tasks />
      </RouteWrapper>
    ),
  },
  {
    path: "/priority",
    element: (
      <RouteWrapper fallbackMessage="Loading priority tasks...">
        <Priority />
      </RouteWrapper>
    ),
  },
  {
    path: "/chart",
    element: (
      <RouteWrapper fallbackMessage="Loading charts...">
        <ProductivityReports />
      </RouteWrapper>
    ),
  },
  {
    path: "/tasks",
    element: (
      <RouteWrapper fallbackMessage="Loading task reports...">
        <TaskReport />
      </RouteWrapper>
    ),
  },
  {
    path: "/task/:id",
    element: (
      <RouteWrapper fallbackMessage="Loading task details...">
        <TaskDetails />
      </RouteWrapper>
    ),
  },
  {
    path: "/test",
    element: <ErrorAndLoadingTest />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);