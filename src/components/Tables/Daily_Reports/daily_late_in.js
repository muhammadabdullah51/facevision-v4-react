import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Daily_Late_In_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    {
      empId: "E001",
      employeeName: "Aleem Dar",
      timeIn: "09:15 AM",
      date: "2024-09-01",
      status: "Late",
    },
    {
      empId: "E002",
      employeeName: "Dania Khalid",
      timeIn: "09:10 AM",
      date: "2024-09-01",
      status: "On Time",
    },
    {
      empId: "E003",
      employeeName: "Farrukh Saleem",
      timeIn: "09:25 AM",
      date: "2024-09-01",
      status: "Late",
    },
    {
      empId: "E004",
      employeeName: "Ayesha Sanum",
      timeIn: "09:05 AM",
      date: "2024-09-01",
      status: "On Time",
    },
    {
      empId: "E005",
      employeeName: "Waleed Faheem",
      timeIn: "09:30 AM",
      date: "2024-09-01",
      status: "Late",
    },
    // Add more rows as needed
  ];

  const filteredData = data.filter(
    (row) =>
      row.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.timeIn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send filtered data to parent
  useEffect(() => {
    sendDataToParent(filteredData);
  }, [filteredData, sendDataToParent]);

  return (
    <div className="departments-table">
      <h3>Daily Late In Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.empId}</td>
              <td className="bold-fonts">{row.employeeName}</td>
              <td>{row.date}</td>
              <td>{row.timeIn}</td>
              <td>
                <span
                  className={`${row.status.toLowerCase()} status ${
                    row.status === "On Time"
                      ? "presentStatus"
                      : row.status === "Late"
                      ? "lateStatus"
                      : "none"
                  }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Daily_Late_In_Report;
