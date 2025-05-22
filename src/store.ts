import { configureStore } from '@reduxjs/toolkit'
import todoReducer from "./features/Todos/TodoSlice"
import priorityReducer from "./features/Todos/PrioritySlice"

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    priority: priorityReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch