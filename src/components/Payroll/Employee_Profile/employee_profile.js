import React, { useCallback, useEffect, useState } from "react";
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
import axios from "axios";
import { SERVER_URL } from "../../../config";

const EmplyeeProfile = () => {
  const [data, setData] = useState([
    {
      pysId: "",
      empId: "",
      empName: "",
      otHoursPay:"",
      otHours: "",
      extraFund: "",
      advSalary: "",
      app: "",
      loan: "",
      bonus:"",
      salaryPeriod: "",
      bankName: "",
      accountNo: "",
      basicSalary: "",
      salaryType: "",
      totalWorkingDays: "",
      totalWorkingHours: "",
      totalWorkingMinutes: "",
      attemptWorkingHours: "",
      dailySalary: "",
      calcPay: "",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchPayrollEmpProfiles = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-emp-profile/`);
      const fetchedData = response.data; // Assuming only one object is returned
      setData(fetchedData); // Directly update the settings state
      console.log(fetchedData)
    } catch (error) {
      console.error('Error fetching payroll profiles:', error);
    }
  }, []);
  useEffect(() => {
    fetchPayrollEmpProfiles();
  }, [fetchPayrollEmpProfiles]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.attemptWorkingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.basicSalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.salaryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.salaryPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.accountNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.totalWorkingDays.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.totalWorkingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.totalWorkingMinutes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.attemptWorkingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.calcPay.toLowerCase().includes(searchQuery.toLowerCase())

  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Serial No",
          "Employee ID",
          "Employee Name",
          "Overtime Pay",
          "Overtime Hours",
          "Extra Fund",
          "Advance Salary",
          "Appraisals",
          "Loan",
          "Bonus",
          "Salary Period",
          "Bank Name",
          "Account Number",
          "Basic Salary",
          "Salary Type",
          "Total Working Days",
          "Total Working Hours",
          "Total Working Minutes",
          "Attempt Working Hours",
          "Daily Salary",
          "Pay",
        ],
      ],
      body: filteredData.map((item, index) => [
        index + 1,
        item.empId,
        item.empName,
        item.otHoursPay,
        item.otHours,
        item.extraFund,
        item.advSalary,
        item.app,
        item.loan,
        item.bonus,
        item.salaryPeriod,
        item.bankName,
        item.accountNo,
        item.basicSalary,
        item.salaryType,
        item.totalWorkingDays,
        item.totalWorkingHours,
        item.totalWorkingMinutes,
        item.attemptWorkingHours,
        item.dailySalary,
        item.calcPay,
        
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
                  placeholder="Search by Employee Name..."
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
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Overtime Pay</th>
                    <th>Overtime Hours</th>
                    <th>Extra Fund</th>
                    <th>Advance Salary</th>
                    <th>Appraisals</th>
                    <th>Loan</th>
                    <th>Bonus</th>
                    <th>Period</th>
                    <th>Basic</th>
                    <th>Type</th>
                    <th>Total Working Days</th>
                    <th>Total Working Hours</th>
                    <th>Attempt Working Hours</th>
                    <th>Daily Salary</th>
                    <th>Pay</th>

                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.empId}</td>
                      <td>{item.empName}</td>
                      <td>{item.otHoursPay}</td>
                      <td>{item.otHours}</td>
                      <td>{item.extraFund}</td>
                      <td>{item.advSalary}</td>
                      <td>{item.app}</td>
                      <td>{item.loan}</td>
                      <td>{item.bonus}</td>
                      <td>{item.salaryPeriod}</td>
                      <td>{item.basicSalary}</td>
                      <td>{item.salaryType}</td>
                      <td>{item.totalWorkingDays}</td>
                      <td>{item.totalWorkingHours}</td>
                      <td>{item.attemptWorkingHours}</td>
                      <td>{item.dailySalary}</td>
                      <td>{item.calcPay}</td>
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
