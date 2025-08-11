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

      // Get employee details from employeeMap
      const employee = employeeMap[item.empId] || {};
      const department = employee.department || "";
      const shift = employee.shift || "";
      const designation = employee.designation || "";
      const employeeLocations = employee.locations || [];

      // Check filters
      const matchesDepartment = selectedDepartment === "All Departments" || 
        department === selectedDepartment;
      
      const matchesLocation = selectedLocation === "All Locations" || 
        employeeLocations.includes(selectedLocation);
      
      const matchesShift = selectedShift === "All Shifts" || 
        shift === selectedShift;
      
      const matchesDesignation = selectedDesignation === "All Designations" || 
        designation === selectedDesignation;

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
        department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
        designation.toLowerCase().includes(searchQuery.toLowerCase());

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
    fetchLocations();
    fetchDesignations();
  }, [fetch_d_ot, fetchEmployees, fetchLocations, fetchDesignations]);

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
                <th>Location</th>
                <th>Shift</th>
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
                const employee = employeeMap[item.empId] || {};
                const department = employee.department || "N/A";
                const shift = employee.shift || "N/A";
                const designation = employee.designation || "N/A";
                const location = employee.locations || "N/A";
                
                return (
                  <tr key={item.id}>
                    <td>{item.empId}</td>
                    <td className="bold-fonts">
                      {item.emp_fName} {item.emp_lName}
                    </td>
                    <td>{department}</td>
                    <td>{designation}</td>
                    <td className="accessible-items">{
                      Array.isArray(location) && location.length > 0 
                      ? location.map ((loc, index) => (
                        <span key={index} style={{ marginRight: "5px" }}>
                          {loc}
                        </span>
                      ))
                      : "No Location"}</td>
                    <td>{shift}</td>
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