import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import AssignAllowance from "./AssignAllowance";
import AllowanceLogs from "./AllowanceLogs";
import AllowanceTable from "./AllowanceTable";

const Allowances = () => {
  const [changeTab, setChangeTab] = useState("Allowance Table");
  const renderTabContent = () => {
    switch (changeTab) {
      case "Assign Allowance":
        return <AssignAllowance/>
      case "Allowance Logs":
        return <AllowanceLogs/>
      default:
        return (
          <div>
            <AllowanceTable/>
          </div>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`${changeTab === "Allowance Table" ? "active" : ""}`}
            onClick={() => setChangeTab("Allowance Table")}
          >
            <FontAwesomeIcon icon={faTableCells} className="icon" />
            Create Allowance
          </button>
          <button
            className={`${changeTab === "Assign Allowance" ? "active" : ""}`}
            onClick={() => setChangeTab("Assign Allowance")}
          >
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Assign Allowance
          </button>
          <button
            className={`${changeTab === "Allowance Logs" ? "active" : ""}`}
            onClick={() => setChangeTab("Allowance Logs")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="icon" /> 
            Allowance Logs
          </button>

        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>

    </>
  );
};

export default Allowances;
