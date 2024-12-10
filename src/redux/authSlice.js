import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        userInfo: null,
        token: null, 
    },
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            // Store the entire user object in userInfo
            state.userInfo = {
                id: action.payload.id,
                username: action.payload.username,
                email: action.payload.email,
                phoneNumber: action.payload.phoneNumber,
                profilePicture: action.payload.profilePicture,
            };
            state.token = action.payload.token; // Store token
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userInfo = null;
            state.token = null; // Clear token
            localStorage.removeItem('token');  // Optionally clear token from storage
        },
        setAuthToken: (state, action) => {
            // Update or set the authToken
            state.authToken = {
                cmpId: action.payload.cmpId,
                accessToken: action.payload.accessToken,
            };
        },
        clearAuthToken: (state) => {
            // Clear the authToken
            state.authToken = null;
        },
    },
});

export const { login, logout, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
