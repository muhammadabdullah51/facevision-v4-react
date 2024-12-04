import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Advance_Salary_Reports = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);

  const fetchAdvSal = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-adv/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching pyr-adv data:", error);
    }
  }, [setData]);

  const filteredData = data.filter(
    (item) =>
        item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.empId?.toString().includes(searchQuery) ||
    item.date?.toLowerCase().includes(searchQuery) ||
    item.month?.toLowerCase().includes(searchQuery) ||
    item.reason?.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    fetchAdvSal();
    sendDataToParent(filteredData);
  }, [fetchAdvSal]);

  return (
    <>
    {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Advance Salary Record Found.</h4>
          </div>
        </>
      ) : (
    <div className="departments-table">
      <h3>Advance Salary Report</h3>
      <table className="table">
          <thead>
            <tr>
              <th>Adv Salary ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Month</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((adv) => (
              <tr key={adv.advSalaryId}>
                <td>{adv.advSalaryId}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.empName}</td>
                <td className="bold-fonts">{adv.amount}</td>
                <td>{adv.reason}</td>
                <td>{adv.date}</td>
                <td>{adv.month}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
    </div>
      )}
                </>
  );
};

export default Advance_Salary_Reports;
