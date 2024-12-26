import React, { useState } from 'react';
import './settings.css';

import AttendancePolicy from './Setting_Tabs/AttendancePolicy';
import Users from './Setting_Tabs/Users/users';
import LeaveSettings from './Setting_Tabs/LeaveSettings';
import OvertimeSettings from './Setting_Tabs/OvertimeSettings';
import ShiftSettings from './Setting_Tabs/ShiftSettings';
import User from './Setting_Tabs/User';
import GeneralSettings from './generalSettings';
import AdvancesSettings from './advancedSettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general-setting');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general-setting':
                return <GeneralSettings />;
            case 'advanced-settings':
                return <AdvancesSettings/>;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className="settings-page">
            <div className="tabs">
                <button className={`${activeTab === 'general-setting' ? 'active' : ''}`} onClick={() => setActiveTab('general-setting')}>General Settings</button>
                <button className={`${activeTab === 'advanced-settings' ? 'active' : ''}`} onClick={() => setActiveTab('advanced-settings')}>Advanced Settings</button>
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Settings;
