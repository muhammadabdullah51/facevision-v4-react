import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formStates: {
    attendance: {}, // Attendance-specific initial state
  },
};

const attendanceFormSlice = createSlice({
  name: 'attendanceForms', // Renamed slice
  initialState,
  reducers: {
    setAttendanceData: (state, action) => {
      const { formName = "", data = {} } = action.payload || {};
      if (!formName) {
        // console.error("formName is missing in the payload");
        return;
      }
    
      if (!state.formStates[formName]) {
        state.formStates[formName] = {};
      }
      state.formStates[formName] = { ...state.formStates[formName], ...data };
    },
    resetAttendanceData: (state, action) => {
      const { formName = "" } = action.payload || {};
      if (!formName) {
        // console.error("formName is missing in the payload");
        return;
      }
      state.formStates[formName] = {};
    },
    // setAttendanceData: (state, action) => {
    //   const { formName, data } = action.payload;
    //   if (!state.formStates[formName]) {
    //     state.formStates[formName] = {};
    //   }
    //   state.formStates[formName] = { ...state.formStates[formName], ...data };
    // },
    // resetAttendanceData: (state, action) => {
    //   const { formName } = action.payload;
    //   state.formStates[formName] = {};
    // },
  },
});

export const { setAttendanceData, resetAttendanceData } = attendanceFormSlice.actions;
export default attendanceFormSlice.reducer;



// // src/redux/attendanceSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   allAttendanceId: null,
//   empId: "",
//   employee: "",
//   time_in: "",
//   time_out: "",
//   date: "",
//   attendance_marked: false,
//   status: "Absent",
//   location: "",
// };

// const attendanceSlice = createSlice({
//   name: 'attendance',
//   initialState,
//   reducers: {
//     setAttendanceData: (state, action) => {
//       return { ...state, ...action.payload }; // Merging new data with the existing state
//     },
//     resetAttendanceData: () => {
//       return initialState; // Resetting state to initial values
//     },
//   },
// });

// export const { setAttendanceData, resetAttendanceData } = attendanceSlice.actions;
// export default attendanceSlice.reducer;
