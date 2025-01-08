// src/redux/extraFundsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  extraFundAmount: "",
  returnInMonths: "",
  paidAmount: "",
  pendingAmount: "",
  nextMonthPayable: "",
  reason: "",
  date: "",
  type: "Pending",
};

const extraFundsSlice = createSlice({
  name: 'extraFunds',
  initialState,
  reducers: {
    setExtraFundsData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetExtraFundsData: () => initialState, // Reset to initial state
  },
});

export const { setExtraFundsData, resetExtraFundsData } = extraFundsSlice.actions;
export default extraFundsSlice.reducer;
