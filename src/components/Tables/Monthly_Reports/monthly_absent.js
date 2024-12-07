import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";
const Monthly_Absent_Report = ({ searchQuery, sendDataToParent }) => {
  

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    
    // Fetch data from the server
    const fetchData = useCallback(async () => {
      try {
        const response = await axios.get(`${SERVER_URL}rp-att-all-absent/`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching absent data:", error);
      }
    }, []);
    
    // Filter data based on search query and date range
    useEffect(() => {
      const newFilteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = fromDate ? new Date(fromDate) : null;
        const endDate = toDate ? new Date(toDate) : null;
    
        const matchesSearchQuery =
          item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);
    
    // Fetch data on component mount
    useEffect(() => {
      fetchData();
    }, [fetchData]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Absent Employee For Today.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
          <h3>Monthly Absent Report</h3>

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
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.empId}</td>
                  <td className="bold-fonts">
                     {bonus.lName} {bonus.fName}
                  </td>
                  <td>
                    {" "}
                    <span className="status absentStatus">Absent</span>
                  </td>
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

export default Monthly_Absent_Report;
