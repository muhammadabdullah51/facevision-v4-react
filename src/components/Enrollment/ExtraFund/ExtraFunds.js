import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
// import ExtraFundsTable from "./ExtraFundsTable";
import AssignExtrFunds from "./assignExtraFunds";
import ExtraFundsLogs from "./ExtraFundsLogs";

const ExtraFunds = () => {
  const [changeTab, setChangeTab] = useState("Assign Extra Funds");
  const renderTabContent = () => {
    switch (changeTab) {
      // case "Assign Extra Funds":
      //   return <AssignExtrFunds/>
      case "Extra Funds Logs":
        return <ExtraFundsLogs/>
      default:
        return (
          <div>
            <AssignExtrFunds/>
          </div>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          {/* <button
            className={`${changeTab === "Extra Funds Table" ? "active" : ""}`}
            onClick={() => setChangeTab("Extra Funds Table")}
          >
            <FontAwesomeIcon icon={faTableCells} className="icon" />
            Extra Funds Table
          </button> */}
          <button
            className={`${changeTab === "Assign Extra Funds" ? "active" : ""}`}
            onClick={() => setChangeTab("Assign Extra Funds")}
          >
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Assign Extra Funds
          </button>
          <button
            className={`${changeTab === "Extra Funds Logs" ? "active" : ""}`}
            onClick={() => setChangeTab("Extra Funds Logs")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="icon" /> 
            Extra Funds Logs
          </button>

        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>

    </>
  );
};

export default ExtraFunds;
