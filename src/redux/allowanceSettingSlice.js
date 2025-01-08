import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    type: "",
};

const allowanceSettingSlice = createSlice({
    name: 'allowanceSetting',
    initialState,
    reducers: {
        setAllowanceSettingData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetAllowanceSettingData: () => {
            return initialState;
        },
    },
});

export const { setAllowanceSettingData, resetAllowanceSettingData } = allowanceSettingSlice.actions;
export default allowanceSettingSlice.reducer;
