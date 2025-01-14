// src/redux/employeeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  empId: "",
  fName: "",
  lName: "",
  dptId: "",
  dsgId: "",
  // locId: "",
  xid: "",
  otId: "",
  lvfId: "",
  gender: "",
  email: "",
  joiningDate: "",
  contactNo: "",
  image1: "",
  bankName: "",
  basicSalary: "",
  accountNo: "",
  salaryPeriod: "",
  salaryType: "",
  enableAttendance: false,
  enableOvertime: false,
  enableSchedule: false,
  locIds: []
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetEmployeeData: (state) => {
        return initialState; // Resetting state to initial values
      },
  },
});

export const { setEmployeeData, resetEmployeeData } = employeeSlice.actions;
export default employeeSlice.reducer;
