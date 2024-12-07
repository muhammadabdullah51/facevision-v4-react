import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const All_Employees_Salary_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);

const fetchAllEmpSal = useCallback(async () => {
  try {
    const response = await axios.get(`${SERVER_URL}pyr-emp-profile/`);
    console.log(response.data);
    setData(response.data);
  } catch (error) {
    console.error("Error fetching assign-allowances data:", error);
  }
}, [setData]);

useEffect(() => {
  const newFilteredData = data.filter(
    (item) =>
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.attemptWorkingHours
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.basicSalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salaryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salaryPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalWorkingDays.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalWorkingHours
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.totalWorkingMinutes
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.attemptWorkingHours
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredData(newFilteredData);
}, [searchQuery, data]);

useEffect(() => {
  if (filteredData && filteredData.length > 0) {
    sendDataToParent(filteredData);
  }
}, [filteredData, sendDataToParent]);

useEffect(() => {
  fetchAllEmpSal();
}, [fetchAllEmpSal]);


  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Salary Record Yet.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>All Employee Salary Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Overtime Pay</th>
                <th>Overtime Hours</th>
                <th>Extra Fund</th>
                <th>Advance Salary</th>
                <th>Appraisals</th>
                <th>Loan</th>
                <th>Bonus</th>
                <th>Period</th>
                <th>Basic</th>
                <th>Type</th>
                <th>Total Working Days</th>
                <th>Total Working Hours</th>
                <th>Attempt Working Hours</th>
                <th>Daily Salary</th>
                <th>Pay</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.empId}</td>
                  <td>{item.empName}</td>
                  <td>{item.otHoursPay}</td>
                  <td>{item.otHours}</td>
                  <td>{item.extraFund}</td>
                  <td>{item.advSalary}</td>
                  <td>{item.app}</td>
                  <td>{item.loan}</td>
                  <td>{item.bonus}</td>
                  <td>{item.salaryPeriod}</td>
                  <td>{item.basicSalary}</td>
                  <td>{item.salaryType}</td>
                  <td>{item.totalWorkingDays}</td>
                  <td>{item.totalWorkingHours}</td>
                  <td>{item.attempt_working_hours}</td>
                  <td>{item.dailySalary}</td>
                  <td>{item.calculate_pay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default All_Employees_Salary_Report;
