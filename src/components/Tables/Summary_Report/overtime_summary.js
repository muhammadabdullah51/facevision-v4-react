import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Overtime_Summary_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeMap, setEmployeeMap] = useState({});
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

  // Fetch data from the server
  const fetch_d_ot = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-ot/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Daily Overtime data:", error);
    }
  }, []);

  // Filter data based on search query and date range
  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;

      // Get department from employeeMap
      const department = employeeMap[item.empId] || "";

      // Check if matches selected department
      const matchesDepartment = selectedDepartment === "All Departments" || 
        department === selectedDepartment;

      const matchesSearchQuery =
        item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emp_fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emp_lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time_out.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shift_start.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shift_end.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.worked_hours.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.extra_hours.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange =
        (!fromDate || itemDate >= startDate) &&
        (!toDate || itemDate <= endDate);

      return matchesSearchQuery && matchesDateRange && matchesDepartment;
    });

    setFilteredData(newFilteredData);
  }, [searchQuery, data, fromDate, toDate, employeeMap, selectedDepartment]);

  // Notify parent component of filtered data
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  // Fetch data on component mount
  useEffect(() => {
    fetch_d_ot();
    fetchEmployees();
  }, [fetch_d_ot, fetchEmployees]);

  return (
    <>
      {data.length < 1 ? (
        <div className="baandar">
          <img src={error} alt="No Data Found" />
          <h4>No Overtime Summary Record.</h4>
        </div>
      ) : (
        <div className="departments-table">
          <div className="report-head">
            <h3>Overtime Summary Report</h3>

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
                <th>Department</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Shift Start</th>
                <th>Shift End</th>
                <th>Worked Hours</th>
                <th>Extra Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const department = employeeMap[item.empId] || "N/A";
                return (
                  <tr key={item.id}>
                    <td>{item.empId}</td>
                    <td className="bold-fonts">
                      {item.emp_fName} {item.emp_lName}
                    </td>
                    <td>{department}</td>
                    <td>{item.date}</td>
                    <td className="bold-fonts">{item.time_in}</td>
                    <td className="bold-fonts">{item.time_out}</td>
                    <td>{item.shift_start}</td>
                    <td>{item.shift_end}</td>
                    <td>{item.worked_hours}</td>
                    <td className="bold-fonts">{item.extra_hours}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Overtime_Summary_Report;