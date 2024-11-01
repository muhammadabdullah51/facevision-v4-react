import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Leave_Summary_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Ayesha Khan", date: "01/05/2022", leave: "Sick Leave" },
        { employeeId: "E002", employeeName: "Fatima Ahmed", date: "03/05/2022", leave: "Casual Leave" },
        { employeeId: "E003", employeeName: "Omar Ali", date: "07/05/2022", leave: "Annual Leave" },
        { employeeId: "E004", employeeName: "Hassan Mahmood", date: "10/05/2022", leave: "Medical Leave" },
        { employeeId: "E005", employeeName: "Zainab Hussain", date: "12/05/2022", leave: "Sick Leave" },
        { employeeId: "E006", employeeName: "Yusuf Rashid", date: "15/05/2022", leave: "Casual Leave" },
        { employeeId: "E007", employeeName: "Amina Ibrahim", date: "18/05/2022", leave: "Annual Leave" },
        { employeeId: "E008", employeeName: "Ahmed Jamal", date: "22/05/2022", leave: "Medical Leave" },
        { employeeId: "E009", employeeName: "Mariam Hassan", date: "24/05/2022", leave: "Sick Leave" },
        { employeeId: "E010", employeeName: "Bilal Shaikh", date: "27/05/2022", leave: "Casual Leave" },
        { employeeId: "E011", employeeName: "Safiya Khan", date: "30/05/2022", leave: "Annual Leave" },
        { employeeId: "E012", employeeName: "Zaid Malik", date: "02/06/2022", leave: "Medical Leave" },
        { employeeId: "E013", employeeName: "Sara Yusuf", date: "05/06/2022", leave: "Sick Leave" },
        { employeeId: "E014", employeeName: "Ismail Ahmed", date: "08/06/2022", leave: "Casual Leave" },
        { employeeId: "E015", employeeName: "Sofia Karim", date: "11/06/2022", leave: "Annual Leave" },
        { employeeId: "E016", employeeName: "Mohammed Abbas", date: "14/06/2022", leave: "Medical Leave" },
        { employeeId: "E017", employeeName: "Layla Tariq", date: "17/06/2022", leave: "Sick Leave" },
        { employeeId: "E018", employeeName: "Ebrahim Shah", date: "20/06/2022", leave: "Casual Leave" },
        { employeeId: "E019", employeeName: "Nadia Khan", date: "23/06/2022", leave: "Annual Leave" },
        { employeeId: "E020", employeeName: "Tariq Ali", date: "26/06/2022", leave: "Medical Leave" },
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
        <div className="departments-table">
            <h3>Summary All Leave Report</h3>
            <table className="table">
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
