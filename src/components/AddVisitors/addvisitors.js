import React, { useEffect, useState } from "react";
import "./addVisitors.css";
import Department from "../Enrollment/Department/department";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
const AddVisitor = ({ setData, setActiveTab, data }) => {
  const [selectedPage, setSelectedPage] = useState(""); // State to control page view
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const departmentResponse = await axios.get(
          "http://localhost:5000/api/fetchDepartment"
        );
        // const shiftResponse = await axios.get("http://localhost:5000/api/fetchShift");
        // const enrollSiteResponse = await axios.get("http://localhost:5000/api/fetchLocation");
        // const overtimeResponse = await axios.get("http://localhost:5000/api/fetchLocation");

        setDepartments(departmentResponse.data);
        // setShifts(shiftResponse.data);
        // setEnrollSites(enrollSiteResponse.data);
        // setOvertime(overtimeResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleBackClick = () => {
    setSelectedPage("Back");
    setActiveTab("Visitors");
  };

  const [newVisitor, setNewVisitor] = useState({
    visitorsId: "",
    fName: "",
    lName: "",
    certificationNo: "",
    createTime: "",
    exitTime: "",
    email: "",
    contactNo: "",
    visitingDept: "",
    host: "",
    cardNumber: "",
    visitingReason: "",
    carryingGoods: "",
    image: null, // Updated to handle file
  });

  const handleDepartmentChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Department") {
      setSelectedPage("Department");
    } else {
      setNewVisitor({ ...newVisitor, visitingDept: value });
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
      contactNo: newVisitor.contactNo.toString(), // Convert phone number to string
    };
    setData((prevData) => [...prevData, newVisitorWithSerial]);
    const addVisitors = {
      visitorsId: newVisitorWithSerial.serialNo,
      fName: newVisitorWithSerial.fName,
      lName: newVisitorWithSerial.lName,
      certificationNo: newVisitorWithSerial.certificationNo,
      createTime: new Date().toISOString(),
      exitTime: new Date().toISOString(),
      email: newVisitorWithSerial.email,
      contactNo: newVisitorWithSerial.contactNo,
      visitingDept: newVisitorWithSerial.visitingDept,
      host: newVisitorWithSerial.host,
      cardNumber: newVisitorWithSerial.cardNumber,
      visitingReason: newVisitorWithSerial.visitingReason,
      carryingGoods: newVisitorWithSerial.carryingGoods,
      image: newVisitorWithSerial.image, // Updated to handle file
    };
    try {
      axios.post(`http://localhost:5000/api/addVisitor`, addVisitors);
    } catch (error) {
      console.log(error);
    }
    setActiveTab("Visitors");
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const nextSerialNo = data.length + 1;

  //   const formData = new FormData();
  //   formData.append('id', nextSerialNo);
  //   formData.append('fName', newVisitor.fName);
  //   formData.append('lName', newVisitor.lName);
  //   formData.append('certificationNo', newVisitor.certificationNo);
  //   formData.append('createTime', new Date().toISOString());
  //   formData.append('exitTime', "");
  //   formData.append('email', newVisitor.email);
  //   formData.append('contactNo', newVisitor.contactNo.toString());
  //   formData.append('visitingDept', newVisitor.visitingDept);
  //   formData.append('host', newVisitor.host);
  //   formData.append('visitingReason', newVisitor.visitingReason);
  //   formData.append('carryingGoods', newVisitor.carryingGoods);
  //   if (newVisitor.image) {
  //     formData.append('image', newVisitor.image); // Adding the image file to form-data
  //   }

  //   try {
  //     await axios.post(`http://localhost:5000/api/addVisitor`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     setActiveTab("Visitors");
  //   } catch (error) {
  //     console.error("Error while adding visitor:", error);
  //   }
  // };

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
                  name="visitorsId"
                  placeholder="Enter Visitor ID"
                  value={newVisitor.visitorsId}
                  onChange={handleChange}
                  required
                />

                <label>First Name</label>
                <input
                  type="text"
                  name="fName"
                  placeholder="Enter First Name"
                  value={newVisitor.fName}
                  onChange={handleChange}
                  required
                />

                <label>Last Name</label>
                <input
                  type="text"
                  name="lName"
                  placeholder="Enter Last Name"
                  value={newVisitor.lName}
                  onChange={handleChange}
                  required
                />

                <label>Certification Name (Crtf no)</label>
                <input
                  type="text"
                  name="certificationNo"
                  placeholder="Enter Certification Number"
                  value={newVisitor.certificationNo}
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
                  name="contactNo"
                  placeholder="Enter Contact Number"
                  value={newVisitor.contactNo}
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
                    name="visitingDept"
                    value={newVisitor.visitingDept}
                    onChange={handleDepartmentChange}
                  >
                    <option value="" disabled>
                      Select a Department
                    </option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept.name}>
                        {dept.name} 
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
                <button className="submit-button" type="submit">
                  Add Visitor
                </button>
                <button
                  className="cancel-button"
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
