import React from "react";
import "./salarySlip.css";
import { SERVER_URL } from "../../../config";

const SalarySlip = ({ salaryDetails, preview, deductions }) => {
  // const calculateNetPay = () => {
  //   let netPay = parseFloat(salaryDetails.basicSalary) || 0;

  //   // Add allowances
  //   deductions?.allowances?.forEach(allowance => {
  //     netPay += parseFloat(allowance.amount) || 0;
  //   });

  //   // Add bonuses
  //   deductions?.bonuses?.forEach(bonus => {
  //     netPay += parseFloat(bonus.bonusAmount) || 0;
  //   });

  //   // Subtract taxes
  //   deductions?.taxes?.forEach(tax => {
  //     if (tax.nature === "fixedamount") {
  //       netPay -= parseFloat(tax.amount) || 0;
  //     } else {
  //       netPay -= netPay * (parseFloat(tax.percent) / 100) || 0;
  //     }
  //   });

  //   // Subtract loans
  //   deductions?.loans?.forEach(loan => {
  //     netPay -= parseFloat(loan.givenLoan) || 0;
  //   });

  //   // Add other components as needed...

  //   return netPay.toFixed(2);
  // };
  return (
    <>
      <div className={`salary-slip ${preview ? 'preview-mode' : ''}`}
        style={preview ? { padding: '0' } : {}}
      >
        {/* Header */}
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
            {/* <strong>Total Net Pay:</strong> Rs. {calculateNetPay()} */}
          </p>
        </section>
      </div>
    </>
  );
};

export default SalarySlip;
