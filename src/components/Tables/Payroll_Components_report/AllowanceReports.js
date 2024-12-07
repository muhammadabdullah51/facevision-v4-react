import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const AllowanceReports = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [fromDate, setFromDate] = useState(""); 
const [toDate, setToDate] = useState(""); 

const fetchAllowances = useCallback(async () => {
  try {
    const response = await axios.get(`${SERVER_URL}assign-allowances/`);
    console.log(response.data);
    setData(response.data);
  } catch (error) {
    console.error("Error fetching assign-allowances data:", error);
  }
}, [setData]);

// Filter data based on searchQuery and date range whenever data, searchQuery, fromDate, or toDate changes
useEffect(() => {
  const newFilteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Check if item matches the search query
    const matchesSearchQuery =
      item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.allowanceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.allowanceAmount
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if item matches the date range
    const matchesDateRange =
      (!fromDate || itemDate >= startDate) && (!toDate || itemDate <= endDate);

    // Return items that match both the search query and the date range
    return matchesSearchQuery && matchesDateRange;
  });

  setFilteredData(newFilteredData);
}, [data, searchQuery, fromDate, toDate]); // Dependencies include data, searchQuery, fromDate, toDate

// Send filtered data to parent whenever it changes
useEffect(() => {
  if (filteredData && filteredData.length > 0) {
    sendDataToParent(filteredData);
  }
}, [filteredData, sendDataToParent]);

// Fetch data when component mounts or fetchAllowances function changes
useEffect(() => {
  fetchAllowances();
}, [fetchAllowances]);


  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Allowance Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
          <h3>Allowances Report</h3>
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
                <th>Allowance Name</th>
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
                  <td className="bold-fonts">{bonus.allowanceName}</td>
                  <td className="bold-fonts">{bonus.allowanceAmount}</td>
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

export default AllowanceReports;
