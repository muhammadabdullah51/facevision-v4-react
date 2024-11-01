import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Weekly_Fulltime_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    {
      employeeId: "E001",
      employeeName: "Ayesha Khan",
      date: "2024-07-01",
      time: "09:00 AM - 05:00 PM",
      status: "Present",
    },
    {
      employeeId: "E002",
      employeeName: "Fatima Ahmed",
      date: "2024-07-02",
      time: "09:00 AM - 05:00 PM",
      status: "Absent",
    },
    {
      employeeId: "E003",
      employeeName: "Omar Ali",
      date: "2024-07-03",
      time: "09:00 AM - 05:00 PM",
      status: "Present",
    },
    {
      employeeId: "E004",
      employeeName: "Hassan Mahmood",
      date: "2024-07-04",
      time: "09:00 AM - 05:00 PM",
      status: "Present",
    },
    {
      employeeId: "E005",
      employeeName: "Zainab Hussain",
      date: "2024-07-05",
      time: "09:00 AM - 05:00 PM",
      status: "Present",
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
    <div className="departments-table">
      <h3>Weekly Fulltime Report</h3>
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
              <td>{row.employeeId}</td>
              <td className="bold-fonts">{row.employeeName}</td>
              <td>{row.date}</td>
              <td>{row.time}</td>
              <td>
                <span
                  className={`${row.status.toLowerCase()} status ${
                    row.status === "Present"
                      ? "presentStatus"
                      : row.status === "Absent"
                      ? "absentStatus"
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

export default Weekly_Fulltime_Report;
