import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';


const Daily_Overtime_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", overtimeHours: "2" },
        { employeeId: "E002", employeeName: "Diana Smith", overtimeHours: "1.5" },
        { employeeId: "E003", employeeName: "Wade Warren", overtimeHours: "3" },
        { employeeId: "E004", employeeName: "Guy Hawkins", overtimeHours: "2.5" },
        { employeeId: "E005", employeeName: "Emily Davis", overtimeHours: "2" },
        { employeeId: "E006", employeeName: "Michael Brown", overtimeHours: "4" },
        { employeeId: "E007", employeeName: "Jessica White", overtimeHours: "1" },
        { employeeId: "E008", employeeName: "David Johnson", overtimeHours: "2.5" },
        { employeeId: "E009", employeeName: "Laura Martinez", overtimeHours: "1.75" },
        { employeeId: "E010", employeeName: "James Lee", overtimeHours: "3" },
        { employeeId: "E011", employeeName: "Anna Wilson", overtimeHours: "2" },
        { employeeId: "E012", employeeName: "John Scott", overtimeHours: "2.5" },
        { employeeId: "E013", employeeName: "Olivia Taylor", overtimeHours: "1.5" },
        { employeeId: "E014", employeeName: "Chris Anderson", overtimeHours: "3.5" },
        { employeeId: "E015", employeeName: "Sophia Harris", overtimeHours: "2" },
        { employeeId: "E016", employeeName: "Matthew Clark", overtimeHours: "2.25" },
        { employeeId: "E017", employeeName: "Charlotte Lewis", overtimeHours: "1.5" },
        { employeeId: "E018", employeeName: "Ethan Walker", overtimeHours: "3" },
        { employeeId: "E019", employeeName: "Ava Young", overtimeHours: "2.75" },
        { employeeId: "E020", employeeName: "Daniel King", overtimeHours: "2" },
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
            <h3>Daily Overtime Report</h3>
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
                            <td  className="bold-fonts">{row.employeeName}</td>
                            <td className="bold-fonts">{row.overtimeHours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Daily_Overtime_Report;
