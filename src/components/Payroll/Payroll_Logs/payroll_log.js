import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import "../../Dashboard/dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import { FaChevronDown, FaDownload } from "react-icons/fa";
import { faFileCsv, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const PayrollLogs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}pyr-logs/`);
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredData = data
    .filter((item) => {
      const itemDate = new Date(item.closing_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!startDate || itemDate >= start) &&
        (!endDate || itemDate <= end)
      );
    })
    .slice(0, 10);

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'legal');

    doc.autoTable({
      head: [
        [
          "Serial No",
          "Employee ID",
          "Name",
          "Department",
          "Bank Name",
          "Salary Type",
          "Account No",
          "Salary Period",
          "Overtime Hours Pay",
          "Overtime Hours",
          "Extra Fund",
          "Advance Salary",
          "Appraisals",
          "Loans",
          "Bonus",
          "Basic Salary",
          "Total Working Days",
          "Total Working Hours",
          "Total Working Minutes",
          "Attempt Working Hours",
          "Daily Salary",
          "Allowances",
          "Taxes",
          "Calculate Pay",
          "Closing Date"
        ],
      ],
      body: filteredData.map((item, index) => [
        index + 1,
        item.empId,
        item.empName,
        item.department,
        item.bankName,
        item.salaryType,
        item.accountNo,
        item.salaryPeriod,
        item.otHoursPay,
        item.otHours,
        item.extraFund,
        item.advSalary,
        item.app,
        item.loan,
        item.bonus,
        item.basicSalary,
        item.totalWorkingDays,
        item.totalWorkingHours,
        item.totalWorkingMinutes,
        item.attemptWorkingHours,
        item.dailySalary,
        item.allowances,
        item.taxes,
        item.calculate_pay,
        item.closing_date,
      ]),
      styles: {
        overflow: 'linebreak',
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      tableWidth: 'auto',
      didDrawCell: (data) => {
        const { row, column, cell } = data;
        doc.setTextColor(0, 0, 0);
        doc.setLineWidth(0.1);
        doc.setDrawColor(0, 0, 0);
        doc.rect(cell.x, cell.y, cell.width, cell.height);
      },
      didDrawPage: (data) => {
        doc.text('Employee Payroll Logs', 20, 10);
      },
    });
    doc.save("payroll-logs.pdf");
  };

  const [showExportDropdown, setShowExportDropdown] = useState(false);


  return (
    <div className="department-table">
      <div className="table-header">
        <div className="payroll-header-search">
          <label>From: </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="input"
          />
          <label>To: </label>

          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="input"
          />
        </div>
        <div className="export-dropdown-container ">
          <button
            className="add-button export-button"
            onMouseEnter={() => setShowExportDropdown(true)}
            onMouseLeave={() => setShowExportDropdown(false)}
          >
            <FaDownload className="button-icon" />
            Export Data
            <FaChevronDown className="dropdown-chevron" />

          </button>
          {showExportDropdown && (
            <div
              className="export-dropdown-menu"
              onMouseEnter={() => setShowExportDropdown(true)}
              onMouseLeave={() => setShowExportDropdown(false)}
            >

              <CSVLink
                data={filteredData}
                filename="payroll-logs.csv"
                style={{ textDecoration: 'none' }}
              >
                <button
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faFileCsv} className="dropdown-icon" />
                  Export to CSV
                </button>
              </CSVLink>

              <button
                className="dropdown-item"
                onClick={exportToPDF}
              >
                <FontAwesomeIcon icon={faFilePdf} className="dropdown-icon" />
                Export to PDF
              </button>

            </div>

          )}
        </div>
      </div>

      <div className="departments-table">
        <table className="table pyr-table">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Bank Name</th>
              <th>Salary Type</th>
              <th>Account No</th>
              <th>Salary Period</th>
              <th>Overtime Hours Pay</th>
              <th>Overtime Hours</th>
              <th>Extra Fund</th>
              <th>Advance Salary</th>
              <th>Appraisals</th>
              <th>Loans</th>
              <th>Bonus</th>
              <th>Basic Salary</th>
              <th>Total Working Days</th>
              <th>Total Working Hours</th>
              <th>Total Working Minutes</th>
              <th>Attempt Working Hours</th>
              <th>Daily Salary</th>
              <th>Allowances</th>
              <th>Taxes</th>
              <th>Calculate Pay</th>
              <th>Closing Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.pyId}>
                <td>{index + 1}</td>
                <td>{item.empId}</td>
                <td className="bold-fonts">{item.empName}</td>
                <td>{item.department}</td>
                <td>{item.bankName}</td>
                <td>{item.salaryType}</td>
                <td>{item.accountNo}</td>
                <td>{item.salaryPeriod}</td>
                <td>{item.otHoursPay}</td>
                <td className="bold-fonts">{item.otHours}</td>
                <td>{item.extraFund}</td>
                <td>{item.advSalary}</td>
                <td>{item.app}</td>
                <td>{item.loan}</td>
                <td>{item.bonus}</td>
                <td>{item.basicSalary}</td>
                <td>{item.totalWorkingDays}</td>
                <td className="bold-fonts">{item.totalWorkingHours}</td>
                <td>{item.totalWorkingMinutes}</td>
                <td>{item.attemptWorkingHours}</td>
                <td>{item.dailySalary}</td>
                <td>{item.allowances}</td>
                <td>{item.taxes}</td>
                <td className="bold-fonts">{item.calculate_pay}</td>
                <td>{item.closing_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollLogs;
