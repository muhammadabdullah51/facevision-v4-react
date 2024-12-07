import React, { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import "../../Dashboard/dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const PayrollLogs = () => {
  const [data, setData] = useState([
    // Sample data with various dates
    {
      id: 1,
      empId: "E001",
      fname: "Ahmad",
      lname: "Ali",
      allotedWorkingHours: "160",
      basicSalary: "$3000",
      bankName: "Habib",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "1234567890",
      total_hrs_worked: "160",
      date: "2024-08-01",
      overtime_hrs: "10",
      extra_fund: "$150",
      advance_salary: "$170",
      pay: "$3300",
    },
    {
      id: 2,
      empId: "E002",
      fname: "Fatima",
      lname: "Zahra",
      allotedWorkingHours: "160",
      basicSalary: "$2800",
      bankName: "Meezan",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "9876543210",
      total_hrs_worked: "158",
      date: "2024-08-05",
      overtime_hrs: "8",
      extra_fund: "$120",
      advance_salary: "$150",
      pay: "$3050",
    },
    {
      id: 3,
      empId: "E003",
      fname: "Muhammad",
      lname: "Usman",
      allotedWorkingHours: "160",
      basicSalary: "$3200",
      bankName: "Faysal",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "1122334455",
      total_hrs_worked: "165",
      date: "2024-08-10",
      overtime_hrs: "12",
      extra_fund: "$200",
      advance_salary: "$100",
      pay: "$3450",
    },
    {
      id: 4,
      empId: "E004",
      fname: "Aisha",
      lname: "Siddiqui",
      allotedWorkingHours: "160",
      basicSalary: "$3100",
      bankName: "UBL",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "5566778899",
      total_hrs_worked: "163",
      date: "2024-08-15",
      overtime_hrs: "7",
      extra_fund: "$180",
      advance_salary: "$110",
      pay: "$3390",
    },
    {
      id: 5,
      empId: "E005",
      fname: "Hamza",
      lname: "Khalid",
      allotedWorkingHours: "160",
      basicSalary: "$2900",
      bankName: "MCB",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "9988776655",
      total_hrs_worked: "162",
      date: "2024-08-20",
      overtime_hrs: "9",
      extra_fund: "$130",
      advance_salary: "$120",
      pay: "$3150",
    },
    {
      id: 6,
      empId: "E006",
      fname: "Sara",
      lname: "Ahmed",
      allotedWorkingHours: "160",
      basicSalary: "$2800",
      bankName: "HBL",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "7766554433",
      total_hrs_worked: "158",
      date: "2024-08-25",
      overtime_hrs: "6",
      extra_fund: "$140",
      advance_salary: "$100",
      pay: "$2940",
    },
    {
      id: 7,
      empId: "E007",
      fname: "Omar",
      lname: "Farooq",
      allotedWorkingHours: "160",
      basicSalary: "$3050",
      bankName: "Askari",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "3344556677",
      total_hrs_worked: "164",
      date: "2024-08-30",
      overtime_hrs: "8",
      extra_fund: "$150",
      advance_salary: "$80",
      pay: "$3280",
    },
    {
      id: 8,
      empId: "E008",
      fname: "Zainab",
      lname: "Khan",
      allotedWorkingHours: "160",
      basicSalary: "$2750",
      bankName: "Standard Chartered",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "6655443322",
      total_hrs_worked: "157",
      date: "2024-08-11",
      overtime_hrs: "5",
      extra_fund: "$100",
      advance_salary: "$90",
      pay: "$2940",
    },
    {
      id: 9,
      empId: "E009",
      fname: "Bilal",
      lname: "Ansari",
      allotedWorkingHours: "160",
      basicSalary: "$2950",
      bankName: "Silkbank",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "4433221100",
      total_hrs_worked: "161",
      date: "2024-08-21",
      overtime_hrs: "6",
      extra_fund: "$170",
      advance_salary: "$110",
      pay: "$3230",
    },
    {
      id: 10,
      empId: "E010",
      fname: "Hafsa",
      lname: "Malik",
      allotedWorkingHours: "160",
      basicSalary: "$3100",
      bankName: "Bank Alfalah",
      salaryType: "Monthly",
      salaryPeriod: "fixed",
      accountNo: "1122445566",
      total_hrs_worked: "165",
      date: "2024-08-31",
      overtime_hrs: "12",
      extra_fund: "$210",
      advance_salary: "$100",
      pay: "$3420",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
