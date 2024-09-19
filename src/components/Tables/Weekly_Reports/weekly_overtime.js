import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Weekly_Overtime_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", startDate: "2024-07-01", endDate: "2024-07-02", workingHours: "40", overtimeHours: "5" },
        { employeeId: "E002", employeeName: "Diana Smith", startDate: "2024-07-02", endDate: "2024-07-03", workingHours: "38", overtimeHours: "3" },
        { employeeId: "E003", employeeName: "Wade Warren", startDate: "2024-07-03", endDate: "2024-07-04", workingHours: "42", overtimeHours: "6" },
        { employeeId: "E004", employeeName: "Guy Hawkins", startDate: "2024-07-04", endDate: "2024-07-05", workingHours: "40", overtimeHours: "4" },
        { employeeId: "E005", employeeName: "Emily Davis", startDate: "2024-07-05", endDate: "2024-07-06", workingHours: "39", overtimeHours: "2" },
        // Add more rows as needed
    ];

    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.endDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.workingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.overtimeHours.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="table-container">
            <h3>Weekly Overtime Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Working Hours</th>
                        <th>Overtime Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td>{row.startDate}</td>
                            <td>{row.endDate}</td>
                            <td className="bold-fonts">{row.workingHours}</td>
                            <td className="bold-fonts">{row.overtimeHours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Weekly_Overtime_Report;
