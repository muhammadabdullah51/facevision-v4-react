import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Daily_Fulltime_Report = ({ searchQuery, sendDataToParent }) => {
  // Updated data structure to match new headings
  const data = [
    {
      dailyFullTimeId: 1,
      empId: "E001",
      employee: "Aisha Khan",
      timeIn: "09:00 AM",
      timeOut: "09:00 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Present",
    },
    {
      dailyFullTimeId: 2,
      empId: "E002",
      employee: "Fatima Ahmed",
      timeIn: "09:15 AM",
      timeOut: "09:15 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Present",
    },
    {
      dailyFullTimeId: 3,
      empId: "E003",
      employee: "Omar Siddiqui",
      timeIn: "09:05 AM",
      timeOut: "09:05 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Late",
    },
    {
      dailyFullTimeId: 4,
      empId: "E004",
      employee: "Zain Malik",
      timeIn: "09:30 AM",
      timeOut: "09:30 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Late",
    },
    {
      dailyFullTimeId: 5,
      empId: "E005",
      employee: "Maryam Yousaf",
      timeIn: "09:00 AM",
      timeOut: "09:00 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Present",
    },
    {
      dailyFullTimeId: 6,
      empId: "E006",
      employee: "Ali Hassan",
      timeIn: "09:10 AM",
      timeOut: "09:10 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Present",
    },
    {
      dailyFullTimeId: 7,
      empId: "E007",
      employee: "Sana Karim",
      timeIn: "09:20 AM",
      timeOut: "09:20 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Late",
    },
    {
      dailyFullTimeId: 8,
      empId: "E008",
      employee: "Yusuf Khan",
      timeIn: "09:00 AM",
      timeOut: "09:00 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Present",
    },
    {
      dailyFullTimeId: 9,
      empId: "E009",
      employee: "Zara Sheikh",
      timeIn: "09:25 AM",
      timeOut: "09:25 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Late",
    },
    {
      dailyFullTimeId: 10,
      empId: "E010",
      employee: "Ahmed Khan",
      timeIn: "09:00 AM",
      timeOut: "09:00 AM",
      date: "12 / 04 / 2022",
      day: "monday",
      workingHrs: '8',
      totalHrs: '8',
      status: "Present",
    }
  ];

  const filteredData = data.filter(
    (row) =>
      row.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.timeIn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.timeOut.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send filtered data to parent
  useEffect(() => {
    sendDataToParent(filteredData);
  }, [filteredData, sendDataToParent]);

  return (
    <div className="departments-table">
      <h3>Daily Full-Time Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Date</th>
            <th>Day</th>
            <th>Working Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.empId}</td>
              <td className="bold-fonts">{row.employee}</td>
              <td>{row.timeIn}</td>
              <td>{row.timeOut}</td>
              <td>{row.date}</td>
              <td>{row.day}</td>
              <td>{row.workingHrs}</td>
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
