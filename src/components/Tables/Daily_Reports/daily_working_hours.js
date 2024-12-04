import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Daily_Working_calcHours_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);

  const fetchWh = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-working-hours/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Daily full time data:", error);
    }
  }, [setData]);

  const filteredData = data.filter(
    (item) =>
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.first_checkin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.last_checkout.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.calcHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchWh();
    sendDataToParent(filteredData);
  }, [fetchWh]);

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
