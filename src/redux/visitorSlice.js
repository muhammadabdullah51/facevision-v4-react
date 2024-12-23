// src/redux/visitorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visitorsId: "",
  fName: "",
  lName: "",
  certificationNo: "",
  createTime: "",
  exitTime: "",
  email: "",
  contactNo: "",
  visitingDept: "",
  host: "",
  cardNumber: "",
  visitingReason: "",
  carryingGoods: "",
};

const visitorSlice = createSlice({
  name: 'visitor',
  initialState,
  reducers: {
    setVisitorData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetVisitorData: (state) => {
      return initialState; // Resetting state to initial values
    },
  },
});

export const { setVisitorData, resetVisitorData } = visitorSlice.actions;
export default visitorSlice.reducer;
