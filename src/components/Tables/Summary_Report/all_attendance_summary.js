import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const All_Attendance_Summary_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    {
      employeeId: "E001",
      employeeName: "Camila Rios",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E002",
      employeeName: "Diana Smith",
      date: "01/05/2022",
      time: "09:05 AM",
      status: "Late",
    },
    {
      employeeId: "E003",
      employeeName: "Wade Warren",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E004",
      employeeName: "Guy Hawkins",
      date: "01/05/2022",
      time: "09:15 AM",
      status: "Late",
    },
    {
      employeeId: "E005",
      employeeName: "Emily Davis",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E006",
      employeeName: "Michael Brown",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E007",
      employeeName: "Jessica White",
      date: "01/05/2022",
      time: "09:05 AM",
      status: "Late",
    },
    {
      employeeId: "E008",
      employeeName: "David Johnson",
      date: "01/05/2022",
      time: "09:10 AM",
      status: "Late",
    },
    {
      employeeId: "E009",
      employeeName: "Laura Martinez",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E010",
      employeeName: "James Lee",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E011",
      employeeName: "Anna Wilson",
      date: "01/05/2022",
      time: "09:20 AM",
      status: "Late",
    },
    {
      employeeId: "E012",
      employeeName: "John Scott",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E013",
      employeeName: "Olivia Taylor",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E014",
      employeeName: "Chris Anderson",
      date: "01/05/2022",
      time: "09:30 AM",
      status: "Late",
    },
    {
      employeeId: "E015",
      employeeName: "Sophia Harris",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E016",
      employeeName: "Matthew Clark",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E017",
      employeeName: "Charlotte Lewis",
      date: "01/05/2022",
      time: "09:05 AM",
      status: "Late",
    },
    {
      employeeId: "E018",
      employeeName: "Ethan Walker",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E019",
      employeeName: "Ava Young",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E020",
      employeeName: "Daniel King",
      date: "01/05/2022",
      time: "09:10 AM",
      status: "Late",
    },
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
      <h3>All Attendance Summary Report</h3>
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
                    row.status === "Present"
                      ? "presentStatus"
                      : row.status === "Late"
                      ? "lateStatus"
                      : row.status === "Absent"
                      ? "absentStatus"
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

export default All_Attendance_Summary_Report;
