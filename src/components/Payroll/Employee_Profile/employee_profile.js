import React, { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const EmplyeeProfile = () => {
    const [data, setData] = useState([
        {
            id: 1, employeeId: "E001", name: "John Doe", basicSalary: "$3000", allottedHours: "160", workingHours: "170", overtimeHours: "10", workingDays: "22", bankName: "Bank A", extraFund: "$200", advanceSalary: "$100", accountNo: "1234567890", pay: "$3300"
        },
        {
            id: 2, employeeId: "E002", name: "Jane Smith", basicSalary: "$3200", allottedHours: "160", workingHours: "160", overtimeHours: "0", workingDays: "22", bankName: "Bank B", extraFund: "$150", advanceSalary: "$50", accountNo: "0987654321", pay: "$3400"
        },
        {
            id: 1, employeeId: "E001", name: "John Doe", basicSalary: "$3000", allottedHours: "160", workingHours: "170", overtimeHours: "10", workingDays: "22", bankName: "Bank A", extraFund: "$200", advanceSalary: "$100", accountNo: "1234567890", pay: "$3300"
        },
        {
            id: 2, employeeId: "E002", name: "Jane Smith", basicSalary: "$3200", allottedHours: "160", workingHours: "160", overtimeHours: "0", workingDays: "22", bankName: "Bank B", extraFund: "$150", advanceSalary: "$50", accountNo: "0987654321", pay: "$3400"
        },
        {
            id: 1, employeeId: "E001", name: "John Doe", basicSalary: "$3000", allottedHours: "160", workingHours: "170", overtimeHours: "10", workingDays: "22", bankName: "Bank A", extraFund: "$200", advanceSalary: "$100", accountNo: "1234567890", pay: "$3300"
        },
        {
            id: 2, employeeId: "E002", name: "Jane Smith", basicSalary: "$3200", allottedHours: "160", workingHours: "160", overtimeHours: "0", workingDays: "22", bankName: "Bank B", extraFund: "$150", advanceSalary: "$50", accountNo: "0987654321", pay: "$3400"
        },
        {
            id: 1, employeeId: "E001", name: "John Doe", basicSalary: "$3000", allottedHours: "160", workingHours: "170", overtimeHours: "10", workingDays: "22", bankName: "Bank A", extraFund: "$200", advanceSalary: "$100", accountNo: "1234567890", pay: "$3300"
        },
        {
            id: 2, employeeId: "E002", name: "Jane Smith", basicSalary: "$3200", allottedHours: "160", workingHours: "160", overtimeHours: "0", workingDays: "22", bankName: "Bank B", extraFund: "$150", advanceSalary: "$50", accountNo: "0987654321", pay: "$3400"
        },
    ]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Serial No', 'Employee ID', 'Name', 'Basic Salary', 'Allotted Working Hours', 'Working Hours', 'Overtime Hours', 'Working Days', 'Bank Name', 'Extra Fund', 'Advance Salary', 'Account No', 'Pay']],
            body: filteredData.map((item, index) => [
                index + 1, item.employeeId, item.name, item.basicSalary, item.allottedHours, item.workingHours, item.overtimeHours, item.workingDays, item.bankName, item.extraFund, item.advanceSalary, item.accountNo, item.pay
            ]),
        });
        doc.save('employee-profile.pdf');
    };

    return (
        <div className="table-container">
            <div className="leave-header" style={{paddingBottom:'none'}}>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
          <button type="submit">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="search"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="input"
            type="text"
          />
          <button
            className="reset"
            type="button" // Change to type="button" to prevent form reset
            onClick={() => setSearchQuery("")} // Clear the input on click
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>
                <div className="export-buttons">
                    <button className="export-btn">
                        <CSVLink data={filteredData} filename="employee-profile.csv">
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
                            <th>Basic Salary</th>
                            <th>Allotted Working Hours</th>
                            <th>Working Hours</th>
                            <th>Overtime Hours</th>
                            <th>Working Days</th>
                            <th>Bank Name</th>
                            <th>Extra Fund</th>
                            <th>Advance Salary</th>
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
                                <td>{item.basicSalary}</td>
                                <td>{item.allottedHours}</td>
                                <td>{item.workingHours}</td>
                                <td>{item.overtimeHours}</td>
                                <td>{item.workingDays}</td>
                                <td>{item.bankName}</td>
                                <td>{item.extraFund}</td>
                                <td>{item.advanceSalary}</td>
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

export default EmplyeeProfile;
