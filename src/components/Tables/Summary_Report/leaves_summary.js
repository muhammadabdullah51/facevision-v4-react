import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Leave_Summary_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", date: "01/05/2022", leave: "Sick Leave" },
        { employeeId: "E002", employeeName: "Diana Smith", date: "03/05/2022", leave: "Casual Leave" },
        { employeeId: "E003", employeeName: "Wade Warren", date: "07/05/2022", leave: "Annual Leave" },
        { employeeId: "E004", employeeName: "Guy Hawkins", date: "10/05/2022", leave: "Medical Leave" },
        { employeeId: "E005", employeeName: "Emily Davis", date: "12/05/2022", leave: "Sick Leave" },
        { employeeId: "E006", employeeName: "Michael Brown", date: "15/05/2022", leave: "Casual Leave" },
        { employeeId: "E007", employeeName: "Jessica White", date: "18/05/2022", leave: "Annual Leave" },
        { employeeId: "E008", employeeName: "David Johnson", date: "22/05/2022", leave: "Medical Leave" },
        { employeeId: "E009", employeeName: "Laura Martinez", date: "24/05/2022", leave: "Sick Leave" },
        { employeeId: "E010", employeeName: "James Lee", date: "27/05/2022", leave: "Casual Leave" },
        { employeeId: "E011", employeeName: "Anna Wilson", date: "30/05/2022", leave: "Annual Leave" },
        { employeeId: "E012", employeeName: "John Scott", date: "02/06/2022", leave: "Medical Leave" },
        { employeeId: "E013", employeeName: "Olivia Taylor", date: "05/06/2022", leave: "Sick Leave" },
        { employeeId: "E014", employeeName: "Chris Anderson", date: "08/06/2022", leave: "Casual Leave" },
        { employeeId: "E015", employeeName: "Sophia Harris", date: "11/06/2022", leave: "Annual Leave" },
        { employeeId: "E016", employeeName: "Matthew Clark", date: "14/06/2022", leave: "Medical Leave" },
        { employeeId: "E017", employeeName: "Charlotte Lewis", date: "17/06/2022", leave: "Sick Leave" },
        { employeeId: "E018", employeeName: "Ethan Walker", date: "20/06/2022", leave: "Casual Leave" },
        { employeeId: "E019", employeeName: "Ava Young", date: "23/06/2022", leave: "Annual Leave" },
        { employeeId: "E020", employeeName: "Daniel King", date: "26/06/2022", leave: "Medical Leave" },
    ];

    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.leave.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="table-container">
            <h3>Summary All Leave Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Date</th>
                        <th>Leave</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td>{row.date}</td>
                            <td className="bold-fonts">{row.leave}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default Leave_Summary_Report;
