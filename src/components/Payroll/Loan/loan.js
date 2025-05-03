import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import AssignLoan from "./assignLoan";
import LoanLogs from "./LoanLogs";
// import LoanTable from "./LoanTable";

const Loan = () => {
  const [changeTab, setChangeTab] = useState("Assign Loans");
  const renderTabContent = () => {
    switch (changeTab) {
      // case "Assign Loans":
      //   return <AssignLoan/>
      case "Loans Logs":
        return <LoanLogs/>
      default:
        return (
          <div>
            <AssignLoan />
          </div>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          {/* <button
            className={`${changeTab === "Loans Table" ? "active" : ""}`}
            onClick={() => setChangeTab("Loans Table")}
          >
            <FontAwesomeIcon icon={faTableCells} className="icon" />
            Loans Table
          </button> */}
          <button
            className={`${changeTab === "Assign Loans" ? "active" : ""}`}
            onClick={() => setChangeTab("Assign Loans")}
          >
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Assign Loans
          </button>
          <button
            className={`${changeTab === "Loans Logs" ? "active" : ""}`}
            onClick={() => setChangeTab("Loans Logs")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="icon" /> 
            Loans Logs
          </button>

        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>

    </>
  );
};

export default Loan;
