import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Daily_Fulltime_Report = ({ searchQuery, sendDataToParent }) => {
  // Updated data structure to match new headings
  const data = [
    {
      employeeId: "E001",
      employeeName: "Camila Rios",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E002",
      employeeName: "Diana Smith",
      date: "12 / 04 / 2022",
      time: "09:15 AM",
      status: "Present",
    },
    {
      employeeId: "E003",
      employeeName: "Wade Warren",
      date: "12 / 04 / 2022",
      time: "09:05 AM",
      status: "Late",
    },
    {
      employeeId: "E004",
      employeeName: "Guy Hawkins",
      date: "12 / 04 / 2022",
      time: "09:30 AM",
      status: "Late",
    },
    {
      employeeId: "E005",
      employeeName: "Emily Davis",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E006",
      employeeName: "Michael Brown",
      date: "12 / 04 / 2022",
      time: "09:10 AM",
      status: "Present",
    },
    {
      employeeId: "E007",
      employeeName: "Jessica White",
      date: "12 / 04 / 2022",
      time: "09:20 AM",
      status: "Late",
    },
    {
      employeeId: "E008",
      employeeName: "David Johnson",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E009",
      employeeName: "Laura Martinez",
      date: "12 / 04 / 2022",
      time: "09:25 AM",
      status: "Late",
    },
    {
      employeeId: "E010",
      employeeName: "James Lee",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E011",
      employeeName: "Anna Wilson",
      date: "12 / 04 / 2022",
      time: "09:30 AM",
      status: "Late",
    },
    {
      employeeId: "E012",
      employeeName: "John Scott",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E013",
      employeeName: "Olivia Taylor",
      date: "12 / 04 / 2022",
      time: "09:15 AM",
      status: "Present",
    },
    {
      employeeId: "E014",
      employeeName: "Chris Anderson",
      date: "12 / 04 / 2022",
      time: "09:35 AM",
      status: "Late",
    },
    {
      employeeId: "E015",
      employeeName: "Sophia Harris",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E016",
      employeeName: "Matthew Clark",
      date: "12 / 04 / 2022",
      time: "09:05 AM",
      status: "Present",
    },
    {
      employeeId: "E017",
      employeeName: "Charlotte Lewis",
      date: "12 / 04 / 2022",
      time: "09:20 AM",
      status: "Late",
    },
    {
      employeeId: "E018",
      employeeName: "Ethan Walker",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E019",
      employeeName: "Ava Young",
      date: "12 / 04 / 2022",
      time: "09:30 AM",
      status: "Late",
    },
    {
      employeeId: "E020",
      employeeName: "Daniel King",
      date: "12 / 04 / 2022",
      time: "09:00 AM",
      status: "Present",
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
      <h3>Daily Full-Time Report</h3>
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

export default Daily_Fulltime_Report;
