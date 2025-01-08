// src/redux/leaveSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  employee: "",
  leave_type: "",
  start_date: "",
  end_date: "",
  reason: "",
  status: "Pending", // Default status
  created_at: "",
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setLeaveData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetLeaveData: () => initialState,  // Reset to initial state
  },
});

export const { setLeaveData, resetLeaveData } = leaveSlice.actions;
export default leaveSlice.reducer;
