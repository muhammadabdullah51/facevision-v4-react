import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Daily_Late_In_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    {
      employeeId: "E001",
      employeeName: "Camila Rios",
      date: "2024-09-01",
      time: "09:15 AM",
      status: "Late",
    },
    {
      employeeId: "E002",
      employeeName: "Diana Smith",
      date: "2024-09-01",
      time: "09:10 AM",
      status: "On Time",
    },
    {
      employeeId: "E003",
      employeeName: "Wade Warren",
      date: "2024-09-01",
      time: "09:25 AM",
      status: "Late",
    },
    {
      employeeId: "E004",
      employeeName: "Guy Hawkins",
      date: "2024-09-01",
      time: "09:05 AM",
      status: "On Time",
    },
    {
      employeeId: "E005",
      employeeName: "Emily Davis",
      date: "2024-09-01",
      time: "09:30 AM",
      status: "Late",
    },
    // Add more rows as needed
  ];

  const filteredData = data.filter(
    (row) =>
      row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send filtered data to parent
  useEffect(() => {
    sendDataToParent(filteredData);
  }, [filteredData, sendDataToParent]);

  return (
    <div className="table-container">
      <h3>Daily Late In Report</h3>
      <table>
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
              <td>{row.employeeId}</td>
              <td className="bold-fonts">{row.employeeName}</td>
              <td>{row.date}</td>
              <td>{row.time}</td>
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
