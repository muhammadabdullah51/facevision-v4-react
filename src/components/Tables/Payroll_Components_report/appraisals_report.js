import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Appraisals_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchAppraisals = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-asg-appr/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching appraisals data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.assign_date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Check if item matches the search query
      const matchesSearchQuery =
        item.empIdVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.appraisalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assign_date?.toString().includes(searchQuery) ||
        item.appr_id?.toString().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())

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
    fetchAppraisals();
  }, [fetchAppraisals]);


  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Appraisals Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
            <h3>Appraisals Report</h3>
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
                <th>Appraisal ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Appraisal Name</th>
                <th>Amount</th>
                <th>Assign Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.appr_id}</td>
                  <td>{bonus.empIdVal}</td>
                  <td className="bold-fonts">{bonus.empName}</td>
                  <td className="bold-fonts">{bonus.appraisalName}</td>
                  <td>{bonus.appraisalAmount}</td>
                  <td>{bonus.assign_date}</td>
                  <td>
                    <span
                      className={`status ${bonus.status === "Pending"
                        ? "lateStatus"
                        : bonus.status === "Rejected"
                          ? "absentStatus"
                          : "presentStatus"
                        }`}
                    >
                      {bonus.status}
                    </span>
                  </td>
                  <td>{bonus.desc}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Appraisals_Report;
