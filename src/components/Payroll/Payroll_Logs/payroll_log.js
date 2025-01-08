import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import "../../Dashboard/dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { SERVER_URL } from "../../../config";

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
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        item.fname.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!startDate || itemDate >= start) &&
        (!endDate || itemDate <= end)
      );
    })
    .slice(0, 10);

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'legal'); // Set to 'landscape' and 'legal' size (216 x 356 mm)

    doc.autoTable({
      head: [
        [
          "Serial No",
          "Employee ID",
          "Name",
          "Allotted Hours",
          "Basic Salary",
          "Date",
          "Hours Worked",
          "Salary Type",
          "Salary Period",
          "Overtime Hours",
          "Extra Fund",
          "Advance Salary",
          "Bank Name",
          "Account No",
          "Pay",
        ],
      ],
      body: filteredData.map((item, index) => [
        index + 1,
        item.empId,
        item.fname + " " + item.lname,
        item.allotedWorkingHours,
        item.basicSalary,
        item.date,
        item.total_hrs_worked,
        item.bankName,
        item.salaryType,
        item.salaryPeriod,
        item.overtime_hrs,
        item.extra_fund,
        item.advance_salary,
        item.accountNo,
        item.pay,
      ]),
      styles: {
        overflow: 'linebreak', // Allow text to wrap
        fontSize: 8, // Adjust font size to fit more content
        cellPadding: 2, // Adjust padding for better spacing
        lineWidth: 0.1, // Set the line width for borders
        lineColor: [0, 0, 0], // Set the border color to black
      },
      tableWidth: 'auto', // Automatically adjust column widths
      didDrawCell: (data) => {
        const { row, column, cell } = data;

        // No background color or other styling applied, just basic borders
        doc.setTextColor(0, 0, 0); // Set text color to black for all cells

        // Add border around each cell
        doc.setLineWidth(0.1); // Border thickness
        doc.setDrawColor(0, 0, 0); // Border color (black)
        doc.rect(cell.x, cell.y, cell.width, cell.height); // Draw rectangle (border) around each cell
      },
      didDrawPage: (data) => {
        // Add a title or additional content on the first page
        doc.text('Employee Salary Report', 20, 10);
      },
    });
    doc.save("payroll-logs.pdf");
  };

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
        <div className="export-buttons">
          <button className="button export-csv">
            <CSVLink
              data={filteredData}
              filename="employee-profile.csv"
            >
              <div className="icon-group">
                <FontAwesomeIcon
                  icon={faFileCsv}
                  className="button-icon"
                />
                Export to CSV
              </div>
            </CSVLink>
          </button>

          <button
            className="button export-pdf"
            onClick={exportToPDF}
          >
            <div className="icon-group">
              <FontAwesomeIcon
                icon={faFilePdf}
                className="button-icon"
              />
            </div>
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
              <th>Allotted Hours</th>
              <th>Basic Salary</th>
              <th>Date</th>
              <th>Hours Worked</th>
              <th>Salary Type</th>
              <th>Salary Period</th>
              <th>Overtime Hours</th>
              <th>Extra Fund</th>
              <th>Advance Salary</th>
              <th>Bank Name</th>
              <th>Account No</th>
              <th>Pay</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.empId}</td>
                <td className="bold-fonts">{item.fname} {item.lname}</td>
                <td>{item.allotedWorkingHours}</td>
                <td>{item.basicSalary}</td>
                <td>{item.date}</td>
                <td className="bold-fonts">{item.total_hrs_worked}</td>
                <td>{item.salaryType}</td>
                <td>{item.salaryPeriod}</td>
                <td className="bold-fonts">{item.overtime_hrs}</td>
                <td>{item.extra_fund}</td>
                <td>{item.advance_salary}</td>
                <td>{item.bankName}</td>
                <td>{item.accountNo}</td>
                <td className="bold-fonts">{item.pay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollLogs;
