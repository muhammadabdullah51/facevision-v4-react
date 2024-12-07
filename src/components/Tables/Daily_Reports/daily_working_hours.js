import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Daily_Working_calcHours_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);

// Fetch the data for the child component
const fetchWh = useCallback(async () => {
  try {
    const response = await axios.get(`${SERVER_URL}rp-att-all-working-hours/`);
    console.log(response.data);
    setData(response.data);
  } catch (error) {
    console.error("Error fetching Daily full time data:", error);
  }
}, [setData]);

// Filter the data based on the searchQuery
useEffect(() => {
  const newFilteredData = data.filter(
    (item) =>
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.first_checkin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.last_checkout.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.calcHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredData(newFilteredData);
}, [searchQuery, data]); // Re-run whenever searchQuery or data changes

// Send filtered data to parent component
useEffect(() => {
  if (filteredData && filteredData.length > 0) {
    sendDataToParent(filteredData);
  }
}, [filteredData, sendDataToParent]); // Send data to parent when filteredData changes

// Fetch the data when the component mounts
useEffect(() => {
  fetchWh();
}, [fetchWh]); // Only call fetchWh when the component mounts

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Daily Working Hours Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>Daily Working Hours Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>First Checkin</th>
                <th>Last Checkout</th>
                <th>Working Hours</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.empId}</td>
                  <td className="bold-fonts">{bonus.name}</td>
                  <td className="bold-fonts">{bonus.first_checkin}</td>
                  <td className="bold-fonts">{bonus.last_checkout}</td>
                  <td>{bonus.calcHours}</td>
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

export default Daily_Working_calcHours_Report;
