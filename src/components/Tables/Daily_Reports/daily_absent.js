import React, { useEffect } from "react";import '../Dashboard_Table/dashboard_table.css';


const Daily_Absent_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", date: "2024-09-01", reason: "Sick Leave" },
        { employeeId: "E002", employeeName: "Diana Smith", date: "2024-09-01", reason: "Vacation" },
        { employeeId: "E003", employeeName: "Wade Warren", date: "2024-09-01", reason: "Personal" },
        { employeeId: "E004", employeeName: "Guy Hawkins", date: "2024-09-01", reason: "Unpaid Leave" },
        { employeeId: "E005", employeeName: "Emily Davis", date: "2024-09-01", reason: "Medical" },
        // Add more rows as needed
    ];

    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="table-container">
            <h3>Daily Absent Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Date</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td>{row.date}</td>
                            <td className="bold-fonts">{row.reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Daily_Absent_Report;
