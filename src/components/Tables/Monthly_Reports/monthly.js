import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Monthly_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    { employeeId: "E001", employeeName: "Ayesha Khan", date: "2024-04-01" },
    { employeeId: "E002", employeeName: "Fatima Ahmed", date: "2024-04-02" },
    { employeeId: "E003", employeeName: "Omar Ali", date: "2024-04-03" },
    { employeeId: "E004", employeeName: "Hassan Mahmood", date: "2024-04-04" },
    { employeeId: "E005", employeeName: "Zainab Hussain", date: "2024-04-05" },
    // Add more rows as needed
  ];

  const filteredData = data.filter(
    (row) =>
      row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send filtered data to parent
  useEffect(() => {
    sendDataToParent(filteredData);
  }, [filteredData, sendDataToParent]);

  return (
    <div className="departments-table">
      <h3>Monthly Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.employeeId}</td>
              <td className="bold-fonts">{row.employeeName}</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Monthly_Report;
