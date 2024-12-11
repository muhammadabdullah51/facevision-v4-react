import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";
const Daily_Absent_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [fromDate, setFromDate] = useState(""); // State for start date
  const [toDate, setToDate] = useState(""); // State for end date

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-absent/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching assign-allowances data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

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

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {data.length < 1 ? (
        <div className="baandar">
          <img src={error} alt="No Data Found" />
          <h4>No Absent Employee For Today.</h4>
        </div>
      ) : (
        <div className="departments-table">
          <div className="report-head">
            <h3>Daily Absent Report</h3>

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

          {/* Date range search inputs */}

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
export default Daily_Absent_Report;
