
// src/redux/advanceSalarySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  empId: "",
  amount: "",
  reason: "",
  date: "",
};

const advanceSalarySlice = createSlice({
  name: 'advanceSalary',
  initialState,
  reducers: {
    setAdvanceSalaryData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAdvanceSalaryData: () => initialState, // Reset to initial state
  },
});

export const { setAdvanceSalaryData, resetAdvanceSalaryData } = advanceSalarySlice.actions;
export default advanceSalarySlice.reducer;
