import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    type: "",
};

const taxSettingSlice = createSlice({
    name: 'taxSetting',
    initialState,
    reducers: {
        setTaxSettingData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetTaxSettingData: () => {
            return initialState;
        },
    },
});

export const { setTaxSettingData, resetTaxSettingData } = taxSettingSlice.actions;
export default taxSettingSlice.reducer;
