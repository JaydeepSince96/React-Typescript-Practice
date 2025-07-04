// src/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Tasks from "@/TodoApp/Tasks";
import Priority from "@/TodoApp/priority-wise/Priority";
import ProductivityReports from "@/TodoApp/reports/ProductivityReports";
import TaskDetails from "@/TodoApp/TaskDetails";
import TaskReport from "@/TodoApp/reports/TaskReport"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Tasks />,
  },
  {
    path: "/priority",
    element: <Priority />,
  },
  {
    path: "/chart",
    element: <ProductivityReports />,
  },
  {
    path: "/tasks",
    element: <TaskReport />,
  },
  {
    path: "/task/:id",
    element: <TaskDetails />,
  },
]);