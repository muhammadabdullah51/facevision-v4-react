import React, { useState, useRef, useEffect } from "react";
import Department from "../Department/department";
import ShiftManagement from "../../Shift_Managment/shift_managment";
// import "../../AddVisitors/addvisitors.css";
import "./employees.css";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import WebcamModal from "./webcam"; // Import the WebcamModal component
import OvertimeTable from "../../Settings/Setting_Tabs/OvertimeSettings";
import Location from "../Location/location";
import LocationTable from "../Location/LocationTable";
import { useLocation } from "react-router-dom";
import { SERVER_URL } from "../../../config";
import Designation from "../Designation/designation";

const AddEmployee = ({
  // setData,
  setActiveTab,
  // data,
  isEditMode,
  setIsEditMode,
  employeeToEdit,
  editData,
}) => {
  const [selectedPage, setSelectedPage] = useState("");
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);

  
  const [data, setData] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    empId: "",
    fName: "",
    lName: "",
    dptId: "",
    dsgId: "",
    locId: "",
    xid: "",
    otid: "",
    gender: "",
    email: "",
    joiningDate: "",
    contactNo: "",
    image1: "",
    bankName: "",
    basicSalary: "",
    accountNo: "",
    salaryPeriod: "",
    salaryType: "",
    enableAttendance: false,
    enableOvertime: false,
    enableSchedule: false,
  });

  // New state variables for dropdown options
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [eshift, setEShift] = useState("");
  const [enrollSites, setEnrollSites] = useState([]);
  const [overtime, setOvertime] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {

      try {
        const response = await axios.get(`${SERVER_URL}emp-fun/`);

        setDepartments(response.data.dpt_data);
        setShifts(response.data.shft_data);
        setEnrollSites(response.data.loc_data);
        setOvertime(response.data.ot_data);
        setDesignations(response.data.dsg_data);
        if (isEditMode && editData) {
          setNewEmployee({ ...editData });
        }
        // setOvertime(overtimeResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [isEditMode, editData]);

  useEffect(() => {
    let objectUrl;
  
    // Check if the image1 property is a File, meaning it’s a newly uploaded image
    if (newEmployee.image1 instanceof File) {
      objectUrl = URL.createObjectURL(newEmployee.image1);
    }
  
    // Cleanup function to revoke the object URL when the component unmounts or image changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [newEmployee.image1]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Department") {
      setSelectedPage("Department");
    } else {
      setNewEmployee({ ...newEmployee, dptId: value });
    }
  };
  const handleDesignationChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Designation") {
      setSelectedPage("Designation");
    } else {
      setNewEmployee({ ...newEmployee, dsgId: value });
    }
  };
  const handleShiftChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Shift") {
      setSelectedPage("Shift Management");
    } else {
      setNewEmployee({ ...newEmployee, xid: value });
    }
  };

  const handleOvertimeChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Overtime") {
      setSelectedPage("Overtime Management");
    } else {
      setNewEmployee({ ...newEmployee, otid: value });
    }
  };

  const handleEnrollSiteChange = (event) => {
    const { value } = event.target;

    if (value === "Add-EnrollSite") {
      setSelectedPage("Enroll Site Management");
    } else {
      setNewEmployee({ ...newEmployee, locId: value });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Create a new FormData object
  //   const formData = new FormData();
  //   Object.keys(newEmployee).forEach((key) => {
  //     formData.append(key, newEmployee[key]);
  //   });

  //   console.log("-----------start----------");
  //   for (let pair of formData.entries()) {
  //     console.log(`${pair[0]}: ${pair[1]}`);
  //   }
  //   console.log("-----------stop----------");
  //   console.log(formData.values());
  //   try {
  //     const response = isEditMode
  //       ? await axios.post(`${SERVER_URL}pr-emp-up/`, formData)
  //       : await axios.post(`${SERVER_URL}pr-emp/`, formData);

  //     setData((prevData) =>
  //       isEditMode
  //         ? prevData.map((emp) =>
  //             emp.empId === newEmployee.empId
  //               ? { ...emp, ...response.data }
  //               : emp
  //           )
  //         : [...prevData, response.data]
  //     );
  //     // if (response.status === (isEditMode ? 200 : 201)) {

  //     // }
  //   } catch (error) {
  //     console.error(
  //       "Error adding/updating employee:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  //   setIsEditMode(false);
  //   setActiveTab("Employees");
  // };


  const handleSubmit = async (row) => {
    setNewEmployee({...row, empId: row.empId})
    console.log(newEmployee)
    // Create a new FormData object
    const formData = new FormData();
    Object.keys(newEmployee).forEach((key) => {
      formData.append(key, newEmployee[key]);
    });
  
  
    try {
      const response = isEditMode
        ? await axios.post(`${SERVER_URL}pr-emp-up/`, formData)
        : await axios.post(`${SERVER_URL}pr-emp/`, formData);
        console.log(formData)
  
      setData((prevData) =>
        isEditMode
          ? prevData.map((emp) =>
              emp.empId === newEmployee.empId
                ? { ...emp, ...response.data }
                : emp
            )
          : [...prevData, response.data]
      );
    } catch (error) {
      console.error(
        "Error adding/updating employee:",
        error.response ? error.response.data : error.message
      );
    }
  
    setIsEditMode(false);
    setActiveTab("Employees");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewEmployee((prevState) => ({ ...prevState, image1: file })); // Store the file object
    }
  };

  const handleWebcamCapture = (imageSrc) => {
    // Update the state with the captured image
    // setNewEmployee((prevState) => ({
    //   ...prevState,
    //   image1: imageSrc, // Store the imageSrc in the 'picture' field
    // }));

    fetch(imageSrc)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], "webcam-image.jpg", { type: "image/jpeg" });
      setNewEmployee(prevState => ({ ...prevState, image1: file }));
    });
  };

  return (
    <div className="add-employee-main">
      <div>
        <button
          onClick={() => {
            setIsEditMode(false);
            setActiveTab("Employees");
          }}
          className="back-button"
        >
          <FaArrowLeft /> Back
        </button>
      </div>
      {selectedPage === "Department" ? (
        <Department setSelectedPage={setSelectedPage} />
      ) : selectedPage === "Shift Management" ? (
        <ShiftManagement setSelectedPage={setSelectedPage} />
      ) : selectedPage === "Designation" ? (
        <Designation setSelectedPage={setSelectedPage} />
      ) : selectedPage === "Overtime Management" ? (
        <OvertimeTable setSelectedPage={setSelectedPage} />
      ) : selectedPage === "Enroll Site Management" ? (
        <Location setSelectedPage={setSelectedPage} />
      ) : (
        <form 
        onSubmit={(e) => e.preventDefault()} 
        className="employee-form">
          <section>
            <h1>Employee Information</h1>
            <div className="employee-main">
              <div className="employee-upper">
                <div className="employee-info-inner">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="empId"
                    placeholder="Enter Employee ID"
                    value={newEmployee.empId}
                    onChange={handleChange}
                    required
                    disabled={isEditMode} // Disable if editing
                  />

                  <label>First Name</label>
                  <input
                    type="text"
                    name="fName"
                    placeholder="Enter First Name"
                    value={newEmployee.fName}
                    onChange={handleChange}
                    required
                  />

                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lName"
                    placeholder="Enter Last Name"
                    value={newEmployee.lName}
                    onChange={handleChange}
                    required
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={newEmployee.email}
                    onChange={handleChange}
                    required
                  />

                  <label>Contact No</label>
                  <input
                    type="text"
                    name="contactNo"
                    placeholder="Enter Contact Number"
                    value={newEmployee.contactNo}
                    onChange={handleChange}
                    required
                  />

                  <label>Picture</label>
                  <input
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={handlePictureChange}
                  />
                  <button
                    type="button"
                    onClick={() => setIsWebcamOpen(true)}
                    className="webcam-button"
                  >
                    Capture Picture with Webcam
                  </button>
                  <div className="captured-image-container">
                    {isEditMode && (
                      <div className="empImage">
                        <img
                          src={
                            newEmployee.image1 instanceof File
                              ? URL.createObjectURL(newEmployee.image1)  // For new file preview
                              : typeof newEmployee.image1 === "string"
                              ? `${SERVER_URL}${newEmployee.image1}`    // For existing image URL
                              : ""
                          }
                          alt={`${newEmployee.fName} ${newEmployee.lName}`}
                          className="employee-image"
                        />
                      </div>
                    )}


                    <img
                      src={
                        typeof newEmployee.image1 === "string"
                          ? newEmployee.image1 
                          : newEmployee.image1 instanceof File 
                          ? URL.createObjectURL(newEmployee.image1) 
                          : "" 
                      }
                      alt="Captured"
                      className="captured-image"
                    />

                  </div>
                  <WebcamModal
                    isOpen={isWebcamOpen}
                    onClose={() => setIsWebcamOpen(false)}
                    onCapture={handleWebcamCapture}
                  />
                  <label>Enrolled Site</label>
                  <select
                    name="enrollSite"
                    value={newEmployee.locId}
                    onChange={handleEnrollSiteChange}
                  >
                    {isEditMode && (
                      <option value={editData.locId}>
                        {editData.enrollSite}
                      </option>
                    )}
                    <option value="">Select Enrolled Site</option>
                    {enrollSites.map((site, index) => (
                      <option key={site.locId} value={site.locId}>
                        {site.name}
                      </option>
                    ))}
                    <option value="Add-EnrollSite">+ Add Enrolled Site</option>
                  </select>

                  <label>Gender</label>
                  <select
                    name="gender"
                    value={newEmployee.gender}
                    onChange={handleChange}
                    required
                  >
                    {isEditMode && (
                      <option value={editData.gender}>{editData.gender}</option>
                    )}
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <label>Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={newEmployee.joiningDate}
                    onChange={handleChange}
                    required
                  />

                  <label>Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    placeholder="Enter Bank Name"
                    value={newEmployee.bankName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="employee-info-inner">
                  <label>Shift</label>
                  <select
                    name="shift"
                    value={newEmployee.xid}
                    onChange={handleShiftChange}
                    required
                  >
                    {isEditMode && (
                      <option value={editData.xid}>{editData.shift}</option>
                    )}
                    <option value="">Select Shift</option>
                    {shifts.map((shift, index) => (
                      <option key={shift.shiftId} value={shift.shiftId}>
                        {shift.name}
                      </option>
                    ))}
                    <option value="Add-Shift">+ Add New Shift</option>
                  </select>

                  <label>Overtime Assigned</label>
                  <select
                    name="overtimeAssigned"
                    value={newEmployee.otid}
                    onChange={handleOvertimeChange}
                  >
                    {isEditMode && (
                      <option value={editData.otid}>{editData.OTCode}</option>
                    )}
                    <option value="">Select Overtime</option>
                    {overtime.map((ot) => (
                      <option key={ot.OTFormulaId} value={ot.OTFormulaId}>
                        {ot.OTCode}
                      </option>
                    ))}
                    <option value="Add-Overtime">+ Add Overtime</option>
                  </select>

                  <label>Department Name</label>
                  <select
                    name="department"
                    value={newEmployee.dptId}
                    onChange={handleDepartmentChange}
                  >
                    {isEditMode && (
                      <option value={editData.dptId}>
                        {editData.department}
                      </option>
                    )}
                    <option value="" disabled>
                      Select a Department
                    </option>
                    {departments.map((dept, index) => (
                      <option key={dept.dptId} value={dept.dptId}>
                        {dept.name}
                      </option>
                    ))}
                    <option value="Add-Department">+ Add New Department</option>
                  </select>

                  <label>Designation Name</label>
                  <select
                    name="designation"
                    value={newEmployee.dsgId}
                    onChange={handleDesignationChange}
                  >
                    {isEditMode && (
                      <option value={editData.dsgId}>
                        {editData.designation}
                      </option>
                    )}
                    <option value="" disabled>
                      Select a Designation
                    </option>
                    {designations.map((dsg, index) => (
                      <option key={dsg.dsgId} value={dsg.dsgId}>
                        {dsg.name}
                      </option>
                    ))}
                    <option value="Add-Designation">
                      + Add New Designation
                    </option>
                  </select>

                  <label>Basic Salary</label>
                  <input
                    type="number"
                    name="basicSalary"
                    placeholder="Enter Basic Salary"
                    value={newEmployee.basicSalary}
                    onChange={handleChange}
                    required
                  />

                  <label>Account No</label>
                  <input
                    type="text"
                    name="accountNo"
                    placeholder="Enter Account Number"
                    value={newEmployee.accountNo}
                    onChange={handleChange}
                    required
                  />

                  <label>Salary Period</label>
                  <select
                    name="salaryPeriod"
                    value={newEmployee.salaryPeriod}
                    onChange={handleChange}
                  >
                    {isEditMode && (
                      <option value={editData.salaryPeriod}>
                        {editData.salaryPeriod}
                      </option>
                    )}
                    <option value="">Select Salary Period</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Weekly">Weekly</option>
                  </select>

                  <label>Salary Type</label>
                  <select
                    name="salaryType"
                    value={newEmployee.salaryType}
                    onChange={handleChange}
                  >
                    {isEditMode && (
                      <option value={editData.salaryType}>
                        {editData.salaryType}
                      </option>
                    )}
                    <option value="">Select Salary Type</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Hourly">Hourly</option>
                  </select>

                  <label>Enable Attendance</label>
                  <select
                    name="enableAttendance"
                    value={newEmployee.enableAttendance}
                    onChange={handleChange}
                  >
                    {isEditMode && (
                      <option value={editData.enableAttendance}>
                        {(editData.enableAttendance = true ? "Yes" : "No")}
                      </option>
                    )}
                    <option value="">Select Attendance Status</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>

                  <label>Enable Schedule</label>
                  <select
                    name="enableSchedule"
                    value={newEmployee.enableSchedule}
                    onChange={handleChange}
                  >
                    {isEditMode && (
                      <option value={editData.enableSchedule}>
                        {(editData.enableSchedule = true ? "Yes" : "No")}
                      </option>
                    )}
                    <option value="">Select Schedule Status</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>

                  <label>Enable Overtime</label>
                  <select
                    name="enableOvertime"
                    value={newEmployee.enableOvertime}
                    onChange={handleChange}
                  >
                    {isEditMode && (
                      <option value={editData.enableOvertime}>
                        {(editData.enableOvertime = true ? "Yes" : "No")}
                      </option>
                    )}
                    <option value="">Select Overtime Status</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
              <div className="employee-buttons">
                <button className="submit-button" type="submit" onClick={isEditMode ? () => handleSubmit(newEmployee) : handleSubmit }>
                  {isEditMode ? "Update Employee" : "Add Employee"}
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setActiveTab("Employees");
                  }}
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

export default AddEmployee;
