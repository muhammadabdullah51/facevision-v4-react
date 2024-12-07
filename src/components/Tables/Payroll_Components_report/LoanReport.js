import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const LoanReport = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(""); // State for the start date of the filter
  const [toDate, setToDate] = useState(""); // State for the end date of the filter
  
  const fetchLoan = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-loan/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  }, [setData]);
  
  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date); // Assuming 'date' field in item is a valid date string
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
  
      // Check if item matches the search query
      const matchesSearchQuery =
        item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empId?.toString().includes(searchQuery) ||
        item.paid?.toString().toLowerCase().includes(searchQuery) ||
        item.pendingAmount?.toString().toLowerCase().includes(searchQuery) ||
        item.paidAmount?.toLowerCase().includes(searchQuery) ||
        item.returnInMonths?.toString().toLowerCase().includes(searchQuery) ||
        item.nextPayable?.toString().toLowerCase().includes(searchQuery) ||
        item.reason?.toString().toLowerCase().includes(searchQuery) ||
        item.givenLoan?.toString().toLowerCase().includes(searchQuery);
  
      // Check if item matches the date range
      const matchesDateRange =
        (!fromDate || itemDate >= startDate) && (!toDate || itemDate <= endDate);
  
      // Return items that match both the search query and the date range
      return matchesSearchQuery && matchesDateRange;
    });
  
    setFilteredData(newFilteredData);
  }, [searchQuery, data, fromDate, toDate]); // Dependencies include data, searchQuery, fromDate, and toDate
  
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);
  
  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);
  
  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Loan Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
          <h3>Loan Report</h3>
            <div className="date-search">
              <label>
                From:
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </label>

              <label>
                To:
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </label>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Given Loan</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Return In Months</th>
                <th>Next Month Payable</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((adv) => (
                <tr key={adv.id}>
                  <td>{adv.id}</td>
                  <td>{adv.empId}</td>
                  <td className="bold-fonts">{adv.empName}</td>
                  <td>{adv.givenLoan}</td>
                  <td>{adv.paidAmount}</td>
                  <td>{adv.pendingAmount}</td>
                  <td>{adv.returnInMonths}</td>
                  <td>{adv.nextPayable}</td>
                  <td>{adv.date}</td>
                  <td>{adv.reason}</td>
                  <td>
                    <span
                      className={`status ${
                        adv.status === "Rejected"
                          ? "absentStatus"
                          : adv.status === "Pending"
                          ? "lateStatus"
                          : "presentStatus"
                      }`}
                    >
                      {adv.status}
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

export default LoanReport;
