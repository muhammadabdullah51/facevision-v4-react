import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Daily_Working_calcHours_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    {
      id: 1,
      empId: "E001",
      fName: "Ayesha",
      lName: "Khan",
      first_checkin: "09:00 AM",
      last_checkout: "05:00 PM",
      calcHours: "8",
      date: "12 / 04 / 2022",
    },
    {
      id: 2,
      empId: "E002",
      fName: "Fatima",
      lName: "Ahmed",
      first_checkin: "09:15 AM",
      last_checkout: "05:15 PM",
      calcHours: "8",
      date: "12 / 04 / 2022",
    },
    {
      id: 3,
      empId: "E003",
      fName: "Omar",
      lName: "Ali",
      first_checkin: "09:05 AM",
      last_checkout: "05:10 PM",
      calcHours: "8",
      date: "12 / 04 / 2022",
    },
    {
      id: 4,
      empId: "E004",
      fName: "Hassan",
      lName: "Mahmood",
      first_checkin: "09:30 AM",
      last_checkout: "05:45 PM",
      calcHours: "8.25",
      date: "12 / 04 / 2022",
    },
    {
      id: 5,
      empId: "E005",
      fName: "Zainab",
      lName: "Hussain",
      first_checkin: "09:00 AM",
      last_checkout: "05:00 PM",
      calcHours: "8",
      date: "12 / 04 / 2022",
    },
    {
      id: 6,
      empId: "E006",
      fName: "Yusuf",
      lName: "Rashid",
      first_checkin: "09:10 AM",
      last_checkout: "05:20 PM",
      calcHours: "8.1",
      date: "12 / 04 / 2022",
    },
    {
      id: 7,
      empId: "E007",
      fName: "Amina",
      lName: "Ibrahim",
      first_checkin: "09:20 AM",
      last_checkout: "05:30 PM",
      calcHours: "8.1",
      date: "12 / 04 / 2022",
    },
    {
      id: 8,
      empId: "E008",
      fName: "Ahmed",
      lName: "Jamal",
      first_checkin: "09:00 AM",
      last_checkout: "05:00 PM",
      calcHours: "8",
      date: "12 / 04 / 2022",
    },
    {
      id: 9,
      empId: "E009",
      fName: "Mariam",
      lName: "Hassan",
      first_checkin: "09:25 AM",
      last_checkout: "05:35 PM",
      calcHours: "8.1",
      date: "12 / 04 / 2022",
    },
    {
      id: 10,
      empId: "E010",
      fName: "Bilal",
      lName: "Shaikh",
      first_checkin: "09:00 AM",
      last_checkout: "05:00 PM",
      calcHours: "8",
      date: "12 / 04 / 2022",
    }
  ];

  const filteredData = data.filter(
    (row) =>
      row.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.first_checkin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.last_checkout.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.calcHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send filtered data to parent
  useEffect(() => {
    sendDataToParent(filteredData);
  }, [filteredData, sendDataToParent]);

  return (
    <div className="departments-table">
      <h3>Daily Working Hours Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>First CheckIn</th>
            <th>Last CheckOut</th>
            <th>Hours</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.empId}</td>
              <td className="bold-fonts">
                {row.fName} {row.lName}
              </td>
              <td>{row.first_checkin}</td>
              <td>{row.last_checkout}</td>
              <td className="bold-fonts">{row.calcHours}</td>
              <td className="bold-fonts">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Daily_Working_calcHours_Report;
