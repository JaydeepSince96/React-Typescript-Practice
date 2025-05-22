
import { createBrowserRouter } from "react-router-dom";
import Todos from "@/TodoApp/Todos";
import Priority from "@/TodoApp/priority-wise/Priority";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Todos/>,
  },
  {
    path: "/priority",
    element: <Priority/>,
  },
]);
