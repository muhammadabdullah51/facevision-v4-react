import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  name: "",
  email: "",
  sch: "",
  time: "",
  day: [],
  status: "",
};

const editorSettingsSlice = createSlice({
  name: 'editorSettings',
  initialState,
  reducers: {
    setEditorSettingsData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetEditorSettingsData: () => {
      return initialState;
    },
  },
});

export const { setEditorSettingsData, resetEditorSettingsData } = editorSettingsSlice.actions;
export default editorSettingsSlice.reducer;
