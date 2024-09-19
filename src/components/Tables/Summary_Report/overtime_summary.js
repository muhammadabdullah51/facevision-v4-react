import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Overtime_Summary_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", overtimeHours: "10.5" },
        { employeeId: "E002", employeeName: "Diana Smith", overtimeHours: "8.0" },
        { employeeId: "E003", employeeName: "Wade Warren", overtimeHours: "12.0" },
        { employeeId: "E004", employeeName: "Guy Hawkins", overtimeHours: "7.5" },
        { employeeId: "E005", employeeName: "Emily Davis", overtimeHours: "9.0" },
        { employeeId: "E006", employeeName: "Michael Brown", overtimeHours: "11.0" },
        { employeeId: "E007", employeeName: "Jessica White", overtimeHours: "6.5" },
        { employeeId: "E008", employeeName: "David Johnson", overtimeHours: "10.0" },
        { employeeId: "E009", employeeName: "Laura Martinez", overtimeHours: "8.5" },
        { employeeId: "E010", employeeName: "James Lee", overtimeHours: "7.0" },
        { employeeId: "E011", employeeName: "Anna Wilson", overtimeHours: "9.5" },
        { employeeId: "E012", employeeName: "John Scott", overtimeHours: "12.5" },
        { employeeId: "E013", employeeName: "Olivia Taylor", overtimeHours: "10.0" },
        { employeeId: "E014", employeeName: "Chris Anderson", overtimeHours: "11.5" },
        { employeeId: "E015", employeeName: "Sophia Harris", overtimeHours: "8.0" },
        { employeeId: "E016", employeeName: "Matthew Clark", overtimeHours: "7.5" },
        { employeeId: "E017", employeeName: "Charlotte Lewis", overtimeHours: "9.0" },
        { employeeId: "E018", employeeName: "Ethan Walker", overtimeHours: "10.5" },
        { employeeId: "E019", employeeName: "Ava Young", overtimeHours: "8.5" },
        { employeeId: "E020", employeeName: "Daniel King", overtimeHours: "12.0" },
    ];

    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.overtimeHours.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="table-container">
            <h3>Overtime Summary Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Overtime Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td className="bold-fonts">{row.overtimeHours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Overtime_Summary_Report;
