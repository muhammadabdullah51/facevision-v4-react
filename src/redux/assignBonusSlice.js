// src/redux/assignBonusSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  bonusId: "",
  bonusAssignDate: "",
};

const assignBonusSlice = createSlice({
  name: 'assignBonus',
  initialState,
  reducers: {
    setAssignBonusData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAssignBonusData: () => initialState, // Reset to initial state
  },
});

export const { setAssignBonusData, resetAssignBonusData } = assignBonusSlice.actions;
export default assignBonusSlice.reducer;
