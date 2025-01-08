import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  type: "",
  nature: "",
  percent: "",
  amount: "",
  date: "",
};

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    setTaxData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetTaxData: () => {
      return initialState;
    },
  },
});

export const { setTaxData, resetTaxData } = taxSlice.actions;
export default taxSlice.reducer;
