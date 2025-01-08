// src/redux/designationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dsgId: null,
  dsgCode: "",
  name: "",
};

const designationSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {
    setDesignationData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetDesignationData: () => {
      return initialState;
    },
  },
});

export const { setDesignationData, resetDesignationData } = designationSlice.actions;
export default designationSlice.reducer;
