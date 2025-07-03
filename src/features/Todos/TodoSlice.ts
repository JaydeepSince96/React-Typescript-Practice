import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type PriorityLevel = "High" | "Medium" | "Low";

export interface ISubtask {
  id: number;
  text: string;
  isDone: boolean;
}

export interface ITodo {
  id: number;
  task: string;
  isDone: boolean;
  timeAndDate: string;
  priority?: PriorityLevel;
  subtasks: ISubtask[];
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
        subtasks: [],
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
    // Subtask Actions
    addNewSubtask: (
      state,
      action: PayloadAction<{ taskId: number; text: string }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.taskId);
      if (todo) {
        const newSubtask: ISubtask = {
          id: Date.now(),
          text: action.payload.text,
          isDone: false,
        };
        todo.subtasks.push(newSubtask);
      }
    },
    toggleSubtask: (
      state,
      action: PayloadAction<{ taskId: number; subtaskId: number }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.taskId);
      if (todo) {
        const subtask = todo.subtasks.find(
          (st) => st.id === action.payload.subtaskId
        );
        if (subtask) {
          subtask.isDone = !subtask.isDone;
        }
      }
    },
    updateSubtask: (
      state,
      action: PayloadAction<{
        taskId: number;
        subtaskId: number;
        text: string;
      }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.taskId);
      if (todo) {
        const subtask = todo.subtasks.find(
          (st) => st.id === action.payload.subtaskId
        );
        if (subtask) {
          subtask.text = action.payload.text;
        }
      }
    },
    deleteSubtask: (
      state,
      action: PayloadAction<{ taskId: number; subtaskId: number }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.taskId);
      if (todo) {
        todo.subtasks = todo.subtasks.filter(
          (st) => st.id !== action.payload.subtaskId
        );
      }
    },
  },
});

// Export actions
export const {
  addNewTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  setPriority,
  addNewSubtask,
  toggleSubtask,
  updateSubtask,
  deleteSubtask,
} = todoSlice.actions;

// Export reducer
export default todoSlice.reducer;