import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Absent_Summary_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeMap, setEmployeeMap] = useState({}); // Store employee data mapping
  const [departments, setDepartments] = useState(["All Departments"]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");

  // Fetch employee data for department information
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      // Create mapping: employeeId -> department
      const map = {};
      const deptSet = new Set(["All Departments"]);

      response.data.forEach(emp => {
        map[emp.empId] = emp.department;
        if (emp.department) {
          deptSet.add(emp.department);
        }
      });

      setEmployeeMap(map);
      setDepartments(Array.from(deptSet));
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }, []);


  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-absent/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching assign-allowances data:", error);
    }
  }, [setData]);

  // Filter data based on searchQuery and date range whenever data, searchQuery, fromDate, or toDate changes
  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Get department from employeeMap
      const department = employeeMap[item.empId] || "";

       // Check if matches selected department
      const matchesDepartment = selectedDepartment === "All Departments" || 
        department === selectedDepartment;
      

      // Check if item matches the search query
      const matchesSearchQuery =
        item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        department.toLowerCase().includes(searchQuery.toLowerCase()); // Include department in search

      // Check if item matches the date range
      const matchesDateRange =
        (!fromDate || itemDate >= startDate) &&
        (!toDate || itemDate <= endDate);

      // Return items that match both the search query and the date range
      return matchesSearchQuery && matchesDateRange && matchesDepartment;
    });

    setFilteredData(newFilteredData);
  }, [data, searchQuery, fromDate, toDate, employeeMap, selectedDepartment]); // Added employeeMap as dependency

  // Send filtered data to parent whenever it changes
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  // Fetch data when component mounts or fetchData function changes
  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, [fetchData, fetchEmployees]);

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
          <div className="report-head">
            <h3>Absent Summary Report</h3>

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
              {/* Department Filter Dropdown */}
              <label>
                Department:
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th> {/* New department column */}
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                // Get department from employeeMap
                const department = employeeMap[item.empId] || "N/A";

                return (
                  <tr key={item.id}>
                    <td>{item.empId}</td>
                    <td className="bold-fonts">
                      {item.lName} {item.fName}
                    </td>
                    <td>{department}</td> {/* Display department */}
                    <td>
                      <span className="status absentStatus">Absent</span>
                    </td>
                    <td>{item.date}</td>
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

export default Absent_Summary_Report;