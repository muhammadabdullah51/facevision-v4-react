import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Overtime_Summary_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Ayesha Khan", overtimeHours: "10.5" },
        { employeeId: "E002", employeeName: "Fatima Ahmed", overtimeHours: "8.0" },
        { employeeId: "E003", employeeName: "Omar Ali", overtimeHours: "12.0" },
        { employeeId: "E004", employeeName: "Hassan Mahmood", overtimeHours: "7.5" },
        { employeeId: "E005", employeeName: "Zainab Hussain", overtimeHours: "9.0" },
        { employeeId: "E006", employeeName: "Yusuf Rashid", overtimeHours: "11.0" },
        { employeeId: "E007", employeeName: "Amina Ibrahim", overtimeHours: "6.5" },
        { employeeId: "E008", employeeName: "Ahmed Jamal", overtimeHours: "10.0" },
        { employeeId: "E009", employeeName: "Mariam Hassan", overtimeHours: "8.5" },
        { employeeId: "E010", employeeName: "Bilal Shaikh", overtimeHours: "7.0" },
        { employeeId: "E011", employeeName: "Safiya Khan", overtimeHours: "9.5" },
        { employeeId: "E012", employeeName: "Zaid Malik", overtimeHours: "12.5" },
        { employeeId: "E013", employeeName: "Sara Yusuf", overtimeHours: "10.0" },
        { employeeId: "E014", employeeName: "Ismail Ahmed", overtimeHours: "11.5" },
        { employeeId: "E015", employeeName: "Sofia Karim", overtimeHours: "8.0" },
        { employeeId: "E016", employeeName: "Mohammed Abbas", overtimeHours: "7.5" },
        { employeeId: "E017", employeeName: "Layla Tariq", overtimeHours: "9.0" },
        { employeeId: "E018", employeeName: "Ebrahim Shah", overtimeHours: "10.5" },
        { employeeId: "E019", employeeName: "Nadia Khan", overtimeHours: "8.5" },
        { employeeId: "E020", employeeName: "Tariq Ali", overtimeHours: "12.0" },
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
        <div className="departments-table">
            <h3>Overtime Summary Report</h3>
            <table className="table">
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
