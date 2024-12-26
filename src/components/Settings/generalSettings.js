import React, { useState } from 'react';
import './settings.css';

import AttendancePolicy from './Setting_Tabs/AttendancePolicy';
import Users from './Setting_Tabs/Users/users';
import LeaveSettings from './Setting_Tabs/LeaveSettings';
import OvertimeSettings from './Setting_Tabs/OvertimeSettings';
import ShiftSettings from './Setting_Tabs/ShiftSettings';
import User from './Setting_Tabs/User';
import TaxSettings from './Setting_Tabs/taxSettings';
import AllowanceSettings from './Setting_Tabs/allowanceSettings';

const GeneralSettings = () => {
    const [activeTab, setActiveTab] = useState('attendance-policy');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'attendance-policy':
                return <AttendancePolicy />;
            // case 'users':
            //     return <Users/>;
            case 'leave-settings':
                return <LeaveSettings />;
            case 'overtime-settings':
                return <OvertimeSettings />;  
            case 'tax-settings':
                return <TaxSettings />;  
            case 'allowance-settings':
                return <AllowanceSettings />;  
            default:
                return <AttendancePolicy />;
        }
    };

    return (
        <div className="settings-page">
            <div className="tabs" style={{textAlign:'center'}}>
                <button className={`${activeTab === 'attendance-policy' ? 'active' : ''}`} onClick={() => setActiveTab('attendance-policy')}>Attendance Policy</button>
                <button className={`${activeTab === 'leave-settings' ? 'active' : ''}`} onClick={() => setActiveTab('leave-settings')}>Leaves Formula</button>
                <button className={`${activeTab === 'overtime-settings' ? 'active' : ''}`} onClick={() => setActiveTab('overtime-settings')}>Overtime Formula</button>
                <button className={`${activeTab === 'tax-settings' ? 'active' : ''}`} onClick={() => setActiveTab('tax-settings')}>Taxes</button>
                <button className={`${activeTab === 'allowance-settings' ? 'active' : ''}`} onClick={() => setActiveTab('allowance-settings')}>Allowances</button>
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default GeneralSettings;
