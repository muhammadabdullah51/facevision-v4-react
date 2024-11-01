import React, { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable";
import AddEmployee from "./AddEmployee";
import axios from "axios";
import Department from "../Department/department";
import Designation from "../Designation/designation";
import Location from "../Location/location";
import Resign from "../Resign/resign";

const Employees = () => {
  const [activeTab, setActiveTab] = useState("Employees");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchEmployees");
      setData(response.data); 
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);


  const [changeTab, setChangeTab] = useState('Employees')
  const renderTabContent = () => {
    switch (changeTab) {
        case 'Department':
            return <Department />;
        case 'Designation':
            return <Designation/>;
        case 'Location':
            return <Location />;
        case 'Resign':
            return <Resign />;  
        // case 'shift-settings':
        //     return <ShiftSettings />;
        default:
          return (
            <div>
              {activeTab === "Employees" ? (
                <EmployeeTable
                  data={data}
                  setData={setData}
                  setActiveTab={setActiveTab}
                  setSelectedEmployee={setSelectedEmployee} // For edit functionality
                  setIsEditMode={setIsEditMode} // To enable edit mode
                  fetchEmployees={fetchEmployees}
                />
              ) : (
                <AddEmployee
                  setData={setData}
                  setActiveTab={setActiveTab}
                  data={data}
                  employeeData={selectedEmployee}
                  isEditMode={isEditMode}
                  fetchEmployees={fetchEmployees}
                />
              )}
            </div>
          );
    }
};
  

  return (
    <>
     <div className="settings-page">
            <div className="tabs">
            <button
            className={`${changeTab === "Employees" ? "active" : ""}`}
            onClick={() => setChangeTab("Employees")}
          >
            Employees
          </button>
                <button className={`${changeTab === 'Department' ? 'active' : ''}`} onClick={() => setChangeTab('Department')}>Department</button>
                <button className={`${changeTab === 'Designation' ? 'active' : ''}`} onClick={() => setChangeTab('Designation')}>Designation</button>
                <button className={`${changeTab === 'Location' ? 'active' : ''}`} onClick={() => setChangeTab('Location')}>Location</button>
                <button className={`${changeTab === 'Resign' ? 'active' : ''}`} onClick={() => setChangeTab('Resign')}>Resign</button>
                {/* <button className={`${activeTab === 'shift-settings' ? 'active' : ''}`} onClick={() => setActiveTab('shift-settings')}>Shift Settings</button> */}
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    {/* <div>
      {activeTab === "Employees" ? (
        <EmployeeTable
          data={data}
          setData={setData}
          setActiveTab={setActiveTab}
          setSelectedEmployee={setSelectedEmployee} // For edit functionality
          setIsEditMode={setIsEditMode} // To enable edit mode
          fetchEmployees={fetchEmployees}
        />
      ) : (
        <AddEmployee
          setData={setData}
          setActiveTab={setActiveTab}
          data={data}
          employeeData={selectedEmployee}
          isEditMode={isEditMode}
          fetchEmployees={fetchEmployees}
        />
      )}
    </div> */}
      </>
  );
};

export default Employees;
