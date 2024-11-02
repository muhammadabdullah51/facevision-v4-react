import React, { useEffect, useState } from "react";
import "./addVisitors.css";
import Department from "../Enrollment/Department/department";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
const AddVisitor = ({
  setData,
  setActiveTab,
  data,
  isEditMode,
  setIsEditMode,
  employeeToEdit,
  editData,
}) => {
  const [selectedPage, setSelectedPage] = useState(""); // State to control page view
  const [departments, setDepartments] = useState([]);

  const formattedCreateTime = editData?.createTime
  ? new Date(editData.createTime).toISOString().slice(0, 16)
  : '';
  const formattedExitTime = editData?.exitTime
  ? new Date(editData.exitTime).toISOString().slice(0, 16)
  : '';

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const departmentResponse = await axios.get(
          "http://localhost:5000/api/fetchDepartment"
        );
        setDepartments(departmentResponse.data);
        if (editData) {
          setNewVisitor({ ...editData });
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [editData]);

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
  });

  const handleDepartmentChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Department") {
      setSelectedPage("Department");
    } else {
      setNewVisitor({ ...newVisitor, visitingDept: value });
    }
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  const visitorData = {
      visitorsId: newVisitor.visitorsId,
      fName: newVisitor.fName,
      lName: newVisitor.lName,
      certificationNo: newVisitor.certificationNo,
      createTime: new Date().toISOString(),
      exitTime: new Date().toISOString(),
      email: newVisitor.email,
      contactNo: newVisitor.contactNo,
      visitingDept: newVisitor.visitingDept,
      host: newVisitor.host,
      cardNumber: newVisitor.cardNumber,
      visitingReason: newVisitor.visitingReason,
      carryingGoods: newVisitor.carryingGoods,
    };
    const updateVisitorData = {
      // ...visitorData,
      // _id: newVisitor._id,
      // createTime: newVisitor.createTime,
      // exitTime: newVisitor.exitTime,
      _id: newVisitor._id,
      visitorsId: newVisitor.visitorsId,
      fName: newVisitor.fName,
      lName: newVisitor.lName,
      certificationNo: newVisitor.certificationNo,
      createTime: newVisitor.createTime,
      exitTime: newVisitor.exitTime,      
      email: newVisitor.email,
      contactNo: newVisitor.contactNo,
      visitingDept: newVisitor.visitingDept,
      host: newVisitor.host,
      cardNumber: newVisitor.cardNumber,
      visitingReason: newVisitor.visitingReason,
      carryingGoods: newVisitor.carryingGoods,
    };
  
    try {
      const response = isEditMode
        ? await axios.post(`http://localhost:5000/api/updateVisitor`, updateVisitorData)
        : await axios.post("http://localhost:5000/api/addVisitor", visitorData);
  
      if (response.status === (isEditMode ? 200 : 201)) {
        setData(response.data)
  
        setNewVisitor({
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
        });
      }
    } catch (error) {
      console.error("Error adding/updating visitor:", error);
    }
  
    setIsEditMode(false);
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
                  name="visitorsId"
                  placeholder="Enter Visitor ID"
                  value={newVisitor.visitorsId}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, visitorsId: e.target.value })
                  }
                  required
                />

                <label>First Name</label>
                <input
                  type="text"
                  name="fName"
                  placeholder="Enter First Name"
                  value={newVisitor.fName}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, fName: e.target.value })
                  }
                  required
                />

                <label>Last Name</label>
                <input
                  type="text"
                  name="lName"
                  placeholder="Enter Last Name"
                  value={newVisitor.lName}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, lName: e.target.value })
                  }
                  required
                />

                <label>Certification Name (Crtf no)</label>
                <input
                  type="text"
                  name="certificationNo"
                  placeholder="Enter Certification Number"
                  value={newVisitor.certificationNo}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, certificationNo: e.target.value })
                  }
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={newVisitor.email}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, email: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, contactNo: e.target.value })
                  }
                  required
                />

                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Enter Card Number"
                  value={newVisitor.cardNumber}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, cardNumber: e.target.value })
                  }
                  required
                />

                <label>Carrying Goods</label>
                <input
                  type="text"
                  name="carryingGoods"
                  placeholder="Enter Carrying Goods"
                  value={newVisitor.carryingGoods}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, carryingGoods: e.target.value })
                  }
                />

                <label>Visiting Reason</label>
                <input
                  type="text"
                  name="visitingReason"
                  placeholder="Enter Visiting Reason"
                  value={newVisitor.visitingReason}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, visitingReason: e.target.value })
                  }
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
                    value={formattedCreateTime}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, createTime: e.target.value })
                    }
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
                    value={formattedExitTime}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, exitTime: e.target.value })
                    }
                    required
                  />
                  <label>Host</label>
                  <input
                    type="text"
                    name="host"
                    placeholder="Enter Host Name"
                    value={newVisitor.host}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, host: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="visitor-info-lower">
                <button className="submit-button" type="submit">
                  {isEditMode ? "Update Visitors" : "Add Visitor" }
                  
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
