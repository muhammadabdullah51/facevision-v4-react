// src/redux/loanSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  givenLoan: "",
  returnInMonths: "",
  paidAmount: "",
  pendingAmount: "",
  nextMonthPayable: "",
  reason: "",
  date: "",
  status: "Pending",
};

const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    setLoanData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetLoanData: () => initialState, // Reset to initial state
  },
});

export const { setLoanData, resetLoanData } = loanSlice.actions;
export default loanSlice.reducer;
