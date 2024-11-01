import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';

const Absent_Summary_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Ayesha Khan", absentDates: "01/05/2022, 15/05/2022" },
        { employeeId: "E002", employeeName: "Fatima Ahmed", absentDates: "05/05/2022" },
        { employeeId: "E003", employeeName: "Omar Ali", absentDates: "07/05/2022, 20/05/2022" },
        { employeeId: "E004", employeeName: "Hassan Mahmood", absentDates: "10/05/2022" },
        { employeeId: "E005", employeeName: "Zainab Hussain", absentDates: "12/05/2022" },
        { employeeId: "E006", employeeName: "Yusuf Rashid", absentDates: "14/05/2022, 25/05/2022" },
        { employeeId: "E007", employeeName: "Amina Ibrahim", absentDates: "16/05/2022" },
        { employeeId: "E008", employeeName: "Ahmed Jamal", absentDates: "18/05/2022" },
        { employeeId: "E009", employeeName: "Mariam Hassan", absentDates: "22/05/2022" },
        { employeeId: "E010", employeeName: "Bilal Shaikh", absentDates: "24/05/2022, 30/05/2022" },
        { employeeId: "E011", employeeName: "Safiya Khan", absentDates: "26/05/2022" },
        { employeeId: "E012", employeeName: "Zaid Malik", absentDates: "28/05/2022" },
        { employeeId: "E013", employeeName: "Sara Yusuf", absentDates: "01/06/2022" },
        { employeeId: "E014", employeeName: "Ismail Ahmed", absentDates: "03/06/2022, 10/06/2022" },
        { employeeId: "E015", employeeName: "Sofia Karim", absentDates: "05/06/2022" },
        { employeeId: "E016", employeeName: "Mohammed Abbas", absentDates: "07/06/2022" },
        { employeeId: "E017", employeeName: "Layla Tariq", absentDates: "09/06/2022" },
        { employeeId: "E018", employeeName: "Ebrahim Shah", absentDates: "11/06/2022" },
        { employeeId: "E019", employeeName: "Nadia Khan", absentDates: "13/06/2022" },
        { employeeId: "E020", employeeName: "Tariq Ali", absentDates: "15/06/2022" },
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
        <div className="departments-table">
            <h3>Absent Summary Report</h3>
            <table className="table">
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
