import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formStates: {
    shifts: {},
  },
  selectedItems: {
    shifts: [],
  },
};

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    saveFormState: (state, action) => {
      const { formName, data } = action.payload;
      if (!state.formStates[formName]) {
        state.formStates[formName] = {};
      }
      state.formStates[formName] = { ...state.formStates[formName], ...data };
    },
    saveSelectedItems: (state, action) => {
      const { formName, items } = action.payload;
      if (!state.selectedItems[formName]) {
        state.selectedItems[formName] = [];
      }
      state.selectedItems[formName] = items;
    },
    resetFormState: (state, action) => {
      const { formName } = action.payload;
      state.formStates[formName] = {};
      state.selectedItems[formName] = [];
    },
  },
});

export const { saveFormState, saveSelectedItems, resetFormState } = formSlice.actions;
export default formSlice.reducer;
