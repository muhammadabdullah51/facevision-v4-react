import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    OTFormulaId: "",
    OTCode: "",
    ratePerHour: "",
    updateDate: "",
};

const otfSlice = createSlice({
    name: 'otf',
    initialState,
    reducers: {
        setOtfData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetOtfData: () => {
            return initialState;
        },
    },
});

export const { setOtfData, resetOtfData } = otfSlice.actions;
export default otfSlice.reducer;
