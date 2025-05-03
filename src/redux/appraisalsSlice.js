// src/redux/appraisalsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  name: "",
  created_date: "",
  appraisal_amount: "",
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
