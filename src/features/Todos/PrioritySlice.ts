import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IPriority {
  priority: string
}

const initialState: IPriority[] = [];

export const prioritySlice = createSlice({
  name: 'priority',
  initialState,
  reducers: {
    addPriority: (state, action: PayloadAction<string>) => {
      const newPriority: IPriority = {
        priority: action.payload
      };
      state.push(newPriority);
    }
  }
});

// Export actions
export const { addPriority } = prioritySlice.actions;

// Export reducer
export default prioritySlice.reducer;
