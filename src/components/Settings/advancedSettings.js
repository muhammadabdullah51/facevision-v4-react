import React, { useState } from 'react';
import './settings.css';
import AttendanceSettings from './Setting_Tabs/attendanceSettings';
import EditorSettings from './Setting_Tabs/editorSettings';
import PayrollSettings from './Setting_Tabs/payrollSettings';

const AdvancesSettings = () => {
    const [activeTab, setActiveTab] = useState('attendance');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'attendance':
                return <AttendanceSettings />;
            case 'payrolls':
                return <PayrollSettings/>;
            case 'editor-settings':
                return <EditorSettings />;
            default:
                return <AttendanceSettings />;
        }
    };

    return (
        <div className="settings-page">
            <div className="tabs" style={{textAlign:'center'}}>
                <button className={`${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Attendance</button>
                <button className={`${activeTab === 'payrolls' ? 'active' : ''}`} onClick={() => setActiveTab('payrolls')}>Payrolls</button>
                {/* <button className={`${activeTab === 'editor-settings' ? 'active' : ''}`} onClick={() => setActiveTab('editor-settings')}>Editor Settings</button> */}
               
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdvancesSettings;
