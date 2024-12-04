import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const ExtraFundsReport = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const fetchExtraFunds = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-ext/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ExtraFundsReport data:", error);
    }
  }, [setData]);

  const filteredData = data.filter(
    (item) =>
      item.empId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.paid?.toLowerCase().includes(searchQuery) ||
      item.pendingAmount?.toLowerCase().includes(searchQuery) ||
      item.nextPayable?.toLowerCase().includes(searchQuery) ||
      item.date?.toLowerCase().includes(searchQuery) ||
      item.extraFundAmount?.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    fetchExtraFunds();
    sendDataToParent(filteredData);
  }, [fetchExtraFunds]);

  return (
    <>
    {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Extra Funds Record Found.</h4>
          </div>
        </>
      ) : (
    <div className="departments-table">
      <h3>Extra Funds Report</h3>
      <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Extra Funds Amount</th>
              <th>Paid Amount</th>
              <th>Pending Amount</th>
              <th>Return In Months</th>
              <th>Next Month Payable</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((adv) => (
              <tr key={adv.id}>
                <td>{adv.id}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.empName}</td>
                <td>{adv.extraFundAmount}</td>
                <td>{adv.paidAmount}</td>
                <td>{adv.pendingAmount}</td>
                <td>{adv.returnInMonths}</td>
                <td>{adv.nextPayable}</td>
                <td>{adv.date}</td>
                <td>{adv.reason}</td>
                <td>
                  <span
                    className={`status ${
                        adv.type === "payable"
                        ? "absentStatus"
                        : adv.type === "Rejected"
                        ? "absentStatus"
                        : "presentStatus"
                    }`}
                    >
                    {adv.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    )}
            </>
  );
};

export default ExtraFundsReport;
