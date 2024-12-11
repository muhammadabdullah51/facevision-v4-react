import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const TaxReport = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(""); // Start date for the filter
  const [toDate, setToDate] = useState(""); // End date for the filter

  const fetchTax = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}assign-taxes/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching assign-taxes data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date); // Assuming item.date is a valid date string
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Check if item matches the search query
      const matchesSearchQuery =
        item.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empTaxAmount
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.taxName?.toLowerCase().includes(searchQuery.toLowerCase());

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
    fetchTax();
  }, [fetchTax]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Tax Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
            <h3>Tax Report</h3>
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
                <th>Bonus ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Tax Name</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.id}</td>
                  <td>{bonus.employeeId}</td>
                  <td className="bold-fonts">{bonus.empName}</td>
                  <td className="bold-fonts">{bonus.taxName}</td>
                  <td className="bold-fonts">{bonus.empTaxAmount}</td>
                  <td>{bonus.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default TaxReport;
