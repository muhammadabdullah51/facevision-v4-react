// src/redux/breakSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  name: "",
  start_time: "",
  end_time: "",
};

const breakSlice = createSlice({
  name: 'break',
  initialState,
  reducers: {
    setBreakData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetBreakData: () => initialState,  // Reset to initial state
  },
});

export const { setBreakData, resetBreakData } = breakSlice.actions;
export default breakSlice.reducer;
