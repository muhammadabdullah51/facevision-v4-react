// src/redux/departmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dptId: "",
  name: "",
  superior: "",
  empQty: "",
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDeptData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetDeptData: () => {
      return initialState; // Resetting state to initial values
    },
  },
});

export const { setDeptData, resetDeptData } = departmentSlice.actions;
export default departmentSlice.reducer;
