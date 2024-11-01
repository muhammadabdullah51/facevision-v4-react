import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Monthly_Absent_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Ayesha Khan", absentDate: "2024-09-01" },
        { employeeId: "E002", employeeName: "Fatima Ahmed", absentDate: "2024-09-02" },
        { employeeId: "E003", employeeName: "Omar Ali", absentDate: "2024-09-03" },
        { employeeId: "E004", employeeName: "Hassan Mahmood", absentDate: "2024-09-04" },
        { employeeId: "E005", employeeName: "Zainab Hussain", absentDate: "2024-09-05" },
        // Add more rows as needed
    ];

    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.absentDate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="departments-table">
            <h3>Monthly Absent Report</h3>
            <table className="table"s>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Absent Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td className="bold-fonts">{row.absentDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Monthly_Absent_Report;
