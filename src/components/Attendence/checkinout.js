import React, { useState } from 'react'
import CheckInOutTable from './CheckInOutTable';
import AttendanceTable from './AttendanceTable';
import BreackInOutTable from './BreackInOutTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCheckCircle, faCoffee } from '@fortawesome/free-solid-svg-icons';


const CheckInOut = () => {
    const [data, setData] = useState([])
    const [changeTab, setChangeTab] = useState("Check In / Out");
    const renderTabContent = () => {
      switch (changeTab) {
        case "Details":
          return <AttendanceTable data = {data} setData = {setData}/>;
        case "Break In / Out":
          return <BreackInOutTable data = {data} setData = {setData}/>;
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
          ><FontAwesomeIcon icon={faInfoCircle} className="icon" />
            Details
          </button>
          <button
            className={`${changeTab === "Check In / Out" ? "active" : ""}`}
            onClick={() => setChangeTab("Check In / Out")}
          ><FontAwesomeIcon icon={faCheckCircle} className="icon" />
            Check In / Out
          </button>
          <button
            className={`${changeTab === "Break In / Out" ? "active" : ""}`}
            onClick={() => setChangeTab("Break In / Out")}
          ><FontAwesomeIcon icon={faCoffee} className="icon" />
            Break In / Out
          </button>
          
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
        </>
    );
}

export default CheckInOut
