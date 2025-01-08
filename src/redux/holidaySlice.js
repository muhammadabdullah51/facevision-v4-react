import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    holidayId: "",
    holidayName: "",
    startDate: "",
    endDate: "",
    status: "",
    type: "",
};

const holidaySlice = createSlice({
    name: 'holiday',
    initialState,
    reducers: {
        setHolidayData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetHolidayData: () => {
            return initialState;
        },
    },
});

export const { setHolidayData, resetHolidayData } = holidaySlice.actions;
export default holidaySlice.reducer;
