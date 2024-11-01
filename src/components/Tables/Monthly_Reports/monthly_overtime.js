import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Monthly_Overtime_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Ayesha Khan", month: "April", date: "2024-04-01", overtimeHours: "5.5" },
        { employeeId: "E002", employeeName: "Fatima Ahmed", month: "April", date: "2024-04-02", overtimeHours: "4.0" },
        { employeeId: "E003", employeeName: "Omar Ali", month: "April", date: "2024-04-03", overtimeHours: "6.0" },
        { employeeId: "E004", employeeName: "Hassan Mahmood", month: "April", date: "2024-04-04", overtimeHours: "3.5" },
        { employeeId: "E005", employeeName: "Zainab Hussain", month: "April", date: "2024-04-05", overtimeHours: "7.0" },
        // Add more rows as needed
    ];

    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.overtimeHours.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="departments-table">
            <h3>Monthly Overtime Report</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Month</th>
                        <th>Date</th>
                        <th>Overtime Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td>{row.month}</td>
                            <td>{row.date}</td>
                            <td className="bold-fonts">{row.overtimeHours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Monthly_Overtime_Report;
