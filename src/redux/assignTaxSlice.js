import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  txId: "",
  date: "",
  value: "",
  assignTo: "",
};

const assignTaxSlice = createSlice({
  name: 'assignTax',
  initialState,
  reducers: {
    setAssignTaxData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAssignTaxData: () => {
      return initialState;
    },
  },
});

export const { setAssignTaxData, resetAssignTaxData } = assignTaxSlice.actions;
export default assignTaxSlice.reducer;
