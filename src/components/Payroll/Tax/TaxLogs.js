import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../../Dashboard/dashboard.css";
import { SERVER_URL } from "../../../config";
const TaxLogs = () => {
  const [data, setData] = useState([]);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-ext/`);
      setData(response.data);
    } catch (error) {
    }
  }, [setData]);


  // Fetch the data when the component mounts
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const [searchQuery, setSearchQuery] = useState("");



  const filteredData = data.filter(
    (item) =>
      item.id?.toString().includes(searchQuery) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount?.toString().includes(searchQuery) ||
      item.percent?.toString().includes(searchQuery) ||
      item.date?.toString().includes(searchQuery) ||
      item.nature?.toLowerCase().includes(searchQuery.toLowerCase())

  );


  return (
    <div className="department-table">

      <div className="table-header">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <button type="submit">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="search"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="input"
            type="text"
          />
          <button
            className="reset"
            type="button" // Change to type="button" to prevent form reset
            onClick={() => setSearchQuery("")} // Clear the input on click
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>
      </div>


      <div className="departments-table">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Nature</th>
              <th>Amount / Percent</th>
              <th>Date</th>
              <th>Employee Id</th>
              <th>Employee Name</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((adv) => (
              <tr key={adv.id}>
                <td>{adv.id}</td>
                <td className="bold-fonts">{adv.name}</td>
                <td>{adv.nature}</td>
                <td>{adv.amount === 0 ? adv.percent : adv.amount} {adv.nature == 'percentage' ? '%' : 'Rs'}</td>
                <td>{adv.date}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.emp_Name}</td>
                <td className="bold-fonts">{adv.department}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TaxLogs;
