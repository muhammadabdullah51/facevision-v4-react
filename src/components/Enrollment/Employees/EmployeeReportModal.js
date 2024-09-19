import React from "react";
import Default_picture from '../../../assets/profile.jpg';
import "./modal.css"; // Updated styling for profile-like modal

const EmployeeReportModal = ({ isOpen, onClose, rowData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-profile">
        <button onClick={onClose} className="close-button">
          &times;
        </button>
        <div className="modal-header">
          <div className="emp-img">
          {/* <img src={rowData.image} alt="Employee" className="profile-image" /> */}
          <img src= {Default_picture} alt="Employee" className="profile-image" />
          </div>
          <div className="emp-name">
          <h2 className="employee-name">{rowData.employeeName}</h2>
          <p className="employee-department">Department: {rowData.department}</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="profile-info">
            <p><strong>Serial No:</strong> {rowData.serialNo}</p>
            <p><strong>Employee ID:</strong> {rowData.employeeId}</p>
            <p><strong>Enroll Site:</strong> {rowData.enrollSite}</p>
            <p><strong>Salary Type:</strong> {rowData.salaryType}</p>
            <p><strong>Contact No:</strong> {rowData.contactNo}</p>
            <p><strong>Basic Salary:</strong> {rowData.basicSalary}</p>
            <p><strong>Account No:</strong> {rowData.accountNo}</p>
            <p><strong>Bank Name:</strong> {rowData.bankName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReportModal;
