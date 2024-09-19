import React, { useState } from "react";
import AttendanceTable from "./AttendanceTable";

const Attendance = () => {
    const [data, setData] = useState([
        {
            "Location": "New York Office",
            "Employee ID": "EMP001",
            "Employee Name": "John Doe",
            "Time": "09:00 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Los Angeles Office",
            "Employee ID": "EMP002",
            "Employee Name": "Jane Smith",
            "Time": "09:15 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "New York Office",
            "Employee ID": "EMP003",
            "Employee Name": "Michael Johnson",
            "Time": "09:05 AM",
            "Status": "Late",
            "Date": "2024-09-01"
          },
          {
            "Location": "Chicago Office",
            "Employee ID": "EMP004",
            "Employee Name": "Emily Davis",
            "Time": "08:55 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Houston Office",
            "Employee ID": "EMP005",
            "Employee Name": "David Wilson",
            "Time": "09:10 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "New York Office",
            "Employee ID": "EMP006",
            "Employee Name": "Sarah Brown",
            "Time": "09:30 AM",
            "Status": "Late",
            "Date": "2024-09-01"
          },
          {
            "Location": "Los Angeles Office",
            "Employee ID": "EMP007",
            "Employee Name": "Chris Taylor",
            "Time": "08:50 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Chicago Office",
            "Employee ID": "EMP008",
            "Employee Name": "Jessica Miller",
            "Time": "09:20 AM",
            "Status": "Late",
            "Date": "2024-09-01"
          },
          {
            "Location": "Houston Office",
            "Employee ID": "EMP009",
            "Employee Name": "Andrew Martinez",
            "Time": "09:00 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "New York Office",
            "Employee ID": "EMP010",
            "Employee Name": "Laura Garcia",
            "Time": "09:05 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Los Angeles Office",
            "Employee ID": "EMP011",
            "Employee Name": "Robert Anderson",
            "Time": "09:00 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Chicago Office",
            "Employee ID": "EMP012",
            "Employee Name": "Megan Thomas",
            "Time": "09:40 AM",
            "Status": "Late",
            "Date": "2024-09-01"
          },
          {
            "Location": "Houston Office",
            "Employee ID": "EMP013",
            "Employee Name": "Joshua Hernandez",
            "Time": "08:45 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "New York Office",
            "Employee ID": "EMP014",
            "Employee Name": "Sophia Robinson",
            "Time": "09:10 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Los Angeles Office",
            "Employee ID": "EMP015",
            "Employee Name": "Daniel Walker",
            "Time": "09:35 AM",
            "Status": "Late",
            "Date": "2024-09-01"
          },
          {
            "Location": "Chicago Office",
            "Employee ID": "EMP016",
            "Employee Name": "Olivia Lee",
            "Time": "09:00 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Houston Office",
            "Employee ID": "EMP017",
            "Employee Name": "Matthew Harris",
            "Time": "08:55 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "New York Office",
            "Employee ID": "EMP018",
            "Employee Name": "Isabella Clark",
            "Time": "09:15 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Los Angeles Office",
            "Employee ID": "EMP019",
            "Employee Name": "James Lewis",
            "Time": "09:05 AM",
            "Status": "Present",
            "Date": "2024-09-01"
          },
          {
            "Location": "Chicago Office",
            "Employee ID": "EMP020",
            "Employee Name": "Ava Young",
            "Time": "09:25 AM",
            "Status": "Late",
            "Date": "2024-09-01"
          }
    ])
    return (
        <div>
           <AttendanceTable data = {data} setData = {setData} />
        </div>
    );
};

export default Attendance;
