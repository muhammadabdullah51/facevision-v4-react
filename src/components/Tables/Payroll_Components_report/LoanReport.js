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
      const response = await axios.get(`${SERVER_URL}pyr-asg-loan/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.applied_on); // Assuming 'date' field in item is a valid date string
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Check if item matches the search query
      const matchesSearchQuery =
        item.empIdVal?.toString().includes(searchQuery) ||
        item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.loanName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.givenLoan?.toString().includes(searchQuery) ||
        item.returnInMonths?.toString().includes(searchQuery) ||
        item.paidAmount?.toString().includes(searchQuery) ||
        item.pendingAmount?.toString().includes(searchQuery) ||
        item.nextPayable?.toString().includes(searchQuery) ||
        item.assign_date?.toString().includes(searchQuery) ||
        item.applied_on?.toString().includes(searchQuery) ||
        item.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase())

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
                <th>Loan Name</th>
                <th>Given Loan</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Return In Months</th>
                <th>Next Month Payable</th>
                <th>Assign Date</th>
                <th>Applied On</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((adv) => (
                <tr key={adv.id}>
                  <td>{adv.id}</td>
                  <td>{adv.empIdVal}</td>
                  <td className="bold-fonts">{adv.empName}</td>
                  <td className="bold-fonts">{adv.name}</td>
                  <td>{adv.givenLoan}</td>
                  <td>{adv.paidAmount}</td>
                  <td>{adv.pendingAmount}</td>
                  <td>{adv.returnInMonths}</td>
                  <td>{adv.nextPayable}</td>
                  <td>{adv.assign_date}</td>
                  <td>{adv.applied_on}</td>
                  <td>{adv.reason}</td>
                  <td>
                    <span
                      className={`status ${adv.status === "rejected"
                        ? "absentStatus"
                        : adv.status === "pending"
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
