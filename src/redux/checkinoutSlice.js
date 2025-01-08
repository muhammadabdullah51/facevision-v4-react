// src/redux/checkinoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  fName: "",
  lName: "",
  time: "",
  date: "",
  status: "",
  ip: "",
};

const checkinoutSlice = createSlice({
  name: 'checkinout',
  initialState,
  reducers: {
    setCheckInOutData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetCheckInOutData: () => initialState,  // Reset to initial state
  },
});

export const { setCheckInOutData, resetCheckInOutData } = checkinoutSlice.actions;
export default checkinoutSlice.reducer;
