import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Daily_Fulltime_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);

  const fetchFtm = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-full-time/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Daily full time data:", error);
    }
  }, [setData]);

  const filteredData = data.filter(
    (item) =>
      item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emp_fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emp_lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.time_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.time_out.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchFtm();
    sendDataToParent(filteredData);
  }, [fetchFtm]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Fulltime Record For Today.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>Daily Fulltime Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.employeeId}</td>
                  <td className="bold-fonts">
                    {bonus.emp_fName} {bonus.emp_lName}
                  </td>
                  <td className="bold-fonts">{bonus.time_in}</td>
                  <td className="bold-fonts">{bonus.time_out}</td>
                  <td>{bonus.locName}</td>
                  <td>{bonus.date}</td>
                  <td>
                    <span
                      className={`status ${
                        bonus.status === "Present"
                          ? "presentStatus"
                          : bonus.status === "Late"
                          ? "lateStatus"
                          : bonus.status === "Absent"
                          ? "absentStatus"
                          : "none"
                      }`}
                    >
                      {bonus.status}
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

export default Daily_Fulltime_Report;
