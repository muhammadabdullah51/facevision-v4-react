import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Leave_Summary_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch data from the server
  const fetch_d_ot = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}att-lv-cr/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Daily Overtime data:", error);
    }
  }, []);

  // Filter data based on search query and date range
  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;
      
      // Convert created_at to Date for comparison
      const createdAtDate = new Date(item.created_at);
      const startDateValid = !fromDate || createdAtDate >= startDate;
      const endDateValid = !toDate || createdAtDate <= endDate;

      // Check if item matches the search query
      const matchesSearchQuery =
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.leave_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.start_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.end_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.created_at.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.worked_hours.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.extra_hours.toLowerCase().includes(searchQuery.toLowerCase());

      // Return items that match both the search query and the date range
      return matchesSearchQuery && startDateValid && endDateValid;
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
    fetch_d_ot();
  }, [fetch_d_ot]);

  return (
    <>
      {data.length < 1 ? (
        <div className="baandar">
          <img src={error} alt="No Data Found" />
          <h4>No Leave Summary Record.</h4>
        </div>
      ) : (
        <div className="departments-table">
          <div className="report-head">
            <h3>Leaves Summary Report</h3>
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
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At (Date Filter)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => {
                const createdAtDate = new Date(bonus.created_at).toLocaleDateString();
                return (
                  <tr key={bonus.id}>
                    <td className="bold-fonts">{bonus.empName}</td>
                    <td>{bonus.leave_type}</td>
                    <td className="bold-fonts">{bonus.start_date}</td>
                    <td className="bold-fonts">{bonus.end_date}</td>
                    <td>{createdAtDate}</td>
                    <td>
                      <span
                        className={`status ${
                          bonus.status === "Rejected" ? "absentStatus" : "presentStatus"
                        }`}
                      >
                        {bonus.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Leave_Summary_Report;
