import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import AssignTax from "./assignTax";
import TaxLogs from "./TaxLogs";
import TaxTable from "./TaxTable";


const Appraisal = () => {
  const [changeTab, setChangeTab] = useState("Tax Table");
  const renderTabContent = () => {
    switch (changeTab) {
      case "Assign Tax":
        return <AssignTax/>
      case "Tax Logs":
        return <TaxLogs/>
      default:
        return (
          <div>
            <TaxTable/>
          </div>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`${changeTab === "Tax Table" ? "active" : ""}`}
            onClick={() => setChangeTab("Tax Table")}
          >
            <FontAwesomeIcon icon={faTableCells} className="icon" />
            Create Tax
          </button>
          <button
            className={`${changeTab === "Assign Tax" ? "active" : ""}`}
            onClick={() => setChangeTab("Assign Tax")}
          >
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Assign Tax
          </button>
          <button
            className={`${changeTab === "Tax Logs" ? "active" : ""}`}
            onClick={() => setChangeTab("Tax Logs")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="icon" /> 
            Tax Logs
          </button>

        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>

    </>
  );
};

export default Appraisal;
