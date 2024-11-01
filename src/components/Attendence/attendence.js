import React, { useState } from "react";
import AttendanceTable from "./AttendanceTable";

const Attendance = () => {
    const [data, setData] = useState([
      {
        "allAttendanceId": 1,
        "empId": 1,
        "emp_fName": "Danish",
        "emp_lName": "Bashir",
        "time_in": "09:00:00",
        "time_out": "17:00:00",
        "date": "2024-10-01",
        "attendance_marked": true,
        "status": "Present",
        "location": "Office"
      },
      {
        "allAttendanceId": 2,
        "empId": 2,
        "emp_fName": "Muhammad",
        "emp_lName": "Abdullah",
        "time_in": "09:15:00",
        "time_out": "17:00:00",
        "date": "2024-10-01",
        "attendance_marked": true,
        "status": "Late",
        "location": "Remote"
      },
      {
        "allAttendanceId": 3,
        "empId": 3,
        "emp_fName": "Waseem",
        "emp_lName": "Shah",
        "time_in": "none",
        "time_out": "none",
        "date": "2024-10-01",
        "attendance_marked": true,
        "status": "Absent",
        "location": "Office"
      },
      {
        "allAttendanceId": 4,
        "empId": 4,
        "emp_fName": "Ali",
        "emp_lName": "Azmat",
        "time_in": "09:00:00",
        "time_out": "17:00:00",
        "date": "2024-10-01",
        "attendance_marked": true,
        "status": "Present",
        "location": "Office"
      },
      {
        "allAttendanceId": 5,
        "empId": 5,
        "emp_fName": "Aleem",
        "emp_lName": "Khabib",
        "time_in": "09:15:00",
        "time_out": "17:00:00",
        "date": "2024-10-01",
        "attendance_marked": true,
        "status": "Late",
        "location": "Remote"
      }
    ])
    return (
        <div>
           <AttendanceTable data = {data} setData = {setData} />
        </div>
    );
};

export default Attendance;
