import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const All_Attendance_Summary_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeMap, setEmployeeMap] = useState({});
  const [departments, setDepartments] = useState(["All Departments"]);
  const [locations, setLocations] = useState(["All Locations"]);
  const [shifts, setShifts] = useState(["All Shifts"]);
  const [designations, setDesignations] = useState(["All Designations"]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedShift, setSelectedShift] = useState("All Shifts");
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations");

  // Fetch employee data for department, location, shift, and designation
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      // Create mapping: employeeId -> employee data
      const map = {};
      const deptSet = new Set(["All Departments"]);
      const shiftSet = new Set(["All Shifts"]);
      const designationSet = new Set(["All Designations"]);
      
      response.data.forEach(emp => {
        map[emp.empId] = {
          department: emp.department,
          shift: emp.shift,
          designation: emp.designation,
          locations: emp.enrollSite || []
        };
        
        if (emp.department) deptSet.add(emp.department);
        if (emp.shift) shiftSet.add(emp.shift);
        if (emp.designation) designationSet.add(emp.designation);
      });
      
      setEmployeeMap(map);
      setDepartments(Array.from(deptSet));
      setShifts(Array.from(shiftSet));
      setDesignations(Array.from(designationSet));
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }, []);

  // Fetch location data
  const fetchLocations = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-loc/`);
      if (response.data.status && response.data.context) {
        const locNames = response.data.context.map(loc => loc.name);
        setLocations(["All Locations", ...locNames]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);

  // Fetch designation data
  const fetchDesignations = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-dsg/`);
      if (response.data.status && response.data.context) {
        const dsgNames = response.data.context.map(dsg => dsg.name);
        setDesignations(prev => [...new Set([...prev, ...dsgNames])]);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  }, []);

  // Fetch attendance data
  const fetchFtm = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-att-all-full-time/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Daily full-time data:", error);
    }
  }, []);

  useEffect(() => {
    fetchFtm();
    fetchEmployees();
    fetchLocations();
    fetchDesignations();
  }, [fetchFtm, fetchEmployees, fetchLocations, fetchDesignations]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      
      // Get employee details from employeeMap
      const employee = employeeMap[item.employeeId] || {};
      const department = employee.department || "";
      const shift = employee.shift || "";
      const designation = employee.designation || "";
      const employeeLocations = employee.locations || [];

      // Check filters
      const matchesDepartment = selectedDepartment === "All Departments" || 
        department === selectedDepartment;
      
      const matchesLocation = selectedLocation === "All Locations" || 
        item.locName === selectedLocation || 
        employeeLocations.includes(selectedLocation);
      
      const matchesShift = selectedShift === "All Shifts" || 
        shift === selectedShift;
      
      const matchesDesignation = selectedDesignation === "All Designations" || 
        designation === selectedDesignation;
      
      // Check if matches search query
      const matchesSearchQuery =
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emp_fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emp_lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time_out.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
        designation.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if matches date range
      const matchesDateRange =
        (!fromDate || itemDate >= startDate) &&
        (!toDate || itemDate <= endDate);

      return matchesSearchQuery && matchesDateRange && 
             matchesDepartment && matchesLocation && 
             matchesShift && matchesDesignation;
    });

    setFilteredData(newFilteredData);
  }, [
    searchQuery, 
    data, 
    fromDate, 
    toDate, 
    employeeMap, 
    selectedDepartment, 
    selectedLocation, 
    selectedShift,
    selectedDesignation
  ]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  return (
    <>
      {data.length < 1 ? (
        <div className="baandar">
          <img src={error} alt="No Data Found" />
          <h4>No Attendance Summary Record.</h4>
        </div>
      ) : (
        <div className="departments-table">
          <div className="report-head">
            <h3>All Attendance Summary</h3>

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
              
              {/* Location Filter Dropdown */}
              <label>
                Location:
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map((loc, index) => (
                    <option key={index} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>
              
              {/* Shift Filter Dropdown */}
              <label>
                Shift:
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                >
                  {shifts.map((shift, index) => (
                    <option key={index} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </label>
              
              {/* Designation Filter Dropdown */}
              <label>
                Designation:
                <select
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                >
                  {designations.map((dsg, index) => (
                    <option key={index} value={dsg}>
                      {dsg}
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
                <th>Designation</th>
                <th>Shift</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const employee = employeeMap[item.employeeId] || {};
                const department = employee.department || "N/A";
                const shift = employee.shift || "N/A";
                const designation = employee.designation || "N/A";
                
                return (
                  <tr key={item.id}>
                    <td>{item.employeeId}</td>
                    <td className="bold-fonts">
                      {item.emp_fName} {item.emp_lName}
                    </td>
                    <td>{department}</td>
                    <td>{designation}</td>
                    <td>{shift}</td>
                    <td className="bold-fonts">{item.time_in}</td>
                    <td className="bold-fonts">{item.time_out}</td>
                    <td className="accessible-items"><span style={{ marginRight: "5px" }}>
                          {item.locName}
                        </span></td>
                    <td>{item.date}</td>
                    <td>
                      <span
                        className={`status ${
                          item.status === "Present" || item.status === "Early"
                            ? "presentStatus"
                            : item.status === "Late"
                            ? "lateStatus"
                            : item.status === "Absent"
                            ? "absentStatus"
                            : "none"
                        }`}
                      >
                        {item.status}
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

export default All_Attendance_Summary_Report;