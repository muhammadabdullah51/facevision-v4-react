import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import formSlice from "./ShiftSlice";
import visitorReducer from "./visitorSlice"
import employeeReducer from './employeeSlice'
import attendanceFormReducer from './attendanceSlice' 
import departmentReducer from "./departmentSlice";
import designationReducer from "./designationSlice"; 
import locationReducer from "./locationSlice";
import resignationReducer from "./resignationSlice";
import checkinoutReducer from './checkinoutSlice';
import leaveReducer from './leaveSlice';
import breakReducer from './breakSlice';
import workingHoursReducer from './workingHoursSlice';
import advanceSalaryReducer from './advanceSalarySlice';
import appraisalsReducer from './appraisalsSlice';
import loanReducer from './loanSlice';
import extraFundsReducer from './extraFundsSlice';
import bonusReducer from './bonusSlice';
import assignBonusReducer from './assignBonusSlice';
import allowancesReducer from './allowancesSlice';
import assignAllowanceReducer from './assignAllowanceSlice';
import taxReducer from './taxSlice';
import assignTaxReducer from './assignTaxSlice';
import blocklistReducer from './blocklistSlice';
import lvfReducer from './lvfSlice';
import otfReducer from './otfSlice';
import taxSettingReducer from './taxSettingSlice'
import allowanceSettingReducer from './allowanceSettingSlice'
import holidayReducer from './holidaySlice'
import deviceReducer from './deviceSlice'
import editorSettingsReducer from './editorSettingsSlice';


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
        attendance: attendanceFormReducer,
        department: departmentReducer,
        designation: designationReducer,
        location: locationReducer,
        resignation: resignationReducer,
        checkinout: checkinoutReducer,
        leave: leaveReducer,
        break: breakReducer,
        workingHours: workingHoursReducer,
        advanceSalary: advanceSalaryReducer,
        appraisals: appraisalsReducer,
        loan: loanReducer,
        extraFunds: extraFundsReducer,
        bonus: bonusReducer,
        assignBonus: assignBonusReducer,
        allowances: allowancesReducer,
        assignAllowance: assignAllowanceReducer,
        tax: taxReducer,
        assignTax: assignTaxReducer,
        blocklist: blocklistReducer,
        lvf: lvfReducer,
        otf: otfReducer,
        taxSetting : taxSettingReducer,
        allowanceSetting : allowanceSettingReducer,
        holiday : holidayReducer,
        device : deviceReducer,
        editorSettings: editorSettingsReducer,


    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, 
        }),
});

const persistor = persistStore(store);

export { store, persistor };
export default store;
