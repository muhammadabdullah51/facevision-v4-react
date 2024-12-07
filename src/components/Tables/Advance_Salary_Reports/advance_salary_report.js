import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Advance_Salary_Reports = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(""); // Start date for the filter
  const [toDate, setToDate] = useState(""); // End date for the filter

  const fetchAdvSal = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-adv/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching pyr-adv data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date); // Assuming item.date is a valid date string
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Check if item matches the search query
      const matchesSearchQuery =
        item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empId?.toString().includes(searchQuery) ||
        item.date?.toLowerCase().includes(searchQuery) ||
        item.month?.toLowerCase().includes(searchQuery) ||
        item.reason?.toLowerCase().includes(searchQuery);

      // Check if item matches the date range
      const matchesDateRange =
        (!fromDate || itemDate >= startDate) &&
        (!toDate || itemDate <= endDate);

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
    fetchAdvSal();
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
          <div className="report-head">
            <h3>Advance Salary Report</h3>
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
