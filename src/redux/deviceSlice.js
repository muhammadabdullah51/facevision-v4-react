import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cameraId: null,
    cameraName: "",
    cameraIp: "",
    port: "",
};

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        setHDeviceData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetHDeviceData: () => {
            return initialState;
        },
    },
});

export const { setHDeviceData, resetHDeviceData } = deviceSlice.actions;
export default deviceSlice.reducer;
