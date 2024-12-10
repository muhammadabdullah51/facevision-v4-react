import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/sidebar';
import Navbar from '../Navbar/navbar';
import './dashboard.css';
import Department from '../Enrollment/Department/department';
import Designation from '../Enrollment/Designation/designation';
import Location from '../Enrollment/Location/location';
import Employee from '../Enrollment/Employees/employees';
import Device from '../Devices/devices';
import Attendance from '../Attendence/attendence';
import Leaves from '../Leaves/leaves';
import ShiftManagement from '../Shift_Managment/shift_managment';
import Bonuses from '../Payroll/Bouneses/bouneses';
import Reports from '../Reports/reports';
import Visitors from '../Visitors/visitors';
import Blocklist from '../Blocklist/blocklist';
import Settings from '../Settings/settings';
import Resign from '../Enrollment/Resign/resign';
import EmployeeProfile from '../Payroll/Employee_Profile/employee_profile'
import PayRollLog from '../Payroll/Payroll_Logs/payroll_log'
import Dashboard from '../Dashboard/dashboard';
import Profile from '../Profile/profile';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdvanceSalary from '../Payroll/Advance_Salary/advance_salary';
import Appraisal from '../Payroll/Appraisal/appraisal';
import Loan from '../Payroll/Loan/loan';
import ExtraFunds from '../Enrollment/ExtraFund/ExtraFunds';
import CheckInOut from '../Attendence/checkinout';
import Allowance from '../Payroll/Allowances/Allowances';
import Tax from '../Payroll/Tax/Tax';
import Breakinout from '../Attendence/breakinout';

const Home = () => {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
    }

    const [selectedMenu, setSelectedMenu] = useState('Dashboard');  
    const handleMenuChange = (menu) => {
        setSelectedMenu(menu);
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Department':
                return <Department />;
            case 'Designation':
                return <Designation />;
            case 'Location':
                return <Location />;
            case 'Employee':
                return <Employee />;
            case 'Resign':
                return <Resign />;
            case 'Devices':
                return <Device />;
            case 'Details':
                return <Attendance />;
            case 'Check In/Out':
                return <CheckInOut />;
            case 'Break In/Out':
                return <Breakinout />;
            case 'Leaves':
                return <Leaves />;
            case 'Shift Management':
                return <ShiftManagement />;
            case 'Bonuses':
                return <Bonuses />;
            case 'Reports':
                return <Reports />;
            case 'Employee Profile':
                return <EmployeeProfile />;
            case 'Payroll Log':
                return <PayRollLog />;
            case 'Advance Salary':
                return <AdvanceSalary />;
            case 'Appraisal':
                return <Appraisal />;
            case 'Loan':
                return <Loan />;
            case 'Allowances':
                return <Allowance />;
            case 'Extra Funds':
                return <ExtraFunds />;
            case 'Taxes':
                return <Tax />;
            case 'Visitors':
                return <Visitors />;
            case 'Block Employee':
                return <Blocklist />;
            case 'Settings':
                return <Settings />;
            case 'Profile':
                return <Profile />;
            default:
                return <p>Select a menu item from the sidebar to see the content.</p>;
        }
    };
    const handleSettingMenu = (menu) => {
        setSelectedMenu(menu);
    };

  

    return (
        <div className="dashboard">
            <Sidebar onMenuChange={handleMenuChange} />
            <div className="dashboard-content">
                <Navbar onMenuChange={handleSettingMenu} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Home;
