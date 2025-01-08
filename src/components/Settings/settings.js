import React, { useState } from 'react';
import './settings.css';
import GeneralSettings from './generalSettings';
import AdvancesSettings from './advancedSettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general-setting');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general-setting':
                return <GeneralSettings />;
            case 'advanced-settings':
                return <AdvancesSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className="settings-page">
            <div className="tabs1 tabs">
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
