import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type PriorityLevel = "High" | "Medium" | "Low";


export interface ITodo {
  id: number;
  task: string;
  isDone: boolean;
  timeAndDate: string;
  priority?: PriorityLevel;
}

const initialState: ITodo[] = [];

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addNewTodo: (state, action: PayloadAction<string>) => {
      const newTodo: ITodo = {
        id: Date.now(),
        task: action.payload,
        isDone: false,
        timeAndDate: new Date().toISOString(),
      };
      state.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) {
        todo.isDone = !todo.isDone;
      }
    },
    updateTodo: (
      state,
      action: PayloadAction<{ id: number; task: string }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.task = action.payload.task;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return state.filter((t) => t.id !== action.payload);
    },

    setPriority: (
      state,
      action: PayloadAction<{ id: number; priority: PriorityLevel }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.priority = action.payload.priority;
      }
    },
  },
});

// Export actions
export const { addNewTodo, updateTodo, toggleTodo, deleteTodo, setPriority } =
  todoSlice.actions;

// Export reducer
export default todoSlice.reducer;
