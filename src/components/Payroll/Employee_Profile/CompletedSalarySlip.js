import React, { useCallback, useEffect, useState } from "react";
import "./salarySlip.css"; // Reuse the same styles
import SERVER_URL from "../../../config";
import axios from "axios";

const CompletedSalarySlip = ({ salaryDetails, preview }) => {
    const {
        allowance_items = [],
        bonus_items = [],
        tax_items = [],
        appraisal_items = [],
        calculate_pay,
        basicSalary,
        advSalary,
        otHoursPay,
        loan,
        extraFund,
        allowance,
        bonus,
        app,
        taxes
    } = salaryDetails;

    const [data, setData] = useState([]);

    console.log(salaryDetails);

   
    const fetchPyrSett = useCallback(async () => {
        try {
            const response = await axios.get(`${SERVER_URL}sett-adv-pyr/`);
            const fetchedData = response.data[0];
            setData(fetchedData)
            console.log(fetchedData);
        } catch (error) {
            console.error('Error fetching payroll settings:', error);
        }
    }, []);

    useEffect(() => {
        fetchPyrSett();
    }, [fetchPyrSett]);




    return (
        <div className={`salary-slip ${preview ? 'preview-mode' : ''}`}
            style={preview ? { padding: '0' } : { position: "relative" }}
        >
            {/* Header Section */}
            <header className="header-salary">
                <div className={`cmp-detail ${preview ? 'preview-header' : ''}`}>
                    <div className="logo-controller">
                            <img
                                src={`${SERVER_URL}${salaryDetails.company_logo}`}
                                alt="logo"
                            />
                            
                    </div>
                    <div className="logo-text">
                        <h2>{salaryDetails.company_name}</h2>
                        <p>Salary Slip</p>
                    </div>
                </div>
                <div>
                    <h3>
                        {" "}
                        <small>Salary Period</small> {salaryDetails.salaryPeriod}
                    </h3>
                </div>
            </header>


            {/* Employee Details */}
            <section className="employee-details">
                <div>
                    <p>
                        <strong>Employee ID:</strong> {salaryDetails.empId}
                    </p>
                    <p>
                        <strong>Employee Name:</strong> {salaryDetails.empName}
                    </p>
                    <p>
                        <strong>Department Name:</strong> {salaryDetails.department}
                    </p>
                    <p>
                        <strong>Bank Name:</strong> {salaryDetails.bankName}
                    </p>
                    <p>
                        <strong>Account Number:</strong> {salaryDetails.accountNo}
                    </p>
                    <p>
                        <strong>Salary Type:</strong> {salaryDetails.salaryType}
                    </p>
                </div>
                <div>
                    <p>
                        <strong>Total Working Days:</strong>{" "}
                        {salaryDetails.totalWorkingDays}
                    </p>
                    <p>
                        <strong>Total Working Hours:</strong>{" "}
                        {salaryDetails.totalWorkingMinutes}
                    </p>
                    <p>
                        <strong>Total Working Minutes:</strong>{" "}
                        {salaryDetails.totalWorkingHours}
                    </p>
                    <p>
                        <strong>Attempted Working Hours:</strong>{" "}
                        {salaryDetails.attempt_working_hours}
                    </p>
                </div>
            </section>

            {/* Earnings and Deductions */}
            <section className="earnings-deductions">
                <div className="tableSalary">
                    <h4>Earnings</h4>
                    <table>
                        <thead>
                            <tr>
                                <th className="th-component th-sr">Sr</th>
                                <th className="th-component">Component</th>
                                <th className="th-amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Basic Salary</td>
                                <td>Rs. {basicSalary}</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Overtime Hours Pay</td>
                                <td>Rs. {otHoursPay}</td>
                            </tr>
                            {/* Allowances */}
                           <tr>
                                <td>2</td>
                                <td>Allowances</td>
                                <td>Rs. {salaryDetails.allowance}</td>
                            </tr>
                           <tr>
                                <td>3</td>
                                <td>Appraisals</td>
                                <td>Rs. {salaryDetails.app}</td>
                            </tr>
                           <tr>
                                <td>4</td>
                                <td>Bonus</td>
                                <td>Rs. {salaryDetails.bonus}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Deductions Table */}
                <div className="tableSalary">
                    <h4>Deductions</h4>
                    <table>
                        <thead>
                            <tr>
                                <th className="th-component th-sr">Sr</th>
                                <th className="th-component">Component</th>
                                <th className="th-amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Advance Salary</td>
                                <td>Rs. {salaryDetails.advSalary}</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Loan</td>
                                <td>Rs. {salaryDetails.loan}</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Extra Fund</td>
                                <td>Rs. {extraFund}</td>
                            </tr>
                           <tr>
                                <td>4</td>
                                <td>Taxes</td>
                                <td>Rs. {salaryDetails.taxes}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Revised Earnings */}
            <section className="earnings-deductions">
                <div className="tableSalary">
                    <h4>Revised Earnings</h4>
                    <table>
                        <thead>
                            <tr>
                                <th className="th-component th-sr">Sr</th>
                                <th className="th-component">Component</th>
                                <th className="th-amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Original Pay</td>
                                <td>Rs. {calculate_pay}</td>
                            </tr>
                            {/* Allowance Items */}
                            {allowance_items.map((item, index) => (
                                <tr key={`rev-allowance-${index}`}>
                                    <td>{index + 2}</td>
                                    <td>Additional Allowance</td>
                                    {/* <td>{item.name}</td> */}
                                    <td>Rs. {item.amount}</td>
                                </tr>
                            ))}
                            {/* Bonus Items */}
                            {bonus_items.map((item, index) => (
                                <tr key={`rev-bonus-${index}`}>
                                    <td>{allowance_items.length + index + 2}</td>
                                    <td>Additional Bonus</td>
                                    {/* <td>{item.name}</td> */}
                                    <td>Rs. {item.amount}</td>
                                </tr>
                            ))}
                            {/* Appraisal Items */}
                            {appraisal_items.map((item, index) => (
                                <tr key={`rev-appraisal-${index}`}>
                                    <td>{allowance_items.length + bonus_items.length + index + 2}</td>
                                    <td>Additional Appraisals</td>
                                    {/* <td>{item.name}</td> */}
                                    <td>Rs. {item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Revised Deductions */}
                <div className="tableSalary">
                    <h4>Revised Deductions</h4>
                    <table>
                        <thead>
                            <tr>
                                <th className="th-component th-sr">Sr</th>
                                <th className="th-component">Component</th>
                                <th className="th-amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tax_items.map((item, index) => (
                                <tr key={`rev-tax-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>Additional Tax</td>
                                    {/* <td>{item.name}</td> */}
                                    <td>Rs. {item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Revised Earnings */}


            {/* Final Summary */}
            <section className="summary">
                <p><strong>Final Net Pay:</strong> Rs. {calculate_pay}</p>
            </section>

            <footer className="footer-salary">
                {data
                    ? <h4>{data.endingNote}</h4>
                    : <p>Loading note…</p>
                }
            </footer>
        </div>
    );
};

export default CompletedSalarySlip;