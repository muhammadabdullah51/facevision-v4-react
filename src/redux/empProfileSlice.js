// features/empProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'table',
  selectedIds: [],
  selectedDeductions: {
    allowances: [],
    bonuses: [],
    taxes: [],
    appraisals: [],
    allowancesRes: [],
    bonusesRes: [],
    taxesRes: [],
    appraisalsRes: [],
  }
};

const empProfileSlice = createSlice({
  name: 'empProfile',
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

export const { setActiveTab, setSelectedIds, setSelectedDeductions, resetState } = empProfileSlice.actions;
export default empProfileSlice.reducer;