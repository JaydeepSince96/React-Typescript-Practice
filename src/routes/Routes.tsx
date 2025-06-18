
import { createBrowserRouter } from "react-router-dom";
import Tasks from "@/TodoApp/Tasks";
import Priority from "@/TodoApp/priority-wise/Priority";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Tasks/>,
  },
  {
    path: "/priority",
    element: <Priority/>,
  },
]);
