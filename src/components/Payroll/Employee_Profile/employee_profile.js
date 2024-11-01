import React, { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import "../../Enrollment/Department/department.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import PayrollLogs from "../Payroll_Logs/payroll_log";
import AdvanceSalary from "../Advance_Salary/advance_salary";
import Appraisal from "../Appraisal/appraisal";
import Loan from "../Loan/loan";
import ExtraFunds from "../../Enrollment/ExtraFund/ExtraFunds";
import Bonuses from "../Bouneses/bouneses";

const EmplyeeProfile = () => {
  const [data, setData] = useState([
    {
      id: 1,
      employeeId: "E001",
      name: "Ahmad Ali",
      basicSalary: "$3000",
      allottedHours: "160",
      workingHours: "170",
      overtimeHours: "10",
      workingDays: "22",
      bankName: "Bank A",
      extraFund: "$200",
      advanceSalary: "$100",
      accountNo: "1234567890",
      pay: "$3300",
    },
    {
      id: 2,
      employeeId: "E002",
      name: "Fatima Zahra",
      basicSalary: "$2800",
      allottedHours: "160",
      workingHours: "165",
      overtimeHours: "5",
      workingDays: "21",
      bankName: "Bank B",
      extraFund: "$150",
      advanceSalary: "$80",
      accountNo: "9876543210",
      pay: "$2950",
    },
    {
      id: 3,
      employeeId: "E003",
      name: "Muhammad Usman",
      basicSalary: "$3200",
      allottedHours: "160",
      workingHours: "175",
      overtimeHours: "15",
      workingDays: "23",
      bankName: "Bank C",
      extraFund: "$250",
      advanceSalary: "$100",
      accountNo: "1122334455",
      pay: "$3550",
    },
    {
      id: 4,
      employeeId: "E004",
      name: "Aisha Siddiqui",
      basicSalary: "$3100",
      allottedHours: "160",
      workingHours: "172",
      overtimeHours: "12",
      workingDays: "22",
      bankName: "Bank D",
      extraFund: "$180",
      advanceSalary: "$90",
      accountNo: "5566778899",
      pay: "$3380",
    },
    {
      id: 5,
      employeeId: "E005",
      name: "Hamza Khalid",
      basicSalary: "$2900",
      allottedHours: "160",
      workingHours: "168",
      overtimeHours: "8",
      workingDays: "21",
      bankName: "Bank E",
      extraFund: "$220",
      advanceSalary: "$120",
      accountNo: "9988776655",
      pay: "$3140",
    },
    {
      id: 6,
      employeeId: "E006",
      name: "Sara Ahmed",
      basicSalary: "$2800",
      allottedHours: "160",
      workingHours: "166",
      overtimeHours: "6",
      workingDays: "22",
      bankName: "Bank F",
      extraFund: "$170",
      advanceSalary: "$100",
      accountNo: "7766554433",
      pay: "$2970",
    },
    {
      id: 7,
      employeeId: "E007",
      name: "Omar Farooq",
      basicSalary: "$3050",
      allottedHours: "160",
      workingHours: "170",
      overtimeHours: "10",
      workingDays: "23",
      bankName: "Bank G",
      extraFund: "$200",
      advanceSalary: "$80",
      accountNo: "3344556677",
      pay: "$3330",
    },
    {
      id: 8,
      employeeId: "E008",
      name: "Zainab Khan",
      basicSalary: "$2750",
      allottedHours: "160",
      workingHours: "164",
      overtimeHours: "4",
      workingDays: "21",
      bankName: "Bank H",
      extraFund: "$130",
      advanceSalary: "$90",
      accountNo: "6655443322",
      pay: "$2880",
    },
    {
      id: 9,
      employeeId: "E009",
      name: "Bilal Ansari",
      basicSalary: "$2950",
      allottedHours: "160",
      workingHours: "169",
      overtimeHours: "9",
      workingDays: "22",
      bankName: "Bank I",
      extraFund: "$190",
      advanceSalary: "$110",
      accountNo: "4433221100",
      pay: "$3240",
    },
    {
      id: 10,
      employeeId: "E010",
      name: "Hafsa Malik",
      basicSalary: "$3100",
      allottedHours: "160",
      workingHours: "171",
      overtimeHours: "11",
      workingDays: "23",
      bankName: "Bank J",
      extraFund: "$210",
      advanceSalary: "$100",
      accountNo: "1122445566",
      pay: "$3420",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Serial No",
          "Employee ID",
          "Name",
          "Basic Salary",
          "Allotted Working Hours",
          "Working Hours",
          "Overtime Hours",
          "Working Days",
          "Bank Name",
          "Extra Fund",
          "Advance Salary",
          "Account No",
          "Pay",
        ],
      ],
      body: filteredData.map((item, index) => [
        index + 1,
        item.employeeId,
        item.name,
        item.basicSalary,
        item.allottedHours,
        item.workingHours,
        item.overtimeHours,
        item.workingDays,
        item.bankName,
        item.extraFund,
        item.advanceSalary,
        item.accountNo,
        item.pay,
      ]),
    });
    doc.save("employee-profile.pdf");
  };

  const [changeTab, setChangeTab] = useState("Employee Profile");
  const renderTabContent = () => {
    switch (changeTab) {
      case "Payroll Log":
        return <PayrollLogs />;
      case "Advance Salary":
        return <AdvanceSalary />;
      case "Appraisal":
        return <Appraisal />;
      case "Loan":
        return <Loan />;
      case "Extra Funds":
        return <ExtraFunds />;
      case "Bonuses":
        return <Bonuses />;
      default:
        return (
          <div className="department-table">
            <div className="table-header" style={{ paddingBottom: "none" }}>
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
              <div className="export-buttons">
                <button className="export-btn">
                  <CSVLink data={filteredData} filename="employee-profile.csv">
                    <FontAwesomeIcon icon={faFileCsv} className="button-icon" />
                    Export to CSV
                  </CSVLink>
                </button>
                <button className="export-btn" onClick={exportToPDF}>
                  <FontAwesomeIcon icon={faFilePdf} className="button-icon" />
                  Export to PDF
                </button>
              </div>
            </div>

            <div className="departments-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Basic Salary</th>
                    <th>Allotted Working Hours</th>
                    <th>Working Hours</th>
                    <th>Overtime Hours</th>
                    <th>Working Days</th>
                    <th>Bank Name</th>
                    <th>Extra Fund</th>
                    <th>Advance Salary</th>
                    <th>Account No</th>
                    <th>Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.employeeId}</td>
                      <td className="bold-fonts">{item.name}</td>
                      <td>{item.basicSalary}</td>
                      <td>{item.allottedHours}</td>
                      <td className="bold-fonts">{item.workingHours}</td>
                      <td>{item.overtimeHours}</td>
                      <td>{item.workingDays}</td>
                      <td>{item.bankName}</td>
                      <td className="bold-fonts">{item.extraFund}</td>
                      <td>{item.advanceSalary}</td>
                      <td>{item.accountNo}</td>
                      <td className="bold-fonts">{item.pay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`${changeTab === "Employee Profile" ? "active" : ""}`}
            onClick={() => setChangeTab("Employee Profile")}
          >
            Employee Profile
          </button>
          <button
            className={`${changeTab === "Advance Salary" ? "active" : ""}`}
            onClick={() => setChangeTab("Advance Salary")}
          >
            Advance Salary
          </button>
          <button
            className={`${changeTab === "Appraisal" ? "active" : ""}`}
            onClick={() => setChangeTab("Appraisal")}
          >
            Appraisal
          </button>
          <button
            className={`${changeTab === "Loan" ? "active" : ""}`}
            onClick={() => setChangeTab("Loan")}
          >
            Loan
          </button>
          <button
            className={`${changeTab === "Extra Funds" ? "active" : ""}`}
            onClick={() => setChangeTab("Extra Funds")}
          >
            Extra Funds
          </button>
          <button
            className={`${changeTab === "Bonuses" ? "active" : ""}`}
            onClick={() => setChangeTab("Bonuses")}
          >
            Bonuses
          </button>
          {/* <button className={`${activeTab === 'shift-settings' ? 'active' : ''}`} onClick={() => setActiveTab('shift-settings')}>Shift Settings</button> */}
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default EmplyeeProfile;
