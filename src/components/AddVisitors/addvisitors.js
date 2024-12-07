import React, { useEffect, useState } from "react";
import "./addVisitors.css";
import Department from "../Enrollment/Department/department";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";
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
        const response = await axios.get(`${SERVER_URL}emp-fun/`);

        setDepartments(response.data.dpt_data);
        if (isEditMode && editData) {
          setNewVisitor({
            ...editData,
            createTime: editData.createTime
              ? new Date(editData.createTime).toISOString().slice(0, 16)
              : "",
            exitTime: editData.exitTime
              ? new Date(editData.exitTime).toISOString().slice(0, 16)
              : "",
          });
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
  
    fetchOptions();
  }, [isEditMode && editData]);

 

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

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  useEffect(()=>{
    let timer;

    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  },[successModal])

  const handleBackClick = () => {
    setSelectedPage("Back");
    setActiveTab("Visitors");
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Department") {
      setSelectedPage("Department");
    } else {
      setNewVisitor({ ...newVisitor, visitingDept: value });
    }
  };

  

  const addVisitor = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      !newVisitor.visitorsId ||
     !newVisitor.fName ||
     !newVisitor.lName ||
     !newVisitor.certificationNo ||
     !newVisitor.email ||
     !newVisitor.contactNo ||
     !newVisitor.visitingDept ||
     !newVisitor.host ||
     !newVisitor.cardNumber ||
     !newVisitor.visitingReason ||
     !newVisitor.carryingGoods
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    setLoading(true);
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
    console.log(visitorData);
    
    try {
      await axios.post(`${SERVER_URL}visitors/`, visitorData)
      setShowModal(false);
      setSuccessModal(true)
    } catch (error) {
      console.error(error)
    }
    setTimeout(() => {
      setActiveTab("Visitors");
    }, 2000); 
  }





  const updateVisitor = (visitors) => {
    setNewVisitor(visitors);
    setModalType("update");
    setShowModal(true);
  }
  
  const confirmUpdate = async () => {
    if (
      newVisitor.visitorsId === "" ||
     !newVisitor.fName ||
     !newVisitor.lName ||
     !newVisitor.certificationNo ||
     !newVisitor.email ||
     !newVisitor.contactNo ||
     !newVisitor.visitingDept ||
     !newVisitor.host ||
     !newVisitor.cardNumber ||
     !newVisitor.visitingReason ||
     !newVisitor.carryingGoods
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    setLoading(true);
    const updateVisitorData = {
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
      await axios.put(`${SERVER_URL}visitors/${newVisitor.id}/`, updateVisitorData)
      setShowModal(false);
      setSuccessModal(true)
    } catch (error) {
      console.error(error)
    }
    setTimeout(() => {
      setActiveTab("Visitors");
    }, 2000); 
  }


  return (
    <div className="add-visitor-main">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this Visitor?`}
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
          else confirmUpdate();
        }}
        onCancel={() => setShowModal(false)}
        animationData={
          modalType === "create"
            ? addAnimation
            : modalType === "update"
            ? updateAnimation
            : deleteAnimation
        }
      />
      <ConirmationModal
        isOpen={successModal}
        message={`Visitor ${modalType}d successfully!`}
        onConfirm={() => setSuccessModal(false)}
        onCancel={() => setSuccessModal(false)}
        animationData={successAnimation}
        successModal={successModal}
      />
      <ConirmationModal
        isOpen={warningModal}
        message={resMsg}
        onConfirm={() => setWarningModal(false)}
        onCancel={() => setWarningModal(false)}
        animationData={warningAnimation}
        warningModal={warningModal}
      />
      <div>
        <button onClick={handleBackClick} className="back-button">
          <FaArrowLeft /> Back
        </button>
      </div>
      {selectedPage === "Department" ? (
        <Department setSelectedPage={setSelectedPage} />
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="visitor-form">
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
                  disabled={isEditMode}
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
                    // value={formattedCreateTime}
                    value={newVisitor.createTime}
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
                    // value={formattedExitTime}
                    value={newVisitor.exitTime}
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
                <button className="submit-button" type="submit"
                onClick={isEditMode ? () => updateVisitor(newVisitor) : addVisitor}
                >
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
