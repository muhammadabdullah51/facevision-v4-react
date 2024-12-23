import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import formSlice from "./ShiftSlice";
import visitorReducer from "./visitorSlice"
import employeeReducer from './employeeSlice'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'forms'],  
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        forms: formSlice,
        employee: employeeReducer,
        visitor: visitorReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, 
        }),
});

const persistor = persistStore(store);

export { store, persistor };
export default store;
