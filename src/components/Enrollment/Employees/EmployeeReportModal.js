import React from "react";
import Default_picture from '../../../assets/profile.jpg'; // Default image if no image is provided
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
            {/* Handle image loading with a fallback to the default image */}
            <img
              src={rowData.picture ? `http://localhost:5000/${rowData.picture.replace(/\\/g, "/")}` : Default_picture}
              alt="Employee"
              className="profile-image"
              onError={(e) => {
                // If image fails to load, use the default picture
                e.target.src = Default_picture;
              }}
            />
          </div>
          <div className="emp-name">
            <h2 className="employee-name">{rowData.firstName} {rowData.lastName}</h2>
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
