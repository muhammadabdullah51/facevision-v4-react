import React, { useCallback, useEffect, useState } from "react";
import "./salarySlip.css"; // Reuse the same styles
import SERVER_URL from "../../../config";
import axios from "axios";

const EditedSalarySlip = ({ salaryDetails, preview }) => {
    // Destructure processed data from salaryDetails
    // const {
    //     originalPay,
    //     totalAppraisals,
    //     totalBonuses,
    //     totalAllowances,
    //     totalTaxes,
    //     finalNetPay,
    //     employeeInfo,
    //     deductions
    // } = salaryDetails;

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
        <div className="salary-slip"
            style={preview ? { padding: '0' } : { position: "relative" }}
        >
            {/* Header Section */}
            <header className="header-salary">
                <div className={`cmp-detail ${preview ? 'preview-header' : ''}`}>
                    <div className="logo-controller">
                        <img src={`${SERVER_URL}${salaryDetails.companyLogo}`} alt="logo" />
                    </div>
                    <div className="logo-text">
                        <h2>{salaryDetails.companyName}</h2>
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
                                <td>Rs. {salaryDetails.basicSalary}</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Overtime Hours Pay</td>
                                <td>Rs. {salaryDetails.otHoursPay}</td>
                            </tr>

                            {/* Render all allowances */}
                            {salaryDetails.allowances?.map((allowance, index) => (
                                <tr key={`allowance-${index}`}>
                                    <td>{index + 2}</td>
                                    <td>{allowance.allowanceName}</td>
                                    <td>Rs. {allowance.amount}</td>
                                </tr>
                            ))}
                            {/* Render all bonuses */}
                            {salaryDetails.bonuses?.map((bonus, index) => (
                                <tr key={`bonus-${index}`}>
                                    <td>{salaryDetails.allowances?.length + index + 2}</td>
                                    <td>{bonus.bonusName}</td>
                                    <td>Rs. {bonus.bonusAmount}</td>
                                </tr>
                            ))}
                            {/* Render all appraisals */}
                            {salaryDetails.appraisals?.map((appraisal, index) => (
                                <tr key={`appraisal-${index}`}>
                                    <td>{salaryDetails.allowances?.length + salaryDetails.bonuses?.length + index + 2}</td>
                                    <td>{appraisal.appraisalName}</td>
                                    <td>Rs. {appraisal.appraisalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
                                <td>Rs. {salaryDetails.extraFund}</td>
                            </tr>

                            {/* Mapped Taxes */}
                            {(salaryDetails.taxes || []).map((tax, index) => (
                                <tr key={`tax-${index}`}>
                                    <td>{4 + index}</td>
                                    <td>{tax.taxName}</td>
                                    <td>
                                        Rs. {tax.nature === "fixedamount"
                                            ? tax.amount
                                            : ((parseFloat(salaryDetails.basicSalary) * (tax.percent / 100)).toFixed(2))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Revised Earnings */}
            <section className="earnings-deductions">
                <div className="tableSalary">
                    <h4>Revised Earnings</h4>
                    <table>
                        <tbody>
                            <tr>
                                <td>Original Pay</td>
                                <td>Rs. {salaryDetails.originalPay.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Additional Allowances</td>
                                <td>Rs. {salaryDetails.totalAllowances.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Additional Bonuses</td>
                                <td>Rs. {salaryDetails.totalBonuses.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Appraisal Adjustments</td>
                                <td>Rs. {salaryDetails.totalAppraisals.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Revised Deductions */}
                <div className="tableSalary">
                    <h4>Revised Deductions</h4>
                    <table>
                        <tbody>
                            <tr>
                                <td>Tax Deductions</td>
                                <td>Rs. {salaryDetails.totalTaxes.toFixed(2)}</td>
                            </tr>
                            {/* Add other deductions as needed */}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Final Summary */}
            <section className="summary">
                <p><strong>Final Net Pay:</strong> Rs. {salaryDetails.finalNetPay.toFixed(2)}</p>
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

export default EditedSalarySlip;