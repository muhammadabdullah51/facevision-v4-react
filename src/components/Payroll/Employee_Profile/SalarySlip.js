import React from "react";
import "./salarySlip.css";
import { SERVER_URL } from "../../../config";

const SalarySlip = ({ salaryDetails }) => {
  return (
    <>
      <div className="salary-slip">
        {/* Header */}
        <header className="header-salary">
          <div className="cmp-detail">
            <div className="logo-controller">
              <img src={`${SERVER_URL}${salaryDetails.companyLogo}`} alt="" />
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
              {salaryDetails.totalWorkingHours}
            </p>
            <p>
              <strong>Total Working Minutes:</strong>{" "}
              {salaryDetails.totalWorkingMinutes}
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
                  <td className="th-amount">Rs. {salaryDetails.basicSalary}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Overtime Hours Pay</td>
                  <td className="th-amount">Rs. {salaryDetails.otHoursPay}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Bonus</td>
                  <td className="th-amount">Rs. {salaryDetails.bonus}</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Appraisal</td>
                  <td className="th-amount">Rs. {salaryDetails.app}</td>
                </tr>
                {salaryDetails.allowances.map((allowance, index) => (
                  <tr key={index}>
                    <td>{index + 5}</td>
                    <td>{allowance.allowanceName}</td>
                    <td className="th-amount">Rs. {allowance.amount}</td>
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
                  <td className="th-amount">Rs. {salaryDetails.advSalary}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Loan</td>
                  <td className="th-amount">Rs. {salaryDetails.loan}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Extra Fund</td>
                  <td className="th-amount">Rs. {salaryDetails.extraFund}</td>
                </tr>
                {salaryDetails.taxes.map((tax, index) => (
                  <tr key={index}>
                    <td>{index + 4}</td>
                    <td>{tax.taxName}</td>
                    <td className="th-amount">Rs. {tax.deductedAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary */}
        <section className="summary">
          <p>
            <strong>Basic Salary:</strong> Rs. {salaryDetails.basicSalary}
          </p>
          <p>
            <strong>Calculated Pay:</strong> Rs. {salaryDetails.calculate_pay}
          </p>
          <p>
            <strong>Total Overtime Hours:</strong> {salaryDetails.otHours}
          </p>
          <p>
            <strong>Total Net Pay:</strong> Rs. {salaryDetails.calculate_pay}
          </p>
        </section>
      </div>
    </>
  );
};

export default SalarySlip;
