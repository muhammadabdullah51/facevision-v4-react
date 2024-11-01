import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const All_Attendance_Summary_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    {
      employeeId: "E001",
      employeeName: "Ayesha Khan",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E002",
      employeeName: "Fatima Ahmed",
      date: "01/05/2022",
      time: "09:05 AM",
      status: "Late",
    },
    {
      employeeId: "E003",
      employeeName: "Omar Ali",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E004",
      employeeName: "Hassan Mahmood",
      date: "01/05/2022",
      time: "09:15 AM",
      status: "Late",
    },
    {
      employeeId: "E005",
      employeeName: "Zainab Hussain",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E006",
      employeeName: "Yusuf Rashid",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E007",
      employeeName: "Amina Ibrahim",
      date: "01/05/2022",
      time: "09:05 AM",
      status: "Late",
    },
    {
      employeeId: "E008",
      employeeName: "Ahmed Jamal",
      date: "01/05/2022",
      time: "09:10 AM",
      status: "Late",
    },
    {
      employeeId: "E009",
      employeeName: "Mariam Hassan",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E010",
      employeeName: "Bilal Shaikh",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E011",
      employeeName: "Safiya Khan",
      date: "01/05/2022",
      time: "09:20 AM",
      status: "Late",
    },
    {
      employeeId: "E012",
      employeeName: "Zaid Malik",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E013",
      employeeName: "Sara Yusuf",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E014",
      employeeName: "Ismail Ahmed",
      date: "01/05/2022",
      time: "09:30 AM",
      status: "Late",
    },
    {
      employeeId: "E015",
      employeeName: "Sofia Karim",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E016",
      employeeName: "Mohammed Abbas",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E017",
      employeeName: "Layla Tariq",
      date: "01/05/2022",
      time: "09:05 AM",
      status: "Late",
    },
    {
      employeeId: "E018",
      employeeName: "Ebrahim Shah",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E019",
      employeeName: "Nadia Khan",
      date: "01/05/2022",
      time: "09:00 AM",
      status: "Present",
    },
    {
      employeeId: "E020",
      employeeName: "Tariq Ali",
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
    <div className="departments-table">
      <h3>All Attendance Summary Report</h3>
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
