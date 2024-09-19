import React, { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const PayrollLogs = () => {
    const [data, setData] = useState([
        // Sample data with various dates
        { id: 1, employeeId: "E001", name: "John Doe", allottedHours: "160", basicSalary: "$3000", date: "2024-08-25", hoursWorked: "170", accountNo: "1234567890", pay: "$3300" },
        { id: 2, employeeId: "E002", name: "Jane Smith", allottedHours: "160", basicSalary: "$3200", date: "2024-08-28", hoursWorked: "160", accountNo: "0987654321", pay: "$3400" },
        // Add more sample data with different dates
        { id: 3, employeeId: "E003", name: "Alice Johnson", allottedHours: "160", basicSalary: "$3100", date: "2024-09-01", hoursWorked: "150", accountNo: "1122334455", pay: "$3250" },
        { id: 4, employeeId: "E004", name: "Bob Brown", allottedHours: "160", basicSalary: "$2900", date: "2024-09-03", hoursWorked: "165", accountNo: "2233445566", pay: "$3050" },
        { id: 5, employeeId: "E005", name: "Charlie Davis", allottedHours: "160", basicSalary: "$3050", date: "2024-09-05", hoursWorked: "180", accountNo: "3344556677", pay: "$3200" },
        { id: 6, employeeId: "E006", name: "Diana Evans", allottedHours: "160", basicSalary: "$3250", date: "2024-09-08", hoursWorked: "155", accountNo: "4455667788", pay: "$3400" },
        { id: 7, employeeId: "E007", name: "Eric Foster", allottedHours: "160", basicSalary: "$3100", date: "2024-09-10", hoursWorked: "170", accountNo: "5566778899", pay: "$3250" },
        { id: 8, employeeId: "E008", name: "Fiona Green", allottedHours: "160", basicSalary: "$3000", date: "2024-09-12", hoursWorked: "160", accountNo: "6677889900", pay: "$3150" },
        { id: 9, employeeId: "E009", name: "George Harris", allottedHours: "160", basicSalary: "$2900", date: "2024-09-15", hoursWorked: "175", accountNo: "7788990011", pay: "$3050" },
        { id: 10, employeeId: "E010", name: "Hannah Ives", allottedHours: "160", basicSalary: "$3150", date: "2024-09-18", hoursWorked: "165", accountNo: "8899001122", pay: "$3300" },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!startDate || itemDate >= start) &&
            (!endDate || itemDate <= end)
        );
    }).slice(0, 10); // Limit to 10 entries

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Serial No', 'Employee ID', 'Name', 'Allotted Hours', 'Basic Salary', 'Date', 'Hours Worked', 'Account No', 'Pay']],
            body: filteredData.map((item, index) => [
                index + 1, item.employeeId, item.name, item.allottedHours, item.basicSalary, item.date, item.hoursWorked, item.accountNo, item.pay
            ]),
        });
        doc.save('payroll-logs.pdf');
    };

    return (
        <div className="table-container">
            <div className="payroll-header">
                <div className="payroll-header-search">
                    <label>From: </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="input"
                    />
                    <label>To: </label>

                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="input"
                    />
                </div>
                <div className="export-buttons">
                    <button className="export-btn">
                        <CSVLink data={filteredData} filename="payroll-logs.csv">
                            <FontAwesomeIcon icon={faFileCsv} className="button-icon" />
                            Export to CSV
                        </CSVLink>
                    </button>
                    <button className="export-btn" onClick={exportToPDF}>
                        <FontAwesomeIcon icon={faFilePdf} className="button-icon" />
                        Export to PDF
                    </button>
                </div>
            </div>

            <div className="leave-table-outer">

                <table className="leave-table">
                    <thead>
                        <tr>
                            <th>Serial No</th>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Allotted Hours</th>
                            <th>Basic Salary</th>
                            <th>Date</th>
                            <th>Hours Worked</th>
                            <th>Account No</th>
                            <th>Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.employeeId}</td>
                                <td>{item.name}</td>
                                <td>{item.allottedHours}</td>
                                <td>{item.basicSalary}</td>
                                <td>{item.date}</td>
                                <td>{item.hoursWorked}</td>
                                <td>{item.accountNo}</td>
                                <td>{item.pay}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollLogs;
