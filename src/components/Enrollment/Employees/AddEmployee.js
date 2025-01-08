import React, { useState, useEffect } from "react";
import Department from "../Department/department";
import ShiftManagement from "../../Shift_Managment/shift_managment";
// import "../../AddVisitors/addvisitors.css";
import "./employees.css";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import WebcamModal from "./webcam"; // Import the WebcamModal component
import OvertimeTable from "../../Settings/Setting_Tabs/OvertimeSettings";
import Location from "../Location/location";
import LeaveTable from "../../Settings/Setting_Tabs/LeaveSettings";
import { SERVER_URL } from "../../../config";
import Designation from "../Designation/designation";

import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import { useDispatch, useSelector } from "react-redux";
import { resetEmployeeData, setEmployeeData } from "../../../redux/employeeSlice";

const AddEmployee = ({
  // setData,
  setActiveTab,
  // data,
  isEditMode,
  setIsEditMode,
  // employeeToEdit,
  editData,
}) => {
  const [selectedPage, setSelectedPage] = useState("");
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const employeeData = useSelector((state) => state.employee);

  const [newEmployee, setNewEmployee] = useState(employeeData || {
    empId: "",
    fName: "",
    lName: "",
    dptId: "",
    dsgId: "",
    locId: "",
    xid: "",
    otId: "",
    lvfId: "",
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
  const [enrollSites, setEnrollSites] = useState([]);
  const [overtime, setOvertime] = useState([]);
  const [lvf, setLvf] = useState([]);


  const dispatch = useDispatch();
  // const newEmployee = useSelector((state) => state.employee.newEmployee);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}emp-fun/`);

        setDepartments(response.data.dpt_data);
        setShifts(response.data.shft_data);
        setEnrollSites(response.data.loc_data);
        setOvertime(response.data.ot_data);
        setDesignations(response.data.dsg_data);
        setLvf(response.data.lvf_data);
        if (isEditMode && editData) {
          setNewEmployee({ ...editData });
        }
        // setOvertime(overtimeResponse.data);
      } catch (error) {
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

      let timer;
      if (successModal) {
        timer = setTimeout(() => {
          setSuccessModal(false);
        }, 2000);
      }
      return () => clearTimeout(timer);
    };
  }, [newEmployee.image1, successModal]);




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
      setNewEmployee({ ...newEmployee, otId: value });
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
  const handleLeaveFormulaChange = (event) => {
    const { value } = event.target;

    if (value === "Add-Leave-Formula") {
      setSelectedPage("Leave Formula");
    } else {
      setNewEmployee({ ...newEmployee, lvfId: value });
    }
  };



  const addEmployee = async () => {
    setModalType("create");
    setShowModal(true);
  };

  const confirmAdd = async () => {
    const isFormComplete = Object.values(newEmployee).every(
      (value) => value !== ""
    );

    if (!isFormComplete) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return; // Exit the function early if the form is incomplete
    }
    const formData = new FormData();
    Object.keys(newEmployee).forEach((key) => {
      formData.append(key, newEmployee[key]);
    });
    if (newEmployee.empId) {
      if (newEmployee.empId.length > 9) {
        setResMsg("ID could not be greater than 9 characters");
        setShowModal(false);
        setWarningModal(true);
        return;
      }
    }

    try {
      await axios.post(`${SERVER_URL}pr-emp/`, formData);
      setShowModal(false);
      setSuccessModal(true)
    } catch (error) {
    }
    dispatch(resetEmployeeData());


    setTimeout(() => {
      setActiveTab("Employees");
    }, 2000);
  };

  const updateEmployee = (employeeData) => {
    setNewEmployee(employeeData);
    setModalType("update");
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    const isFormComplete = Object.values(newEmployee).every(
      (value) => value !== ""
    );

    if (!isFormComplete) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return; // Exit the function early if the form is incomplete
    }
    const formData = new FormData();
    Object.keys(newEmployee).forEach((key) => {
      formData.append(key, newEmployee[key]);
    });

    try {
      await axios.post(`${SERVER_URL}pr-emp-up/`, formData);
      setShowModal(false);
      setSuccessModal(true)

    } catch (error) {
    }
    dispatch(resetEmployeeData());


    setIsEditMode(false);
    setTimeout(() => {
      setActiveTab("Employees");
    }, 2000);
  };



  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      setEmployees(response.data);
      console.log(response.data)
      console.log(employees)
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  const filteredData = employees.filter((item) =>
    item.empId?.toLowerCase().includes(searchQuery.toLowerCase())
  );





  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle empId input changes for both search and form submission
    if (name === "empId") {
      setNewEmployee((prev) => {
        const updatedData = { ...prev, empId: value };
        dispatch(setEmployeeData(updatedData)); // Dispatch the updated employee data
        return updatedData;
      });

      // Check input length and perform validation
      if (value.length > 9) {
        setError("ID cannot exceed 9 characters.");
        setExists(false); // Reset existence status when ID is invalid
        return;
      } else {
        setError(""); // Clear error if ID is valid
      }

      // Check if empId exists in filtered data (to show if it already exists)
      const empExists = filteredData.some(
        (employee) => employee.empId.toLowerCase() === value.toLowerCase()
      );
      setExists(empExists); // Set exists status based on matching ID
      setSearchQuery(value); // Update the search query (for filtering)
    } else {
      // Handle other input fields (e.g., name, email, etc.)
      setNewEmployee((prev) => {
        const updatedData = { ...prev, [name]: value };
        dispatch(setEmployeeData(updatedData)); // Dispatch updated data for other fields
        return updatedData;
      });
    }
  };




  // Handle image file change
  const handlePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewEmployee((prevState) => {
        const updatedState = { ...prevState, image1: file };
        dispatch(setEmployeeData(updatedState));  // Dispatch updated data to Redux
        return updatedState;
      });
    }
  };




  const handleWebcamCapture = (imageSrc) => {
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "webcam-image.jpg", { type: "image/jpeg" });

        // Update the local state first
        setNewEmployee((prevState) => ({ ...prevState, image1: file }));

        // Dispatch the updated state separately
        const updatedState = { image1: file }; // Only the new file
        dispatch(setEmployeeData(updatedState));
      })
      .catch((error) => {
        console.error("Error capturing webcam image:", error);
      });
  };

  const cancelHandler = () => {
    // Dispatch the action to reset the Redux state
    dispatch(resetEmployeeData());

    // Reset other local states if necessary
    setIsEditMode(false);
    setActiveTab("Employees");

  };

  // Log newEmployee state after it updates
  useEffect(() => {
  }, [newEmployee]);









  return (
    <div className="add-employee-main">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this employee?`}
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
        message={`Employee ${modalType}d successfully!`}
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
      ) : selectedPage === "Leave Formula" ? (
        <LeaveTable setSelectedPage={setSelectedPage} />
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="employee-form">
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
                  {/* <input
                    type="text"
                    name="empId"
                    placeholder="Enter Employee ID"
                    value={newEmployee.empId}
                    onChange={handleChange}
                    list="empIdList" // Links the input to the datalist
                    required
                  />
                  <datalist id="empIdList">
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.empId}>
                        {employee.empId}
                      </option>
                    ))}
                  </datalist> */}
                  {/* {!error && exists && (
                    <p style={{ color: "orange", fontSize: "0.9em", marginTop: "-30px" }}>
                      &#9888; This Employee ID already exists.
                    </p>
                  )}
                  {newEmployee.empId.length > 9 && <p style={{ color: "red", fontSize: "0.9em", marginTop: '-30px' }}>&#10006; Id must be less 9 characters</p>}
                  {newEmployee.empId.length <= 9 && newEmployee.empId.length >= 1 && <p style={{ color: "green", fontSize: "0.9em", marginTop: '-30px' }}>	&#x2714; Perfect</p>} */}
                  {error && (
                    <p style={{ color: "red", fontSize: "0.9em", marginTop: "-30px" }}>
                      &#10006; {error}
                    </p>
                  )}
                  {!error && exists && (
                    <p style={{ color: "orange", fontSize: "0.9em", marginTop: "-30px" }}>
                      &#9888; This Employee ID already exists.
                    </p>
                  )}
                  {!error && !exists && searchQuery.length > 0 && (
                    <p style={{ color: "green", fontSize: "0.9em", marginTop: "-30px" }}>
                      &#x2714; This Employee ID is available.
                    </p>
                  )}

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
                    className="webcam-button submit-button"
                  >
                    Capture Picture with Webcam
                  </button>
                  <div className="captured-image-container">
                    {isEditMode && (
                      <div className="empImage">
                        <img
                          src={
                            newEmployee.image1 instanceof File
                              ? URL.createObjectURL(newEmployee.image1) // For new file preview
                              : typeof newEmployee.image1 === "string"
                                ? `${SERVER_URL}${newEmployee.image1}` // For existing image URL
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
                    value={newEmployee.otId}
                    onChange={handleOvertimeChange}
                  >
                    {isEditMode && (
                      <option value={editData.otId}>{editData.OTCode}</option>
                    )}
                    <option value="">Select Overtime</option>
                    {overtime.map((ot) => (
                      <option key={isEditMode ? ot.otId : ot.OTFormulaId} value={ot.OTFormulaId}>
                        {ot.OTCode}
                      </option>
                    ))}
                    <option value="Add-Overtime">+ Add Overtime</option>
                  </select>

                  <label>Leave Formula Assigned</label>
                  <select
                    name="overtimeAssigned"
                    value={newEmployee.lvfId}
                    onChange={handleLeaveFormulaChange}
                  >
                    {isEditMode && (
                      <option value={editData.lvfId}>{editData.cutCode}</option>
                    )}
                    <option value="">Select Leave Formula</option>
                    {lvf.map((lvf) => (
                      <option key={lvf.leaveFormulaId} value={lvf.leaveFormulaId}>
                        {lvf.cutCode}
                      </option>
                    ))}
                    <option value="Add-Leave-Formula">+ Add Leave Formula</option>
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
                <button
                  className="submit-button"
                  type="submit"
                  disabled={exists || error || newEmployee.empId.length === 0}

                  onClick={
                    isEditMode ? () => updateEmployee(newEmployee) : addEmployee
                  }
                >
                  {isEditMode ? "Update Employee" : "Add Employee"}
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={cancelHandler}

                // onClick={() => {
                //   setIsEditMode(false);
                //   setNewEmployee({
                //     empId: "",
                //     fName: "",
                //     lName: "",
                //     email: "",
                //     contactNo: "",
                //     picture: null,
                //     enrollSite: "",
                //     gender: "",
                //     joiningDate: "",
                //     bankName: "",
                //     shift: "",
                //     overtimeAssigned: "",
                //     leaveFormulaAssigned: "",
                //     department: "",
                //     designation: "",
                //     basicSalary: "",
                //     accountNo: "",
                //     salaryPeriod: "",
                //     salaryType: "",
                //     enableAttendance: "",
                //     enableSchedule: "",
                //     enableOvertime: "",
                //   });

                //   setActiveTab("Employees");
                // }}

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
