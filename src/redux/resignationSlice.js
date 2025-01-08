// src/redux/resignationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resignId: "",
  employee: "",
  date: "",
  reason: "",
};

const resignationSlice = createSlice({
  name: "resignation",
  initialState,
  reducers: {
    setResignationData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetResignationData: () => {
      return initialState;
    },
  },
});

export const { setResignationData, resetResignationData } = resignationSlice.actions;
export default resignationSlice.reducer;
