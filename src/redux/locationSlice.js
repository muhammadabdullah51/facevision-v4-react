// src/redux/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locId: null,
  locCode: "",
  name: "",
  deviceQty: "",
  empQty: "",
  resignQty: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetLocationData: () => {
      return initialState;
    },
  },
});

export const { setLocationData, resetLocationData } = locationSlice.actions;
export default locationSlice.reducer;
