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

const AddEmployee = ({
  setData,
  setActiveTab,
  data,
  isEditMode,
  setIsEditMode,
  employeeToEdit,
  editData,
}) => {
  const [selectedPage, setSelectedPage] = useState("");
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    empId: "",
    fName: "",
    lName: "",
    email: "",
    contactNo: "",
    picture: "",
    enrollSite: "",
    gender: "",
    joiningDate: "",
    bankName: "",
    overtimeAssigned: "",
    department: "",
    designationName: "",
    basicSalary: "",
    accountNo: "",
    salaryPeriod: "",
    salaryType: "",
    shift: "",
    enableAttendance: false,
    enableSchedule: false,
    enableOvertime: false,
  });

  // New state variables for dropdown options
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [enrollSites, setEnrollSites] = useState([]);
  const [overtime, setOvertime] = useState([
    {
      OTFormulaId: 1,
      OTCode: "PC001",
      ratePerHour: "$30",
      updateDate: "2024-09-01",
    },
    {
      OTFormulaId: 2,
      OTCode: "PC002",
      ratePerHour: "$35",
      updateDate: "2024-09-02",
    },
  ]);

  useEffect(() => {
    const fetchOptions = async () => {
      // console.log(isEditMode)

      try {
        const departmentResponse = await axios.get(
          "http://localhost:5000/api/fetchDepartment"
        );
        const shiftResponse = await axios.get(
          "http://localhost:5000/api/fetchShift"
        );
        const enrollSiteResponse = await axios.get(
          "http://localhost:5000/api/fetchLocation"
        );
        // const overtimeResponse = await axios.get("http://localhost:5000/api/fetchLocation");

        setDepartments(departmentResponse.data);
        setShifts(shiftResponse.data);
        setEnrollSites(enrollSiteResponse.data);
        if (editData) {
          setNewEmployee({ ...editData });
        }
        // setOvertime(overtimeResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Department") {
      setSelectedPage("Department");
    } else {
      setNewEmployee({ ...newEmployee, department: value });
    }
  };
  const handleShiftChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Shift") {
      setSelectedPage("Shift Management");
    } else {
      setNewEmployee({ ...newEmployee, shift: value });
    }
  };

  const handleOvertimeChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Overtime") {
      setSelectedPage("Overtime Management");
    } else {
      setNewEmployee({ ...newEmployee, overtimeAssigned: value });
    }
  };

  const handleEnrollSiteChange = (event) => {
    const { value } = event.target;

    if (value === "Add-EnrollSite") {
      setSelectedPage("Enroll Site Management");
    } else {
      setNewEmployee({ ...newEmployee, enrollSite: value });
    }
  };

  const addEmployees = async () => {
    const employeeData = {
      empId: newEmployee.empId,
      fName: newEmployee.fName,
      lName: newEmployee.lName,
      email: newEmployee.email,
      contactNo: newEmployee.contactNo,
      picture: newEmployee.picture,
      enrollSite: newEmployee.enrollSite,
      gender: newEmployee.gender,
      joiningDate: newEmployee.joiningDate,
      bankName: newEmployee.bankName,
      overtimeAssigned: newEmployee.overtimeAssigned,
      department: newEmployee.department,
      designationName: newEmployee.designationName,
      basicSalary: newEmployee.basicSalary,
      accountNo: newEmployee.accountNo,
      salaryPeriod: newEmployee.salaryPeriod,
      salaryType: newEmployee.salaryType,
      shift: newEmployee.shift,
      enableAttendance: newEmployee.enableAttendance,
      enableSchedule: newEmployee.enableSchedule,
      enableOvertime: newEmployee.enableOvertime,
    };

    try {
      axios.post("http://localhost:5000/api/addEmployees", employeeData);
      console.log(employeeData);
      setSelectedPage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();
    Object.keys(newEmployee).forEach((key) => {
      formData.append(key, newEmployee[key]);
    });

    try {
      const response = isEditMode
        ? await axios.post(
            `http://localhost:5000/api/updateEmployees`,
            formData
          )
        : await axios.post("http://localhost:5000/api/addEmployees", formData);
      // setActiveTab("Employees");

      if (response.status === (isEditMode ? 200 : 201)) {
        setData((prevData) =>
          isEditMode
            ? prevData.map((emp) =>
                emp.empId === newEmployee.empId
                  ? { ...emp, ...response.data }
                  : emp
              )
            : [...prevData, response.data]
        );
        setNewEmployee({
          empId: "",
          fName: "",
          lName: "",
          email: "",
          contactNo: "",
          picture: "",
          enrollSite: "",
          gender: "",
          joiningDate: "",
          bankName: "",
          overtimeAssigned: "",
          department: "",
          designationName: "",
          basicSalary: "",
          accountNo: "",
          salaryPeriod: "",
          salaryType: "",
          shift: "",
          enableAttendance: false,
          enableSchedule: false,
          enableOvertime: false,
        });
      }
    } catch (error) {
      console.error(
        "Error adding/updating employee:",
        error.response ? error.response.data : error.message
      );
    }
    setIsEditMode(false)
    setActiveTab("Employees");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewEmployee((prevState) => ({ ...prevState, picture: file })); // Store the file object
    }
  };

  const handleWebcamCapture = (imageSrc) => {
    // Update the state with the captured image
    setNewEmployee((prevState) => ({
      ...prevState,
      picture: imageSrc, // Store the imageSrc in the 'picture' field
    }));
  };

  return (
    <div className="add-employee-main">
      <div>
        <button
          onClick={() => {
            setIsEditMode(false);
            setActiveTab("Employees")
          }
          } 
            
          className="back-button"
        >
          <FaArrowLeft /> Back
        </button>
      </div>
      {selectedPage === "Department" ? (
        <Department setSelectedPage={setSelectedPage} />
      ) : selectedPage === "Shift Management" ? (
        <ShiftManagement setSelectedPage={setSelectedPage} />
      ) : selectedPage === "Overtime Management" ? (
        <OvertimeTable setSelectedPage={setSelectedPage} />
      ) : selectedPage === "Enroll Site Management" ? (
        <Location setSelectedPage={setSelectedPage} />
      ) : (
        <form onSubmit={handleSubmit} className="employee-form">
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
                            newEmployee.picture
                              ? `http://localhost:5000/${newEmployee.picture}`
                              : "" // Use an empty string instead of a space
                          }
                          alt={newEmployee.employeeName}
                          className="employee-image"
                        />
                      </div>
                    )}
                    {/* {newEmployee.picture && ( */}

                    {!isEditMode &&  (
                      <img
                        src={
                          typeof newEmployee.picture === "string"
                            ? newEmployee.picture // Use the URL directly
                            : newEmployee.picture instanceof File // Check if it's a File object
                            ? URL.createObjectURL(newEmployee.picture) // Create a URL for the file object
                            : "" // Fallback if the picture is neither a string nor a File object
                        }
                        alt="Captured"
                        className="captured-image"
                      />
                    )}
                  </div>
                  {/* )}  */}
                  <WebcamModal
                    isOpen={isWebcamOpen}
                    onClose={() => setIsWebcamOpen(false)}
                    onCapture={handleWebcamCapture}
                  />
                  <label>Enrolled Site</label>
                  <select
                    name="enrollSite"
                    value={newEmployee.enrollSite}
                    onChange={handleEnrollSiteChange}
                  >
                    <option value="">Select Enrolled Site</option>
                    {enrollSites.map((site, index) => (
                      <option key={index} value={site.name}>
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
                  />
                </div>

                <div className="employee-info-inner">
                  <label>Shift</label>
                  <select
                    name="shift"
                    value={newEmployee.shift}
                    onChange={handleShiftChange}
                    required
                  >
                    <option value="">Select Shift</option>
                    {shifts.map((shift, index) => (
                      <option key={index} value={shift.name}>
                        {shift.name}
                      </option>
                    ))}
                    <option value="Add-Shift">+ Add New Shift</option>
                  </select>
                  <label>Overtime Assigned</label>
                  <select
                    name="overtimeAssigned"
                    value={newEmployee.overtimeAssigned}
                    onChange={handleOvertimeChange}
                  >
                    <option value="">Select Overtime</option>
                    {overtime.map((ot) => (
                      <option key={ot.OTFormulaId} value={ot.OTCode}>
                        {ot.OTCode}
                      </option>
                    ))}
                    <option value="Add-Overtime">+ Add Overtime</option>
                  </select>

                  <label>Department Name</label>
                  <select
                    name="department"
                    value={newEmployee.department}
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

                  <label>Designation Name</label>
                  <input
                    type="text"
                    name="designationName"
                    placeholder="Enter Designation"
                    value={newEmployee.designationName}
                    onChange={handleChange}
                  />

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
                  />

                  <label>Salary Period</label>
                  <select
                    name="salaryPeriod"
                    value={newEmployee.salaryPeriod}
                    onChange={handleChange}
                  >
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
                    <option value="">Select Attendance Status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>

                  <label>Enable Schedule</label>
                  <select
                    name="enableSchedule"
                    value={newEmployee.enableSchedule}
                    onChange={handleChange}
                  >
                    <option value="">Select Schedule Status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>

                  <label>Enable Overtime</label>
                  <select
                    name="enableOvertime"
                    value={newEmployee.enableOvertime}
                    onChange={handleChange}
                  >
                    <option value="">Select Overtime Status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              <div className="employee-buttons">
                <button className="submit-button" type="submit">
                  {isEditMode ? "Update Employee" : "Add Employee"}
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    setIsEditMode(false)
                    setActiveTab("Employees")}
                  } 
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
