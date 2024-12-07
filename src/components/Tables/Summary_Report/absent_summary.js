import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Absent_Summary_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-absent/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching assign-allowances data:", error);
    }
  }, [setData]);

  // Filter data based on searchQuery whenever data or searchQuery changes
  useEffect(() => {
    const newFilteredData = data.filter(
      (item) =>
        item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [data, searchQuery]); // Dependency on both data and searchQuery

  // Send filtered data to parent whenever it changes
  useEffect(() => {
    if (filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts or fetchData function changes
  }, [fetchData]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Absent Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>Absent Summary Report</h3>
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

export default Absent_Summary_Report;
