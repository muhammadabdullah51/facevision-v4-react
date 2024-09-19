import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Absent_Summary_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", absentDates: "01/05/2022, 15/05/2022" },
        { employeeId: "E002", employeeName: "Diana Smith", absentDates: "05/05/2022" },
        { employeeId: "E003", employeeName: "Wade Warren", absentDates: "07/05/2022, 20/05/2022" },
        { employeeId: "E004", employeeName: "Guy Hawkins", absentDates: "10/05/2022" },
        { employeeId: "E005", employeeName: "Emily Davis", absentDates: "12/05/2022" },
        { employeeId: "E006", employeeName: "Michael Brown", absentDates: "14/05/2022, 25/05/2022" },
        { employeeId: "E007", employeeName: "Jessica White", absentDates: "16/05/2022" },
        { employeeId: "E008", employeeName: "David Johnson", absentDates: "18/05/2022" },
        { employeeId: "E009", employeeName: "Laura Martinez", absentDates: "22/05/2022" },
        { employeeId: "E010", employeeName: "James Lee", absentDates: "24/05/2022, 30/05/2022" },
        { employeeId: "E011", employeeName: "Anna Wilson", absentDates: "26/05/2022" },
        { employeeId: "E012", employeeName: "John Scott", absentDates: "28/05/2022" },
        { employeeId: "E013", employeeName: "Olivia Taylor", absentDates: "01/06/2022" },
        { employeeId: "E014", employeeName: "Chris Anderson", absentDates: "03/06/2022, 10/06/2022" },
        { employeeId: "E015", employeeName: "Sophia Harris", absentDates: "05/06/2022" },
        { employeeId: "E016", employeeName: "Matthew Clark", absentDates: "07/06/2022" },
        { employeeId: "E017", employeeName: "Charlotte Lewis", absentDates: "09/06/2022" },
        { employeeId: "E018", employeeName: "Ethan Walker", absentDates: "11/06/2022" },
        { employeeId: "E019", employeeName: "Ava Young", absentDates: "13/06/2022" },
        { employeeId: "E020", employeeName: "Daniel King", absentDates: "15/06/2022" },
    ];

    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.absentDates.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="table-container">
            <h3>Absent Summary Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Absent Dates</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td className="bold-fonts">{row.absentDates}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Absent_Summary_Report;
