import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    leaveFormulaId: "",
    cutCode: "",
    cutRate: "",
};

const lvfSlice = createSlice({
    name: 'leaveFormula',
    initialState,
    reducers: {
        setLvFData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetLvFData: () => {
            return initialState;
        },
    },
});

export const { setLvFData, resetLvFData } = lvfSlice.actions;
export default lvfSlice.reducer;
