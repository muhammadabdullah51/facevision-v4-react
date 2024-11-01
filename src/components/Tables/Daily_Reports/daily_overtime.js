import React, { useEffect } from "react";
import "../Dashboard_Table/dashboard_table.css";

const Daily_Overtime_Report = ({ searchQuery, sendDataToParent }) => {
  const data = [
    { empId: "E001", employeeName: "Ayesha Khan", overtimeHours: "2" },
    { empId: "E002", employeeName: "Fatima Ahmed", overtimeHours: "1.5" },
    { empId: "E003", employeeName: "Omar Ali", overtimeHours: "3" },
    { empId: "E004", employeeName: "Hassan Mahmood", overtimeHours: "2.5" },
    { empId: "E005", employeeName: "Zainab Hussain", overtimeHours: "2" },
    { empId: "E006", employeeName: "Yusuf Rashid", overtimeHours: "4" },
    { empId: "E007", employeeName: "Amina Ibrahim", overtimeHours: "1" },
    { empId: "E008", employeeName: "Ahmed Jamal", overtimeHours: "2.5" },
    { empId: "E009", employeeName: "Mariam Hassan", overtimeHours: "1.75" },
    { empId: "E010", employeeName: "Bilal Shaikh", overtimeHours: "3" },
    { empId: "E011", employeeName: "Safiya Khan", overtimeHours: "2" },
    { empId: "E012", employeeName: "Zaid Malik", overtimeHours: "2.5" },
    { empId: "E013", employeeName: "Sara Yusuf", overtimeHours: "1.5" },
    { empId: "E014", employeeName: "Ismail Ahmed", overtimeHours: "3.5" },
    { empId: "E015", employeeName: "Sofia Karim", overtimeHours: "2" },
    { empId: "E016", employeeName: "Mohammed Abbas", overtimeHours: "2.25" },
    { empId: "E017", employeeName: "Layla Tariq", overtimeHours: "1.5" },
    { empId: "E018", employeeName: "Ebrahim Shah", overtimeHours: "3" },
    { empId: "E019", employeeName: "Nadia Khan", overtimeHours: "2.75" },
    { empId: "E020", employeeName: "Tariq Ali", overtimeHours: "2" },
  ];

  const filteredData = data.filter(
    (row) =>
      row.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.overtimeHours.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send filtered data to parent
  useEffect(() => {
    sendDataToParent(filteredData);
  }, [filteredData, sendDataToParent]);

  return (
    <div className="departments-table">
      <h3>Daily Overtime Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Overtime Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.empId}</td>
              <td className="bold-fonts">{row.employeeName}</td>
              <td className="bold-fonts">{row.overtimeHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Daily_Overtime_Report;
