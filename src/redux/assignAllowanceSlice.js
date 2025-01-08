import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  empId: "",
  awlcId: "",
  date: "",
};

const assignAllowanceSlice = createSlice({
  name: 'assignAllowance',
  initialState,
  reducers: {
    setAssignAllowanceData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAssignAllowanceData: () => {
      return initialState;
    },
  },
});

export const { setAssignAllowanceData, resetAssignAllowanceData } = assignAllowanceSlice.actions;
export default assignAllowanceSlice.reducer;
