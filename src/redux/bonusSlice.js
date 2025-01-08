// src/redux/bonusSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  bonusName: "",
  bonusDuration: "",
  bonusAmount: "",
  bonusDate: "",
};

const bonusSlice = createSlice({
  name: 'bonus',
  initialState,
  reducers: {
    setBonusData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetBonusData: () => initialState, // Reset to initial state
  },
});

export const { setBonusData, resetBonusData } = bonusSlice.actions;
export default bonusSlice.reducer;
