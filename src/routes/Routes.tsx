// src/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Tasks from "@/TodoApp/Tasks";
import Priority from "@/TodoApp/priority-wise/Priority";
import AllCharts from "@/TodoApp/AllChart";
import TaskDetails from "@/TodoApp/TaskDetails";
import TaskReport from "@/TodoApp/TaskReport"; // Import the new component

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
    element: <AllCharts />,
  },
  {
    // This path now correctly points to the new TaskReport component
    path: "/tasks",
    element: <TaskReport />,
  },
  {
    path: "/task/:id",
    element: <TaskDetails />,
  },
]);