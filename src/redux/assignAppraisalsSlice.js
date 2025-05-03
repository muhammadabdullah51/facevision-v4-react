// src/redux/assignAppraisalsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    appr_id: "",
    empId: "",
    assign_date: "",
    status: "",
    desc: "",
};

const assignAppraisalsSlice = createSlice({
    name: 'assignAppraisals',
    initialState,
    reducers: {
        setAssignAppraisalsData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetAssignAppraisalsData: () => initialState, // Reset to initial state
    },
});

export const { setAssignAppraisalsData, resetAssignAppraisalsData } = assignAppraisalsSlice.actions;
export default assignAppraisalsSlice.reducer;
