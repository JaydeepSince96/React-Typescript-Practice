import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toggleTodo } from "@/features/Todos/TodoSlice";
import { Input } from "@/components/ui/input";

export default function Priority() {
  const [searchParams] = useSearchParams();
  const selectedLevel = searchParams.get("level");
  const dispatch = useDispatch()

  const todos = useSelector((state: RootState) => state.todo);

  const filteredTodos = todos.filter((todo) => todo.priority === selectedLevel);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Showing {selectedLevel} Priority Tasks
      </h2>

      {filteredTodos.length === 0 ? (
        <p>No {selectedLevel} priority tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredTodos.map((todo) => (
            // <li
            //   key={todo.id}
            //   className="border p-4 rounded-md flex justify-between items-start"
            // >
            //   <div>
            //     <h3 className="text-lg font-medium">{todo.task}</h3>
            //     <p className="text-sm text-gray-600">
            //       Added: {new Date(todo.timeAndDate).toLocaleString()}
            //     </p>
            //   </div>
            //   <span className="px-2 py-1 text-sm rounded bg-gray-200">
            //     {todo.priority}
            //   </span>
            // </li>
            
            <li
              key={todo.id}
              className="border p-4 rounded-md flex justify-between items-start"
            >
              <Input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => dispatch(toggleTodo(todo.id))}
                  className="mt-1"
                />
              <h4
                className={`text-lg font-medium ${
                  todo.isDone ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.task}
              </h4>
              <p className="text-sm text-muted-foreground">
                Added: {new Date(todo.timeAndDate).toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  todo.isDone ? "text-green-600" : "text-red-600"
                }`}
              >
                {todo.isDone ? "Done" : "Pending"}
              </p>
              </li>
            
          ))}
        </ul>
      )}
    </div>
  );
}
