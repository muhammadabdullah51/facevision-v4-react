import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Daily_Late_In_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch data from the server
  const fetchFtm = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-late-in/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Daily Late-In data:", error);
    }
  }, []);

  // Filter data based on search query and date range
  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;

      const matchesSearchQuery =
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emp_fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emp_lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time_out.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange =
        (!fromDate || itemDate >= startDate) &&
        (!toDate || itemDate <= endDate);

      return matchesSearchQuery && matchesDateRange;
    });

    setFilteredData(newFilteredData);
  }, [searchQuery, data, fromDate, toDate]);

  // Notify parent component of filtered data
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  // Fetch data on component mount
  useEffect(() => {
    fetchFtm();
  }, [fetchFtm]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Late In Record For Today.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
          <h3>Daily Late In Report</h3>

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

export default Daily_Late_In_Report;
