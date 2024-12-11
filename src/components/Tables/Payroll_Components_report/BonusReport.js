import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const BonusReport = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [fromDate, setFromDate] = useState(""); 
const [toDate, setToDate] = useState(""); 

const fetchBonus = useCallback(async () => {
  try {
    const response = await axios.get(`${SERVER_URL}pyr-asg-bns/`);
    setData(response.data);
  } catch (error) {
    console.error("Error fetching Bonus data:", error);
  }
}, [setData]);

useEffect(() => {
  const newFilteredData = data.filter((item) => {
    const itemDate = new Date(item.bonusAssignDate);
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Check if item matches the search query
    const matchesSearchQuery =
      item.bonusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bonusAssignDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bonusAmount.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if item matches the date range
    const matchesDateRange =
      (!fromDate || itemDate >= startDate) && (!toDate || itemDate <= endDate);

    // Return items that match both the search query and the date range
    return matchesSearchQuery && matchesDateRange;
  });

  setFilteredData(newFilteredData);
}, [searchQuery, data, fromDate, toDate]); // Dependencies include data, searchQuery, fromDate, toDate

useEffect(() => {
  if (filteredData && filteredData.length > 0) {
    sendDataToParent(filteredData);
  }
}, [filteredData, sendDataToParent]);

useEffect(() => {
  fetchBonus();
}, [fetchBonus]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Bonus Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
          <h3>Bonus Report</h3>
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
                <th>Bonus Name</th>
                <th>Amount</th>
                <th>Awarded Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.id}</td>
                  <td>{bonus.empId}</td>
                  <td className="bold-fonts">{bonus.empName}</td>
                  <td>{bonus.bonusName}</td>
                  <td className="bold-fonts">{bonus.bonusAmount}</td>
                  <td>{bonus.bonusAssignDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default BonusReport;
