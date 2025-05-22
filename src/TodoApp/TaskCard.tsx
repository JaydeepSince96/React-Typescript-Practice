import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { toggleTodo } from '@/features/Todos/TodoSlice';


const TaskCard = () => {
    const dispatch = useDispatch()
  return (
    <div>
      <div className="space-y-4 p-4">
        {todoText.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
          todoText.map((todo) => (
            <div
              key={todo.id}
              className="border p-3 rounded-md flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-2">
                <Input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => dispatch(toggleTodo(todo.id))}
                  className="mt-1"
                />
                <div>
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
                </div>
                
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskCard