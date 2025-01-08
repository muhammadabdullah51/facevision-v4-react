// src/redux/allowancesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  type: "",
  amount: "",
  date: "",
};

const allowancesSlice = createSlice({
  name: 'allowances',
  initialState,
  reducers: {
    setAllowanceData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAllowanceData: () => initialState,
  },
});

export const { setAllowanceData, resetAllowanceData } = allowancesSlice.actions;
export default allowancesSlice.reducer;
