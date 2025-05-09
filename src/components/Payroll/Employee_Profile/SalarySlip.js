import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./salarySlip.css";
import { SERVER_URL } from "../../../config";
import axios from "axios";

const SalarySlip = ({ salaryDetails, preview, deductions = {} }) => {
  const mergedData = useMemo(() => ({
    ...salaryDetails,
    allowances: [
      ...(salaryDetails.allowances || []),
      ...(deductions.allowances || []).map(a => ({
        allowanceName: a.label?.split(' (')[0] || 'Allowance',
        amount: a.amount
      }))
    ],
    bonuses: [
      ...(salaryDetails.bonuses || []), 
      ...(deductions.bonuses || []).map(b => ({
        bonusName: b.label?.split(' (')[0] || 'Bonus',
        bonusAmount: b.amount
      }))
    ],
    taxes: [
      ...(salaryDetails.taxes || []),
      ...(deductions.taxes || []).map(t => ({
        taxName: t.label?.split(' (')[0] || 'Tax',
        ...t
      }))
    ],
    appraisals: [
      ...(salaryDetails.appraisals || []),
      ...(deductions.appraisals || []).map(a => ({
        appraisalName: a.label?.split(' (')[0] || 'Appraisal',
        appraisalAmount: a.amount
      }))
    ]
  }), [salaryDetails, deductions]);
  
  const [data, setData] = useState([]);


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
    <>
      <div className={`salary-slip ${preview ? 'preview-mode' : ''}`}
        style={preview ? { padding: '0' } : {position : "relative"}}
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
                  <td>Rs. {salaryDetails.basicSalary}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Overtime Hours Pay</td>
                  <td>Rs. {salaryDetails.otHoursPay}</td>
                </tr>
                
                {/* Mapped Bonuses */}
                {(salaryDetails.bonuses || []).map((bonus, index) => (
                  <tr key={`bonus-${index}`}>
                    <td>{3 + index}</td>
                    <td>{bonus.bonusName}</td>
                    <td>Rs. {bonus.bonusAmount}</td>
                  </tr>
                ))}

                {/* Mapped Appraisals */}
                {(salaryDetails.appraisals || []).map((appraisal, index) => (
                  <tr key={`appraisal-${index}`}>
                    <td>{3 + (salaryDetails.bonuses?.length || 0) + index}</td>
                    <td>{appraisal.appraisalName}</td>
                    <td>Rs. {appraisal.appraisalAmount}</td>
                  </tr>
                ))}

                {/* Mapped Allowances */}
                {(salaryDetails.allowances || []).map((allowance, index) => (
                  <tr key={`allowance-${index}`}>
                    <td>{3 + 
                         (salaryDetails.bonuses?.length || 0) + 
                         (salaryDetails.appraisals?.length || 0) + 
                         index}</td>
                    <td>{allowance.allowanceName}</td>
                    <td>Rs. {allowance.amount}</td>
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

        <footer className="footer-salary">
          {data
            ? <h4>{data.endingNote}</h4>
            : <p>Loading note…</p>
          }
        </footer>
      </div>
    </>
  );
};

export default SalarySlip;
