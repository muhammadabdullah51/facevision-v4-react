// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { SERVER_URL } from "../../../config";
// import error from "../../../assets/error.png";

// const All_Attendance_Summary_Report = ({ searchQuery, sendDataToParent }) => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [employeeMap, setEmployeeMap] = useState({}); // Store employee data mapping

//   // Fetch employee data for department information
//   const fetchEmployees = useCallback(async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}pr-emp/`);
//       // Create mapping: employeeId -> department
//       const map = {};
//       response.data.forEach(emp => {
//         map[emp.empId] = emp.department;
//       });
//       setEmployeeMap(map);
//     } catch (error) {
//       console.error("Error fetching employee data:", error);
//     }
//   }, []);

//   // Fetch attendance data
//   const fetchFtm = useCallback(async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}rp-att-all-full-time/`);
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching Daily full-time data:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchFtm();
//     fetchEmployees(); // Fetch employee data on component mount
//   }, [fetchFtm, fetchEmployees]);

//   useEffect(() => {
//     const newFilteredData = data.filter((item) => {
//       const itemDate = new Date(item.date);
//       const startDate = new Date(fromDate);
//       const endDate = new Date(toDate);
      
//       // Get department from employeeMap
//       const department = employeeMap[item.employeeId] || "";

//       const matchesSearchQuery =
//         item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.emp_fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.emp_lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.time_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.time_out.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.locName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         department.toLowerCase().includes(searchQuery.toLowerCase()); // Include department in search

//       const matchesDateRange =
//         (!fromDate || itemDate >= startDate) &&
//         (!toDate || itemDate <= endDate);

//       return matchesSearchQuery && matchesDateRange;
//     });

//     setFilteredData(newFilteredData);
//   }, [searchQuery, data, fromDate, toDate, employeeMap]);

//   useEffect(() => {
//     if (filteredData && filteredData.length > 0) {
//       sendDataToParent(filteredData);
//     }
//   }, [filteredData, sendDataToParent]);

//   return (
//     <>
//       {data.length < 1 ? (
//         <div className="baandar">
//           <img src={error} alt="No Data Found" />
//           <h4>No Attendance Summary Record.</h4>
//         </div>
//       ) : (
//         <div className="departments-table">
//           <div className="report-head">
//             <h3>All Attendance Summary</h3>

//             <div className="date-search">
//               <label>
//                 From:
//                 <input
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                 />
//               </label>

//               <label>
//                 To:
//                 <input
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                 />
//               </label>
//             </div>
//           </div>

//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Employee ID</th>
//                 <th>Employee Name</th>
//                 <th>Department</th> {/* New department column */}
//                 <th>Time In</th>
//                 <th>Time Out</th>
//                 <th>Location</th>
//                 <th>Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item) => {
//                 // Get department from employeeMap
//                 const department = employeeMap[item.employeeId] || "N/A";
                
//                 return (
//                   <tr key={item.id}>
//                     <td>{item.employeeId}</td>
//                     <td className="bold-fonts">
//                       {item.emp_fName} {item.emp_lName}
//                     </td>
//                     <td>{department}</td> {/* Display department */}
//                     <td className="bold-fonts">{item.time_in}</td>
//                     <td className="bold-fonts">{item.time_out}</td>
//                     <td>{item.locName}</td>
//                     <td>{item.date}</td>
//                     <td>
//                       <span
//                         className={`status ${
//                           item.status === "Present" || item.status === "Early"
//                             ? "presentStatus"
//                             : item.status === "Late"
//                             ? "lateStatus"
//                             : item.status === "Absent"
//                             ? "absentStatus"
//                             : "none"
//                         }`}
//                       >
//                         {item.status }
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </>
//   );
// };

// export default All_Attendance_Summary_Report;



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
  }, [fetchFtm, fetchEmployees]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      
      // Get department from employeeMap
      const department = employeeMap[item.employeeId] || "";

      // Check if matches selected department
      const matchesDepartment = selectedDepartment === "All Departments" || 
        department === selectedDepartment;
      
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
        department.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if matches date range
      const matchesDateRange =
        (!fromDate || itemDate >= startDate) &&
        (!toDate || itemDate <= endDate);

      return matchesSearchQuery && matchesDateRange && matchesDepartment;
    });

    setFilteredData(newFilteredData);
  }, [searchQuery, data, fromDate, toDate, employeeMap, selectedDepartment]);

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
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const department = employeeMap[item.employeeId] || "N/A";
                
                return (
                  <tr key={item.id}>
                    <td>{item.employeeId}</td>
                    <td className="bold-fonts">
                      {item.emp_fName} {item.emp_lName}
                    </td>
                    <td>{department}</td>
                    <td className="bold-fonts">{item.time_in}</td>
                    <td className="bold-fonts">{item.time_out}</td>
                    <td>{item.locName}</td>
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