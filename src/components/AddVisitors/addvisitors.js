import React, { useState } from "react";
import "./addVisitors.css";
import Department from '../Enrollment/Department/department';
import { FaArrowLeft } from 'react-icons/fa';
const AddVisitor = ({ setData, setActiveTab, data }) => {
  const [selectedPage, setSelectedPage] = useState(""); // State to control page view
  const [departments, setDepartments] = useState([
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "R&D",
    "Sales",
    "Admin",
  ]);

  const handleBackClick = () => {
    setSelectedPage('Back'); 
    setActiveTab('Visitors')
  };

  const [newVisitor, setNewVisitor] = useState({
    id: "",
    firstName: "",
    lastName: "",
    crftNo: "",
    createTime: "",
    exitTime: "",
    email: "",
    phoneNo: "",
    visitingDepartment: "",
    host: "",
    visitingReason: "",
    carryingGoods: "",
    image: null, // Updated to handle file
  });

  const handleDepartmentChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Department") {
      setSelectedPage("Department");
    } else {
      setNewVisitor({ ...newVisitor, visitingDepartment: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewVisitor((prevData) => ({ ...prevData, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextSerialNo = data.length + 1;
    const newVisitorWithSerial = {
      ...newVisitor,
      serialNo: nextSerialNo,
      phoneNo: newVisitor.phoneNo.toString(), // Convert phone number to string
    };
    setData((prevData) => [...prevData, newVisitorWithSerial]);
    setActiveTab("Visitors");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVisitor((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="add-visitor-main">
        <div>
        <button onClick={handleBackClick} className="back-button">
        <FaArrowLeft /> Back
      </button>
        </div>
      {selectedPage === "Department" ? (
        <Department setSelectedPage={setSelectedPage} />
      ) : (
        <form onSubmit={handleSubmit} className="visitor-form">
          <section>
            <h1>Visitor Information</h1>
            <div className="visitor-uper">
              <div className="visitor-info-inner">
                <label>Visitor ID</label>
                <input
                  type="text"
                  name="id"
                  placeholder="Enter Visitor ID"
                  value={newVisitor.id}
                  onChange={handleChange}
                  required
                />

                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={newVisitor.firstName}
                  onChange={handleChange}
                  required
                />

                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={newVisitor.lastName}
                  onChange={handleChange}
                  required
                />

                <label>Certification Name (Crtf no)</label>
                <input
                  type="text"
                  name="crftNo"
                  placeholder="Enter Certification Number"
                  value={newVisitor.crftNo}
                  onChange={handleChange}
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={newVisitor.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="visitor-info-inner">
                <label>Contact No</label>
                <input
                  type="text"
                  name="phoneNo"
                  placeholder="Enter Contact Number"
                  value={newVisitor.phoneNo}
                  onChange={handleChange}
                  required
                />

                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Enter Card Number"
                  value={newVisitor.cardNumber}
                  onChange={handleChange}
                  required
                />

                <label>Carrying Goods</label>
                <input
                  type="text"
                  name="carryingGoods"
                  placeholder="Enter Carrying Goods"
                  value={newVisitor.carryingGoods}
                  onChange={handleChange}
                />

                <label>Visiting Reason</label>
                <input
                  type="text"
                  name="visitingReason"
                  placeholder="Enter Visiting Reason"
                  value={newVisitor.visitingReason}
                  onChange={handleChange}
                />

                <label>Visitor Image</label>
                <input
                  className="visitor-image-input"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </section>

          <section>
            <h1>Visitor Timing & Department</h1>
            <div className="visitor-info">
              <div className="visitor-info-upper">
                <div className="visitor-info-inner">
                  <label>Create Time</label>
                  <input
                    type="datetime-local"
                    name="createTime"
                    value={newVisitor.createTime}
                    onChange={handleChange}
                    required
                  />

                  <label>Visiting Department</label>
                  <select
                    name="visitingDepartment"
                    value={newVisitor.visitingDepartment}
                    onChange={handleDepartmentChange}
                  >
                    <option value="" disabled>Select a Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="Add-Department">+ Add New Department</option>
                  </select>
                </div>

                <div className="visitor-info-inner">
                  <label>Exit Time</label>
                  <input
                    type="datetime-local"
                    name="exitTime"
                    value={newVisitor.exitTime}
                    onChange={handleChange}
                    required
                  />
                  <label>Host</label>
                  <input
                    type="text"
                    name="host"
                    placeholder="Enter Host Name"
                    value={newVisitor.host}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="visitor-info-lower">
                <button className="add" type="submit">
                  Add Visitor
                </button>
                <button
                  className="cancel"
                  type="button"
                  onClick={() => setActiveTab("Visitors")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </form>
      )}
    </div>
  );
};

export default AddVisitor;
