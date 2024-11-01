import React, { useState } from "react";
import "./reports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faSitemap, faCog } from "@fortawesome/free-solid-svg-icons";
import Advance_Salary_Reports from "../Tables/Advance_Salary_Reports/advance_salary_report";
import All_Employees_Salary_Report from "../Tables/All_Employee_Salary_Report/all_employee_salary_report";
import Daily_Absent_Report from "../Tables/Daily_Reports/daily_absent";
import Daily_Fulltime_Report from "../Tables/Daily_Reports/daily_fulltime";
import Daily_Late_In_Report from "../Tables/Daily_Reports/daily_late_in";
import Daily_Overtime_Report from "../Tables/Daily_Reports/daily_overtime";
import Daily_Working_Hours_Report from "../Tables/Daily_Reports/daily_working_hours";
import Monthly_Absent_Report from "../Tables/Monthly_Reports/monthly_absent";
import Monthly_Entry_Time_Report from "../Tables/Monthly_Reports/monthly_entry_time";
import Monthly_Fulltime_Report from "../Tables/Monthly_Reports/monthly_fulltime";
import Monthly_Overtime_Report from "../Tables/Monthly_Reports/monthly_overtime";
import Monthly_Report from "../Tables/Monthly_Reports/monthly";
import Absent_Summary_Report from "../Tables/Summary_Report/absent_summary";
import All_Attendance_Summary_Report from "../Tables/Summary_Report/all_attendance_summary";
import Leave_Summary_Report from "../Tables/Summary_Report/leaves_summary";
import Overtime_Summary_Report from "../Tables/Summary_Report/overtime_summary";
import Weekly_Absent_Report from "../Tables/Weekly_Reports/weekly_absent";
import Weekly_Fulltime_Report from "../Tables/Weekly_Reports/weekly_fulltime";
import Weekly_Overtime_Report from "../Tables/Weekly_Reports/weekly_overtime";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [reportSubtype, setReportSubtype] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);

  const reportOptions = {
    daily: [
      "Daily Full time",
      "Daily Working Hours",
      "Daily Overtime",
      "Daily Late In",
      "Daily Absent",
    ],
    weekly: ["Weekly Full time", "Weekly Overtime", "Weekly Absent"],
    monthly: [
      "Monthly",
      "Monthly Entry Time",
      "Monthly Overtime",
      "Monthly Full time",
      "Monthly Absent",
    ],
    summary: [
      "All Attendance Summary",
      "Leaves Summary",
      "Overtime Summary",
      "Absent Summary",
    ],
    "advance-salary": [],
    "all-employee-salary": [],
  };

  const handleDataFromChild = (filteredData) => {
    setData(filteredData);
  };

  const downloadCSV = () => {
    if (data.length === 0) {
      alert("No data available to download!");
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((header) => row[header]));

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableElement = document.querySelector("table"); // Select table directly

    if (!tableElement) {
      console.error("Table element not found");
      return;
    }

    // Use autoTable plugin to create a table in the PDF
    doc.autoTable({
      html: tableElement,
      startY: 20,
    });

    doc.save(`${activeTab}.pdf`);
  };

  //   const handleReportTypeChange = (event) => {
  //     setReportType(event.target.value);
  //     setReportSubtype("");
  //     setActiveTab(event.target.value);
  //   };

  //   const handleReportSubtypeChange = (event) => {
  //     const selectedSubtype = event.target.value;
  //     setReportSubtype(selectedSubtype);
  //     setActiveTab(`${reportType}-${selectedSubtype}`);
  //   };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    setReportSubtype(""); // Clear the subtype
    setActiveTab(event.target.value);
    setData([]); // Clear previous data
  };

  const handleReportSubtypeChange = (event) => {
    setReportSubtype(event.target.value);
    setActiveTab(event.target.value);
    setData([]); // Clear previous data
  };

  const renderContent = () => {
    switch (reportType) {
      case "daily":
        switch (reportSubtype) {
          case "daily-full-time":
            return (
              <Daily_Fulltime_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "daily-working-hours":
            return (
              <Daily_Working_Hours_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "daily-overtime":
            return (
              <Daily_Overtime_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "daily-late-in":
            return (
              <Daily_Late_In_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "daily-absent":
            return (
              <Daily_Absent_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          default:
            return <div>Please select a valid daily report subtype</div>;
        }

      case "weekly":
        switch (reportSubtype) {
          case "weekly-full-time":
            return (
              <Weekly_Fulltime_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "weekly-overtime":
            return (
              <Weekly_Overtime_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "weekly-absent":
            return (
              <Weekly_Absent_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          default:
            return <div>Please select a valid weekly report subtype</div>;
        }

      case "monthly":
        switch (reportSubtype) {
          case "monthly":
            return (
              <Monthly_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "monthly-entry-time":
            return (
              <Monthly_Entry_Time_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "monthly-overtime":
            return (
              <Monthly_Overtime_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "monthly-full-time":
            return (
              <Monthly_Fulltime_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "monthly-absent":
            return (
              <Monthly_Absent_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          default:
            return <div>Please select a valid monthly report subtype</div>;
        }

      case "summary":
        switch (reportSubtype) {
          case "all-attendance-summary":
            return (
              <All_Attendance_Summary_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "leaves-summary":
            return (
              <Leave_Summary_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "overtime-summary":
            return (
              <Overtime_Summary_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          case "absent-summary":
            return (
              <Absent_Summary_Report
                sendDataToParent={handleDataFromChild}
                searchQuery={searchQuery}
              />
            );
          default:
            return <div>Please select a valid summary report subtype</div>;
        }

      case "advance-salary":
        return (
          <Advance_Salary_Reports
            sendDataToParent={handleDataFromChild}
            searchQuery={searchQuery}
          />
        );

      case "all-employee-salary":
        return (
          <All_Employees_Salary_Report
            sendDataToParent={handleDataFromChild}
            searchQuery={searchQuery}
          />
        );

      default:
        return <div>Please select a report type</div>;
    }
  };

  return (
    <div className="department-table">
      <div className="report table-header">
        <div className="report-header">
          <h2>Select Report</h2>
          <div className="report-selector">
            <FontAwesomeIcon
              className="report-selector-icon"
              icon={faFileAlt}
            />
            <select value={reportType} onChange={handleReportTypeChange}>
              <option value="">-- Select a Report --</option>
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="summary">Summary Report</option>
              <option value="advance-salary">Advance Salary Report</option>
              <option value="all-employee-salary">
                All Employee Salary Report
              </option>
            </select>
          </div>

          {reportOptions[reportType]?.length > 0 && (
            <div className="report-selector">
              <FontAwesomeIcon
                className="report-selector-icon"
                icon={faSitemap}
              />
              <select
                value={reportSubtype}
                onChange={handleReportSubtypeChange}
              >
                <option value="">-- Select a Subtype --</option>
                {reportOptions[reportType].map((subtype, index) => (
                  <option
                    key={index}
                    value={subtype.toLowerCase().replace(/ /g, "-")}
                  >
                    {subtype}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="dropdown">
            <button className="generate-report-button">
              <FontAwesomeIcon icon={faCog} className="button-icon" />
              Generate Report
            </button>
            <ul className="dropdown-menu">
              <li onClick={downloadCSV}>Export as CSV</li>
              <li onClick={downloadPDF}>Export as PDF</li>
            </ul>
          </div>
          
        </div>
        <div>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <button type="submit">
              <svg
                width="17"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-labelledby="search"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="input"
              type="text"
            />
            <button
              className="reset"
              type="button" // Change to type="button" to prevent form reset
              onClick={() => setSearchQuery("")} // Clear the input on click
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <div className="report-content">{renderContent()}</div>
    </div>
  );
};

export default Reports;
