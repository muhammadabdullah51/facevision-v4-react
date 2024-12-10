import React, { useState } from 'react'
import CheckInOutTable from './CheckInOutTable';
import AttendanceTable from './AttendanceTable';
import Attendance from './attendence';
import BreackInOutTable from './BreackInOutTable';

const Breakinout = () => {
    const [data, setData] = useState([])
    const [changeTab, setChangeTab] = useState("Break In / Out");
    const renderTabContent = () => {
      switch (changeTab) {
        case "Details":
          return <AttendanceTable data = {data} setData = {setData}/>;
        case "Check In / Out":
          return <CheckInOutTable data = {data} setData = {setData}/>;
        default:
          return (
            <div>
              <BreackInOutTable data = {data} setData = {setData} />
            </div>
          );
      }
    };

    return (
      <>
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`${changeTab === "Details" ? "active" : ""}`}
            onClick={() => setChangeTab("Details")}
          >
            Details
          </button>
          <button
            className={`${changeTab === "Check In / Out" ? "active" : ""}`}
            onClick={() => setChangeTab("Check In / Out")}
          >
            Check In / Out
          </button>
          <button
            className={`${changeTab === "Break In / Out" ? "active" : ""}`}
            onClick={() => setChangeTab("Break In / Out")}
          >
            Break In / Out
          </button>
          
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
        </>
    );
}

export default Breakinout
