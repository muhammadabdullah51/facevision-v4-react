import React, { useState } from 'react'
import CheckInOutTable from './CheckInOutTable';
import AttendanceTable from './AttendanceTable';
import Attendance from './attendence';

const CheckInOut = () => {
    const [data, setData] = useState([])
    const [changeTab, setChangeTab] = useState("Check In / Out");
    const renderTabContent = () => {
      switch (changeTab) {
        case "Details":
          return <AttendanceTable data = {data} setData = {setData}/>;
        default:
          return (
            <div>
              <CheckInOutTable data = {data} setData = {setData} />
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
          
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
        </>
    );
}

export default CheckInOut
