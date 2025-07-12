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

// Landing and Auth pages
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteWrapper fallbackMessage="Loading...">
        <LandingPage />
      </RouteWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <RouteWrapper fallbackMessage="Loading registration...">
        <RegisterPage />
      </RouteWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <RouteWrapper fallbackMessage="Loading login...">
        <LoginPage />
      </RouteWrapper>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RouteWrapper fallbackMessage="Loading dashboard...">
        <Tasks />
      </RouteWrapper>
    ),
  },
  {
    path: "/tasks",
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
    path: "/reports",
    element: (
      <RouteWrapper fallbackMessage="Loading reports...">
        <ProductivityReports />
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
    path: "/task-reports",
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
    path: "/completed",
    element: (
      <RouteWrapper fallbackMessage="Loading completed tasks...">
        <Tasks />
      </RouteWrapper>
    ),
  },
  {
    path: "/pending",
    element: (
      <RouteWrapper fallbackMessage="Loading pending tasks...">
        <Tasks />
      </RouteWrapper>
    ),
  },
  {
    path: "/overdue",
    element: (
      <RouteWrapper fallbackMessage="Loading overdue tasks...">
        <Tasks />
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