// src/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Tasks from "@/TodoApp/Tasks";
import Priority from "@/TodoApp/priority-wise/Priority";
import AllCharts from "@/TodoApp/AllChart";
// You'll need to create this TaskDetailPage component
import TaskDetails from "@/TodoApp/TaskDetails";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Tasks/>,
  },
  {
    path: "/priority",
    element: <Priority/>,
  },
  {
    path:"/chart",
    element: <AllCharts/>
  },
  {
    // New route for individual task details
    path: "/task/:id",
    element: <TaskDetails />, // You need to create this component
  }
]);