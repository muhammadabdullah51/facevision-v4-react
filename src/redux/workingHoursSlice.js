// src/redux/workingHoursSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  first_checkin: "",
  last_checkout: "",
  calcHours: '',
  date: "",
};

const workingHoursSlice = createSlice({
  name: 'workingHours',
  initialState,
  reducers: {
    setWorkingHoursData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetWorkingHoursData: () => initialState, // Reset to initial state
  },
});

export const { setWorkingHoursData, resetWorkingHoursData } = workingHoursSlice.actions;
export default workingHoursSlice.reducer;
