import React, { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable";
import AddEmployee from "./AddEmployee";
import axios from "axios";
import Department from "../Department/department";
import Designation from "../Designation/designation";
import Location from "../Location/location";
import Resign from "../Resign/resign";
import { SERVER_URL } from "../../../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt, faUserPlus, faMobileAlt, faCalendarCheck,
    faCalendarAlt, faCogs, faMoneyCheckAlt, faChartBar,
    faUsers, faBan, faCog, faUser, faBuilding, faTag,
    faMapMarkerAlt, faIdBadge, faPersonWalkingDashedLineArrowRight, faChevronDown,
    faChevronUp, faHandHoldingUsd, faClipboardCheck, faAward, faFileInvoiceDollar,
    faTabletAlt, faDollarSign, faInfoCircle, faCheckCircle, faFileInvoice, faMoneyBillWave, faBed, faCoffee 
} from '@fortawesome/free-solid-svg-icons';

const Employees = () => {
  const [activeTab, setActiveTab] = useState("Employees");
  const [changeTab, setChangeTab] = useState("Employees");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      setData(response.data);
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchEmployees();
    setActiveTab("Employees");
  }, [changeTab]);

  const handleEdit = (row) => {
    setEditData(row);
    setIsEditMode(true);
    setActiveTab("Add Employee");
  };
  const handleAdd = () => {
    setIsEditMode(false);
    setEditData(null);
    setActiveTab("Add Employee");
    setSelectedEmployee(null);
  }

  const renderTabContent = () => {
    switch (changeTab) {
      case "Department":
        return <Department />;
      case "Designation":
        return <Designation />;
      case "Location":
        return <Location />;
      case "Resign":
        return <Resign />;
      default:
        return (
          <div>
            {activeTab === "Employees" && (
              <EmployeeTable  data={data} setActiveTab={setActiveTab} onEdit={handleEdit} onAdd={handleAdd} />
            )}
            {activeTab === "Add Employee" && (
              <AddEmployee editData={editData}  isEditMode={isEditMode} setIsEditMode={setIsEditMode} setActiveTab={setActiveTab} />
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
          <FontAwesomeIcon icon={faUsers} className="icon" /> Employees
        </button>
        <button
          className={`${changeTab === "Department" ? "active" : ""}`}
          onClick={() => setChangeTab("Department")}
        >
          <FontAwesomeIcon icon={faBuilding} className="icon" /> Department
        </button>
        <button
          className={`${changeTab === "Designation" ? "active" : ""}`}
          onClick={() => setChangeTab("Designation")}
        >
          <FontAwesomeIcon icon={faTag} className="icon" /> Designation
        </button>
        <button
          className={`${changeTab === "Location" ? "active" : ""}`}
          onClick={() => setChangeTab("Location")}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> Location
        </button>
        <button
          className={`${changeTab === "Resign" ? "active" : ""}`}
          onClick={() => setChangeTab("Resign")}
        >
          <FontAwesomeIcon icon={faPersonWalkingDashedLineArrowRight} className="icon" /> Resign
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
    </>
  );
};

export default Employees;
