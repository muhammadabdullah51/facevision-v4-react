import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const AllowanceReports = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchAllowances = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}assign-allowances/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching assign-allowances data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter(
      (item) =>
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.allowanceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.allowanceAmount
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [searchQuery, data]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  useEffect(() => {
    fetchAllowances();
  }, [fetchAllowances]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Allowance Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>Allowances Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Allowance Name</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bonus) => (
                <tr key={bonus.id}>
                  <td>{bonus.id}</td>
                  <td>{bonus.employeeId}</td>
                  <td className="bold-fonts">{bonus.empName}</td>
                  <td className="bold-fonts">{bonus.allowanceName}</td>
                  <td className="bold-fonts">{bonus.allowanceAmount}</td>
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

export default AllowanceReports;
