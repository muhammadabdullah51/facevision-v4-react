import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    blockId: "",
    empId: "",
    blockDate: "",
    blockReason: "",
    allowAttendance: false,
    allowReason: "",
    status: "Blocked",
};

const blocklistSlice = createSlice({
  name: 'blocklist',
  initialState,
  reducers: {
    setblocklistData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetblocklistData: () => {
      return initialState;
    },
  },
});

export const { setblocklistData, resetblocklistData } = blocklistSlice.actions;
export default blocklistSlice.reducer;
