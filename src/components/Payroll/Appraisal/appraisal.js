import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import AppraisalTable from "./AppraisalTable";
import AppraisalLogs from "./AppraisalLogs";
import AssignAppraisal from "./assignAppraisal";

const Appraisal = () => {
  const [changeTab, setChangeTab] = useState("Appraisals Table");
  const renderTabContent = () => {
    switch (changeTab) {
      case "Assign Appraisals":
        return <AssignAppraisal/>
      case "Appraisals Logs":
        return <AppraisalLogs/>
      default:
        return (
          <div>
            <AppraisalTable/>
          </div>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`${changeTab === "Appraisals Table" ? "active" : ""}`}
            onClick={() => setChangeTab("Appraisals Table")}
          >
            <FontAwesomeIcon icon={faTableCells} className="icon" />
            Create Appraisals
          </button>
          <button
            className={`${changeTab === "Assign Appraisals" ? "active" : ""}`}
            onClick={() => setChangeTab("Assign Appraisals")}
          >
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Assign Appraisals
          </button>
          <button
            className={`${changeTab === "Appraisals Logs" ? "active" : ""}`}
            onClick={() => setChangeTab("Appraisals Logs")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="icon" /> 
            Appraisals Logs
          </button>

        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>

    </>
  );
};

export default Appraisal;
