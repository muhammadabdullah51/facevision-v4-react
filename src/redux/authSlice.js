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
                password: action.payload.password, // Store password for security purposes
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
        updatePassword: (state, action) => {
            if (state.userInfo) {
                state.userInfo.password = action.payload; // Update password
            }
        },
    },
});

export const { login, logout, setAuthToken, updatePassword  } = authSlice.actions;
export default authSlice.reducer;
