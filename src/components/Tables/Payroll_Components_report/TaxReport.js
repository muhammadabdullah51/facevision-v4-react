import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const TaxReport = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchTax = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}assign-taxes/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching assign-allowances data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter(
      (item) =>
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empTaxAmount
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.taxName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [searchQuery, data]);

  useEffect(() => {
    if (filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  useEffect(() => {
    fetchTax();
  }, [fetchTax]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Tax Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>Tax Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Bonus ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Tax Name</th>
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
                  <td className="bold-fonts">{bonus.taxName}</td>
                  <td className="bold-fonts">{bonus.empTaxAmount}</td>
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

export default TaxReport;
