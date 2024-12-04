import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Daily_Overtime_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);

  const fetch_d_ot = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-ot/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Daily full time data:", error);
    }
  }, [setData]);

  const filteredData = data.filter(
    (item) =>
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emp_fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emp_lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.time_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.time_out.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shift_start.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shift_end.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.worked_hours.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.extra_hours.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  useEffect(() => {
    fetch_d_ot();
    sendDataToParent(filteredData);
  }, [fetch_d_ot]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Daily Overtime Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>Daily Overtime Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Shift Start</th>
                <th>Shift End</th>
                <th>Worked Hours</th>
                <th>Extra Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.empId}</td>
                  <td className="bold-fonts">{bonus.emp_fName} {bonus.emp_lName}</td>
                  <td >{bonus.date}</td>
                  <td className="bold-fonts">{bonus.time_in}</td>
                  <td className="bold-fonts">{bonus.time_out}</td>
                  <td >{bonus.shift_start}</td>
                  <td >{bonus.shift_end}</td>
                  <td >{bonus.worked_hours}</td>
                  <td className="bold-fonts">{bonus.extra_hours}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Daily_Overtime_Report;
