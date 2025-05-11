// features/completedProfile.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'table',
  selectedIds: [],
 
};

const completedProfile = createSlice({
  name: 'completedProfile',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSelectedIds(state, action) {
      //   state.selectedIds = action.payload;
      // Ensure payload is always array
      state.selectedIds = Array.isArray(action.payload)
        ? [...new Set(action.payload)]
        : [];
    },
    setSelectedDeductions(state, action) {
      state.selectedDeductions = action.payload;
    },
    resetState(state) {
      Object.assign(state, initialState);
    }
  }
});

export const { setActiveTab,  resetState } = completedProfile.actions;
export default completedProfile.reducer;