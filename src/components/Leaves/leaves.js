import React, { useState } from "react";
import LeaveTable from "./LeaveTable";


const Leaves = () => {
    const [data, setData] = useState([
    { employeeId: 'E001', employeeName: 'John Doe', leaveType: 'Sick', startDate: '2024-09-01', endDate: '2024-09-05', reason: 'Flu', status: 'Approved', createdAt: '2024-08-25' },
    { employeeId: 'E002', employeeName: 'Jane Smith', leaveType: 'Vacation', startDate: '2024-09-10', endDate: '2024-09-15', reason: 'Holiday', status: 'Pending', createdAt: '2024-08-27' },
    { employeeId: 'E003', employeeName: 'Alice Johnson', leaveType: 'Personal', startDate: '2024-09-05', endDate: '2024-09-07', reason: 'Family Event', status: 'Approved', createdAt: '2024-08-28' },
    { employeeId: 'E004', employeeName: 'Bob Brown', leaveType: 'Sick', startDate: '2024-09-12', endDate: '2024-09-14', reason: 'Flu', status: 'Pending', createdAt: '2024-08-29' },
    { employeeId: 'E005', employeeName: 'Carol White', leaveType: 'Vacation', startDate: '2024-09-20', endDate: '2024-09-25', reason: 'Beach Trip', status: 'Approved', createdAt: '2024-08-30' },
    { employeeId: 'E006', employeeName: 'David Green', leaveType: 'Medical', startDate: '2024-09-03', endDate: '2024-09-06', reason: 'Check-up', status: 'Approved', createdAt: '2024-08-31' },
    { employeeId: 'E007', employeeName: 'Emma Wilson', leaveType: 'Sick', startDate: '2024-09-08', endDate: '2024-09-10', reason: 'Cold', status: 'Pending', createdAt: '2024-09-01' },
    { employeeId: 'E008', employeeName: 'Frank Harris', leaveType: 'Vacation', startDate: '2024-09-15', endDate: '2024-09-22', reason: 'Road Trip', status: 'Approved', createdAt: '2024-09-02' },
    { employeeId: 'E009', employeeName: 'Grace Lee', leaveType: 'Personal', startDate: '2024-09-18', endDate: '2024-09-21', reason: 'Wedding', status: 'Pending', createdAt: '2024-09-03' },
    { employeeId: 'E010', employeeName: 'Henry Adams', leaveType: 'Medical', startDate: '2024-09-10', endDate: '2024-09-12', reason: 'Dental', status: 'Approved', createdAt: '2024-09-04' },
    { employeeId: 'E011', employeeName: 'Ivy Clark', leaveType: 'Vacation', startDate: '2024-09-22', endDate: '2024-09-30', reason: 'Travel', status: 'Pending', createdAt: '2024-09-05' },
    { employeeId: 'E012', employeeName: 'Jack Wright', leaveType: 'Sick', startDate: '2024-09-06', endDate: '2024-09-09', reason: 'Stomach Ache', status: 'Approved', createdAt: '2024-09-06' },
    { employeeId: 'E013', employeeName: 'Kathy Nelson', leaveType: 'Personal', startDate: '2024-09-12', endDate: '2024-09-15', reason: 'Home Repair', status: 'Pending', createdAt: '2024-09-07' },
    { employeeId: 'E014', employeeName: 'Leo Thompson', leaveType: 'Vacation', startDate: '2024-09-05', endDate: '2024-09-08', reason: 'Weekend Getaway', status: 'Approved', createdAt: '2024-09-08' },
    { employeeId: 'E015', employeeName: 'Mia Martinez', leaveType: 'Sick', startDate: '2024-09-02', endDate: '2024-09-04', reason: 'Back Pain', status: 'Pending', createdAt: '2024-09-09' },
    { employeeId: 'E016', employeeName: 'Nick Robinson', leaveType: 'Medical', startDate: '2024-09-11', endDate: '2024-09-13', reason: 'Eye Exam', status: 'Approved', createdAt: '2024-09-10' },
    { employeeId: 'E017', employeeName: 'Olivia Scott', leaveType: 'Vacation', startDate: '2024-09-08', endDate: '2024-09-14', reason: 'Cultural Trip', status: 'Pending', createdAt: '2024-09-11' },
    { employeeId: 'E018', employeeName: 'Paul Turner', leaveType: 'Personal', startDate: '2024-09-14', endDate: '2024-09-18', reason: 'Conference', status: 'Approved', createdAt: '2024-09-12' },
    { employeeId: 'E019', employeeName: 'Quinn Walker', leaveType: 'Medical', startDate: '2024-09-09', endDate: '2024-09-11', reason: 'Check-up', status: 'Pending', createdAt: '2024-09-13' },
    { employeeId: 'E020', employeeName: 'Riley Hall', leaveType: 'Sick', startDate: '2024-09-16', endDate: '2024-09-18', reason: 'Flu', status: 'Approved', createdAt: '2024-09-14' }
    ])
    return (
        <div>
           <LeaveTable data={data} setData={setData} />
        </div>
    );
};

export default Leaves;
