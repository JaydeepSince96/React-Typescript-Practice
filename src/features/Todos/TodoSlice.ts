import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ITodo {
  id: number;
  task: string;
  isDone: boolean;
  timeAndDate: string;
}

const initialState: ITodo[] = [];

export const todoSlice = createSlice({
  name: 'todos',
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
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.isDone = !todo.isDone;
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: number; task: string }>) => {
      const todo = state.find(t => t.id === action.payload.id);
      if (todo) {
        todo.task = action.payload.task;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return state.filter(t => t.id !== action.payload);
    }
  }
});

// Export actions
export const { addNewTodo, updateTodo, toggleTodo, deleteTodo } = todoSlice.actions;

// Export reducer
export default todoSlice.reducer;
