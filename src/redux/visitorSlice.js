import { createSlice } from '@reduxjs/toolkit';

const visitorSlice = createSlice({
  name: 'visitor',
  initialState: {
    newVisitor: {},
  },
  reducers: {
    setNewVisitor: (state, action) => {
      state.newVisitor = action.payload; // Update state with payload
    },
  },
});

export const { setNewVisitor } = visitorSlice.actions; // Ensure this is exported
export default visitorSlice.reducer;