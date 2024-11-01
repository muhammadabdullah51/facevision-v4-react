import React, { useEffect } from "react";
// import '../Dashboard_Table/dashboard_table.css';
import "../../Dashboard/dashboard.css"



const Advance_Salary_Reports = ({searchQuery, sendDataToParent  }) => {

    

    // Updated data structure to match new headings
    const data = [
        { employeeId: "E001", employeeName: "Ayesha Khan", amount: "34.55 USD", month: "April", date: "12 / 04 / 2022", reason: "Pending" },
        { employeeId: "E002", employeeName: "Fatima Ahmed", amount: "18.42 USD", month: "April", date: "16 / 04 / 2022", reason: "Pending" },
        { employeeId: "E003", employeeName: "Omar Ali", amount: "21.55 USD", month: "April", date: "17 / 04 / 2022", reason: "Paid" },
        { employeeId: "E004", employeeName: "Hassan Mahmood", amount: "42.19 USD", month: "April", date: "20 / 04 / 2022", reason: "Paid" },
        { employeeId: "E005", employeeName: "Zainab Hussain", amount: "27.30 USD", month: "April", date: "22 / 04 / 2022", reason: "Pending" },
        { employeeId: "E006", employeeName: "Yusuf Rashid", amount: "30.75 USD", month: "April", date: "23 / 04 / 2022", reason: "Paid" },
        { employeeId: "E007", employeeName: "Amina Ibrahim", amount: "25.60 USD", month: "April", date: "25 / 04 / 2022", reason: "Pending" },
        { employeeId: "E008", employeeName: "Ahmed Jamal", amount: "40.00 USD", month: "April", date: "26 / 04 / 2022", reason: "Paid" },
        { employeeId: "E009", employeeName: "Mariam Hassan", amount: "22.15 USD", month: "April", date: "27 / 04 / 2022", reason: "Pending" },
        { employeeId: "E010", employeeName: "Bilal Shaikh", amount: "19.50 USD", month: "April", date: "28 / 04 / 2022", reason: "Paid" },
        { employeeId: "E011", employeeName: "Safiya Khan", amount: "33.75 USD", month: "April", date: "29 / 04 / 2022", reason: "Paid" },
        { employeeId: "E012", employeeName: "Zaid Malik", amount: "28.40 USD", month: "April", date: "30 / 04 / 2022", reason: "Pending" },
        { employeeId: "E013", employeeName: "Sara Yusuf", amount: "31.25 USD", month: "April", date: "01 / 05 / 2022", reason: "Paid" },
        { employeeId: "E014", employeeName: "Ismail Ahmed", amount: "37.90 USD", month: "April", date: "02 / 05 / 2022", reason: "Pending" },
        { employeeId: "E015", employeeName: "Sofia Karim", amount: "29.65 USD", month: "April", date: "03 / 05 / 2022", reason: "Paid" },
        { employeeId: "E016", employeeName: "Mohammed Abbas", amount: "35.50 USD", month: "April", date: "04 / 05 / 2022", reason: "Pending" },
        { employeeId: "E017", employeeName: "Layla Tariq", amount: "32.80 USD", month: "April", date: "05 / 05 / 2022", reason: "Paid" },
        { employeeId: "E018", employeeName: "Ebrahim Shah", amount: "24.90 USD", month: "April", date: "06 / 05 / 2022", reason: "Pending" },
        { employeeId: "E019", employeeName: "Nadia Khan", amount: "26.75 USD", month: "April", date: "07 / 05 / 2022", reason: "Paid" },
        { employeeId: "E020", employeeName: "Tariq Ali", amount: "38.20 USD", month: "April", date: "08 / 05 / 2022", reason: "Pending" },
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
        <div className="departments-table">
            <h3>Advance Salary Reports</h3>
            <table className="table">
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
