import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import BonusTable from "./BonusTable";
import AssignBonus from "./assignBonus";
import BonusLogs from "./BonusLogs";

const Bonuses = () => {
  const [changeTab, setChangeTab] = useState("Bonuses Table");
  const renderTabContent = () => {
    switch (changeTab) {
      case "Assign Bonuses":
        return <AssignBonus/>
      case "Bonuses Logs":
        return <BonusLogs/>
      default:
        return (
          <div>
            <BonusTable/>
          </div>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`${changeTab === "Bonuses Table" ? "active" : ""}`}
            onClick={() => setChangeTab("Bonuses Table")}
          >
            <FontAwesomeIcon icon={faTableCells} className="icon" />
            Bonuses Table
          </button>
          <button
            className={`${changeTab === "Assign Bonuses" ? "active" : ""}`}
            onClick={() => setChangeTab("Assign Bonuses")}
          >
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Assign Bonuses
          </button>
          <button
            className={`${changeTab === "Bonuses Logs" ? "active" : ""}`}
            onClick={() => setChangeTab("Bonuses Logs")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="icon" /> 
            Bonuses Logs
          </button>

        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>

    </>
  );
};

export default Bonuses;
