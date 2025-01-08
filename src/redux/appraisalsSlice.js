// src/redux/appraisalsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  appraisal: "",
  reason: "",
  date: "",
  status: "Pending",
  desc: "",
};

const appraisalsSlice = createSlice({
  name: 'appraisals',
  initialState,
  reducers: {
    setAppraisalsData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAppraisalsData: () => initialState, // Reset to initial state
  },
});

export const { setAppraisalsData, resetAppraisalsData } = appraisalsSlice.actions;
export default appraisalsSlice.reducer;
