import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';



const Advance_Salary_Reports = ({searchQuery, sendDataToParent  }) => {

    

    // Updated data structure to match new headings
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", amount: "34.55 USD", month: "April", date: "12 / 04 / 2022", reason: "Pending" },
        { employeeId: "E002", employeeName: "Diana Smith", amount: "18.42 USD", month: "April", date: "16 / 04 / 2022", reason: "Pending" },
        { employeeId: "E003", employeeName: "Wade Warren", amount: "21.55 USD", month: "April", date: "17 / 04 / 2022", reason: "Paid" },
        { employeeId: "E004", employeeName: "Guy Hawkins", amount: "42.19 USD", month: "April", date: "20 / 04 / 2022", reason: "Paid" },
        { employeeId: "E005", employeeName: "Emily Davis", amount: "27.30 USD", month: "April", date: "22 / 04 / 2022", reason: "Pending" },
        { employeeId: "E006", employeeName: "Michael Brown", amount: "30.75 USD", month: "April", date: "23 / 04 / 2022", reason: "Paid" },
        { employeeId: "E007", employeeName: "Jessica White", amount: "25.60 USD", month: "April", date: "25 / 04 / 2022", reason: "Pending" },
        { employeeId: "E008", employeeName: "David Johnson", amount: "40.00 USD", month: "April", date: "26 / 04 / 2022", reason: "Paid" },
        { employeeId: "E009", employeeName: "Laura Martinez", amount: "22.15 USD", month: "April", date: "27 / 04 / 2022", reason: "Pending" },
        { employeeId: "E010", employeeName: "James Lee", amount: "19.50 USD", month: "April", date: "28 / 04 / 2022", reason: "Paid" },
        { employeeId: "E011", employeeName: "Anna Wilson", amount: "33.75 USD", month: "April", date: "29 / 04 / 2022", reason: "Paid" },
        { employeeId: "E012", employeeName: "John Scott", amount: "28.40 USD", month: "April", date: "30 / 04 / 2022", reason: "Pending" },
        { employeeId: "E013", employeeName: "Olivia Taylor", amount: "31.25 USD", month: "April", date: "01 / 05 / 2022", reason: "Paid" },
        { employeeId: "E014", employeeName: "Chris Anderson", amount: "37.90 USD", month: "April", date: "02 / 05 / 2022", reason: "Pending" },
        { employeeId: "E015", employeeName: "Sophia Harris", amount: "29.65 USD", month: "April", date: "03 / 05 / 2022", reason: "Paid" },
        { employeeId: "E016", employeeName: "Matthew Clark", amount: "35.50 USD", month: "April", date: "04 / 05 / 2022", reason: "Pending" },
        { employeeId: "E017", employeeName: "Charlotte Lewis", amount: "32.80 USD", month: "April", date: "05 / 05 / 2022", reason: "Paid" },
        { employeeId: "E018", employeeName: "Ethan Walker", amount: "24.90 USD", month: "April", date: "06 / 05 / 2022", reason: "Pending" },
        { employeeId: "E019", employeeName: "Ava Young", amount: "26.75 USD", month: "April", date: "07 / 05 / 2022", reason: "Paid" },
        { employeeId: "E020", employeeName: "Daniel King", amount: "38.20 USD", month: "April", date: "08 / 05 / 2022", reason: "Pending" },
    ];
    
    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );


     // Send filtered data to parent
     useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="table-container">
            <h3>Advance Salary Reports</h3>
            <table>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Amount</th>
                        <th>Month</th>
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
                            <td className="bold-fonts">{row.amount}</td>
                            <td>{row.month}</td>
                            <td>{row.date}</td>
                            <td><span className={row.reason.toLowerCase()}>{row.reason}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Advance_Salary_Reports;
