// import React, { useState, useEffect } from "react";
// import Department from "../Department/department";
// import ShiftManagement from "../../Shift_Managment/shift_managment";
// // import "../../AddVisitors/addvisitors.css";
// import "./employees.css";
// import { FaArrowLeft } from "react-icons/fa";
// import axios from "axios";
// import WebcamModal from "./webcam"; // Import the WebcamModal component
// import OvertimeTable from "../../Settings/Setting_Tabs/OvertimeSettings";
// import Location from "../Location/location";
// import LeaveTable from "../../Settings/Setting_Tabs/LeaveSettings";
// import { SERVER_URL } from "../../../config";
// import Designation from "../Designation/designation";

// import ConirmationModal from "../../Modal/conirmationModal";
// import addAnimation from "../../../assets/Lottie/addAnim.json";
// import updateAnimation from "../../../assets/Lottie/updateAnim.json";
// import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
// import successAnimation from "../../../assets/Lottie/successAnim.json";
// import warningAnimation from "../../../assets/Lottie/warningAnim.json";
// import { useDispatch, useSelector } from "react-redux";
// import { resetEmployeeData, setEmployeeData } from "../../../redux/employeeSlice";
// import Select from "react-select";

// const AddEmployee = ({
//   // setData,
//   setActiveTab,
//   // data,
//   isEditMode,
//   setIsEditMode,
//   // employeeToEdit,
//   editData,
//   setEditData,
//   onUpdateSuccess
// }) => {
//   const [selectedPage, setSelectedPage] = useState("");
//   const [isWebcamOpen, setIsWebcamOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState("");
//   const [successModal, setSuccessModal] = useState(false);
//   const [warningModal, setWarningModal] = useState(false);
//   const [resMsg, setResMsg] = useState("");

//   const employeeData = useSelector((state) => state.employee);

//   const [newEmployee, setNewEmployee] = useState(employeeData || {
//     // const [newEmployee, setNewEmployee] = useState({
//     empId: "",
//     fName: "",
//     lName: "",
//     dptId: "",
//     dsgId: "",
//     // locId: "",
//     xid: "",
//     otId: "",
//     lvfId: "",
//     gender: "",
//     email: "",
//     joiningDate: "",
//     contactNo: "",
//     image1: "",
//     bankName: "",
//     basicSalary: "",
//     accountNo: "",
//     salaryPeriod: "",
//     salaryType: "",
//     enableAttendance: false,
//     enableOvertime: false,
//     enableSchedule: false,
//     locIds: [],
//   });

//   // New state variables for dropdown options
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [shifts, setShifts] = useState([]);
//   const [enrollSites, setEnrollSites] = useState([]);
//   const [overtime, setOvertime] = useState([]);
//   const [lvf, setLvf] = useState([]);




//   const dispatch = useDispatch();
//   // const newEmployee = useSelector((state) => state.employee.newEmployee);

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const response = await axios.get(`${SERVER_URL}emp-fun/`);

//         setDepartments(response.data.dpt_data);
//         setShifts(response.data.shft_data);
//         setEnrollSites(response.data.loc_data);
//         setOvertime(response.data.ot_data);
//         setDesignations(response.data.dsg_data);
//         setLvf(response.data.lvf_data);
//         if (isEditMode && editData) {
//           setNewEmployee({ ...editData });
//         }
//       } catch (error) {
//       }
//     };

//     fetchOptions();
//   }, [isEditMode, editData]);

//   useEffect(() => {
//     let objectUrl;

//     // Check if the image1 property is a File, meaning it’s a newly uploaded image
//     if (newEmployee.image1 instanceof File) {
//       objectUrl = URL.createObjectURL(newEmployee.image1);
//     }

//     // Cleanup function to revoke the object URL when the component unmounts or image changes
//     return () => {
//       if (objectUrl) {
//         URL.revokeObjectURL(objectUrl);
//       }

//       let timer;
//       if (successModal) {
//         timer = setTimeout(() => {
//           setSuccessModal(false);
//         }, 2000);
//       }
//       return () => clearTimeout(timer);
//     };
//   }, [newEmployee.image1, successModal]);




//   const handleDepartmentChange = (event) => {
//     const { value } = event.target;

//     if (value === "Add-Department") {
//       setSelectedPage("Department");
//     } else {
//       setNewEmployee({ ...newEmployee, dptId: value });
//     }
//   };
//   const handleDesignationChange = (event) => {
//     const { value } = event.target;

//     if (value === "Add-Designation") {
//       setSelectedPage("Designation");
//     } else {
//       setNewEmployee({ ...newEmployee, dsgId: value });
//     }
//   };
//   const handleShiftChange = (event) => {
//     const { value } = event.target;

//     if (value === "Add-Shift") {
//       setSelectedPage("Shift Management");
//     } else {
//       setNewEmployee({ ...newEmployee, xid: value });
//     }
//   };

//   const handleOvertimeChange = (event) => {
//     const { value } = event.target;

//     if (value === "Add-Overtime") {
//       setSelectedPage("Overtime Management");
//     } else {
//       setNewEmployee({ ...newEmployee, otId: value });
//     }
//   };


//   const handleLeaveFormulaChange = (event) => {
//     const { value } = event.target;

//     if (value === "Add-Leave-Formula") {
//       setSelectedPage("Leave Formula");
//     } else {
//       setNewEmployee({ ...newEmployee, lvfId: value });
//     }
//   };



//   const addEmployee = async () => {
//     console.log(newEmployee);
//     setModalType("create");
//     setShowModal(true);
//   };

//   const confirmAdd = async () => {
//     const isFormComplete = Object.values(newEmployee).every(
//       (value) => value !== ""
//     );

//     if (!isFormComplete) {
//       setResMsg("Please fill in all required fields.");
//       setShowModal(false);
//       setWarningModal(true);
//       return;
//     }
//     const formData = new FormData();
//     Object.keys(newEmployee).forEach((key) => {
//       if (key === "locId") {
//         return; // Skip locId
//       }
//       if (key === "locIds" && Array.isArray(newEmployee.locIds)) {
//         // Handle locIds array
//         formData.append("locIds", newEmployee.locIds.join(","));
//       } else {
//         formData.append(key, newEmployee[key]); // Append other fields
//       }
//     });
//     if (newEmployee.empId) {
//       if (newEmployee.empId.length > 9) {
//         setResMsg("ID could not be greater than 9 characters");
//         setShowModal(false);
//         setWarningModal(true);
//         return;
//       }
//     }

//     try {
//       await axios.post(`${SERVER_URL}pr-emp/`, formData);
//       setShowModal(false);
//       setSuccessModal(true)
//     } catch (error) {
//     }
//     dispatch(resetEmployeeData());


//     setTimeout(() => {
//       setActiveTab("Employees");
//     }, 2000);
//   };


//   const updateEmployee = (employeeData) => {
//     // Make sure we have the employee ID
//     if (!employeeData.id) {
//       console.error('No employee ID found for update');
//       return;
//     }
//     setModalType("update");
//     setShowModal(true);
//   };

//   const confirmUpdate = async () => {
//     const isFormComplete = Object.values(newEmployee).every(
//       (value) => value !== ""
//     );

//     if (!isFormComplete) {
//       setResMsg("Please fill in all required fields.");
//       setShowModal(false);
//       setWarningModal(true);
//       return;
//     }

//     const formData = new FormData();

//     // Make sure to include the employee ID
//     formData.append('id', newEmployee.id);

//     // Append all other fields
//     Object.keys(newEmployee).forEach((key) => {
//       if (key === "locId") {
//         return; // Skip locId
//       }
//       if (key === "locIds" && Array.isArray(newEmployee.locIds)) {
//         // Handle locIds array
//         formData.append("locIds", newEmployee.locIds.join(","));
//       } else {
//         formData.append(key, newEmployee[key]);
//       }
//     });
//     console.log('newEmployee', newEmployee);

//     try {
//       const response = await axios.post(`${SERVER_URL}pr-emp-up/`, formData);
//       if (response.data) {
//         setShowModal(false);
//         setSuccessModal(true);
//         dispatch(resetEmployeeData());
//         setIsEditMode(false);
//         if (typeof onUpdateSuccess === 'function') {
//           onUpdateSuccess();
//         }
//         setTimeout(() => {
//           setActiveTab("Employees");
//         }, 2000);
//       }
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       setResMsg("Error updating employee. Please try again.");
//       setShowModal(false);
//       setWarningModal(true);
//     }
//   };


//   const [error, setError] = useState("");
//   const [exists, setExists] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [employees, setEmployees] = useState([]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}pr-emp/`);
//       setEmployees(response.data);
//       console.log(response.data)
//       console.log(employees)
//     } catch (error) {
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);


//   const filteredData = employees.filter((item) =>
//     item.empId?.toLowerCase().includes(searchQuery.toLowerCase())
//   );





//   const handleChange = (e, fieldName = null) => {

//     if (Array.isArray(e)) {
//       // Handle React-Select multi-select
//       const selectedOptions = e.map((option) => ({
//         value: option.value,
//         label: option.label,
//       }));

//       setNewEmployee((prev) => {
//         const updatedData = {
//           ...prev,
//           [fieldName]: selectedOptions.map((option) => option.value), // Store only the locIds in the state
//         };
//         dispatch(setEmployeeData(updatedData)); // Dispatch updated data
//         return updatedData;
//       });
//     }
//     else {
//       // Handle standard input fields
//       const { name, value } = e.target;

//       if (name === "empId") {
//         setNewEmployee((prev) => {
//           const updatedData = { ...prev, empId: value };
//           dispatch(setEmployeeData(updatedData)); // Dispatch the updated employee data
//           return updatedData;
//         });

//         if (value.length > 9) {
//           setError("ID cannot exceed 9 characters.");
//           setExists(false);
//           return;
//         } else {
//           setError("");
//         }

//         const empExists = filteredData.some(
//           (employee) => employee.empId.toLowerCase() === value.toLowerCase()
//         );
//         setExists(empExists);
//         setSearchQuery(value);
//       } else if (name === "locIds") {
//         setNewEmployee((prev) => {
//           const updatedData = { ...prev, locIds: value.map((option) => option.value) };
//           dispatch(setEmployeeData(updatedData));
//           return updatedData;
//         });
//       } else {
//         setNewEmployee((prev) => {
//           const updatedData = { ...prev, [name]: value };
//           dispatch(setEmployeeData(updatedData));
//           return updatedData;
//         });
//       }
//     }
//   };





//   // Handle image file change
//   const handlePictureChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setNewEmployee((prevState) => {
//         const updatedState = { ...prevState, image1: file };
//         dispatch(setEmployeeData(updatedState));  // Dispatch updated data to Redux
//         return updatedState;
//       });
//     }
//   };




//   const handleWebcamCapture = (imageSrc) => {
//     fetch(imageSrc)
//       .then((res) => res.blob())
//       .then((blob) => {
//         const file = new File([blob], "webcam-image.jpg", { type: "image/jpeg" });

//         // Update the local state first
//         setNewEmployee((prevState) => ({ ...prevState, image1: file }));

//         // Dispatch the updated state separately
//         const updatedState = { image1: file }; // Only the new file
//         dispatch(setEmployeeData(updatedState));
//       })
//       .catch((error) => {
//         console.error("Error capturing webcam image:", error);
//       });
//   };

//   const cancelHandler = () => {
//     // Dispatch the action to reset the Redux state
//     dispatch(resetEmployeeData());

//     // Reset other local states if necessary
//     setIsEditMode(false);
//     setActiveTab("Employees");

//   };

//   // Log newEmployee state after it updates
//   useEffect(() => {
//   }, [newEmployee]);









//   return (
//     <div className="add-employee-main">
//       <ConirmationModal
//         isOpen={showModal}
//         message={`Are you sure you want to ${modalType} this employee?`}
//         onConfirm={() => {
//           if (modalType === "create") confirmAdd();
//           else confirmUpdate();
//         }}
//         onCancel={() => setShowModal(false)}
//         animationData={
//           modalType === "create"
//             ? addAnimation
//             : modalType === "update"
//               ? updateAnimation
//               : deleteAnimation
//         }
//       />
//       <ConirmationModal
//         isOpen={successModal}
//         message={`Employee ${modalType}d successfully!`}
//         onConfirm={() => setSuccessModal(false)}
//         onCancel={() => setSuccessModal(false)}
//         animationData={successAnimation}
//         successModal={successModal}
//       />
//       <ConirmationModal
//         isOpen={warningModal}
//         message={resMsg}
//         onConfirm={() => setWarningModal(false)}
//         onCancel={() => setWarningModal(false)}
//         animationData={warningAnimation}
//         warningModal={warningModal}
//       />
//       <div>
//         <button
//           onClick={() => {
//             setIsEditMode(false);
//             setActiveTab("Employees");
//           }}
//           className="back-button"
//         >
//           <FaArrowLeft /> Back
//         </button>
//       </div>
//       {selectedPage === "Department" ? (
//         <Department setSelectedPage={setSelectedPage} />
//       ) : selectedPage === "Shift Management" ? (
//         <ShiftManagement setSelectedPage={setSelectedPage} />
//       ) : selectedPage === "Designation" ? (
//         <Designation setSelectedPage={setSelectedPage} />
//       ) : selectedPage === "Overtime Management" ? (
//         <OvertimeTable setSelectedPage={setSelectedPage} />
//       ) : selectedPage === "Enroll Site Management" ? (
//         <Location setSelectedPage={setSelectedPage} />
//       ) : selectedPage === "Leave Formula" ? (
//         <LeaveTable setSelectedPage={setSelectedPage} />
//       ) : (
//         <form onSubmit={(e) => e.preventDefault()} className="employee-form">
//           <section>
//             <h1>Employee Information</h1>
//             <div className="employee-main">
//               <div className="employee-upper">
//                 <div className="employee-info-inner">
//                   <label>Employee ID</label>
//                   <input
//                     type="text"
//                     name="empId"
//                     placeholder="Enter Employee ID"
//                     value={newEmployee.empId}
//                     onChange={handleChange}
//                     required
//                     disabled={isEditMode} // Disable if editing
//                   />
//                   {error && (
//                     <p style={{ color: "red", fontSize: "0.9em", marginTop: "-30px" }}>
//                       &#10006; {error}
//                     </p>
//                   )}
//                   {!error && exists && (
//                     <p style={{ color: "orange", fontSize: "0.9em", marginTop: "-30px" }}>
//                       &#9888; This Employee ID already exists.
//                     </p>
//                   )}
//                   {!error && !exists && searchQuery.length > 0 && (
//                     <p style={{ color: "green", fontSize: "0.9em", marginTop: "-30px" }}>
//                       &#x2714; This Employee ID is available.
//                     </p>
//                   )}

//                   <label>First Name</label>
//                   <input
//                     type="text"
//                     name="fName"
//                     placeholder="Enter First Name"
//                     value={newEmployee.fName}
//                     onChange={handleChange}
//                     required
//                   />

//                   <label>Last Name</label>
//                   <input
//                     type="text"
//                     name="lName"
//                     placeholder="Enter Last Name"
//                     value={newEmployee.lName}
//                     onChange={handleChange}
//                     required
//                   />

//                   <label>Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Enter Email"
//                     value={newEmployee.email}
//                     onChange={handleChange}
//                     required
//                   />

//                   <label>Contact No</label>
//                   <input
//                     type="text"
//                     name="contactNo"
//                     placeholder="Enter Contact Number"
//                     value={newEmployee.contactNo}
//                     onChange={handleChange}
//                     required
//                   />

//                   <label>Picture</label>
//                   <input
//                     type="file"
//                     name="picture"
//                     accept="image/*"
//                     onChange={handlePictureChange}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setIsWebcamOpen(true)}
//                     className="webcam-button submit-button"
//                   >
//                     Capture Picture with Webcam
//                   </button>
//                   <div className="captured-image-container">
//                     {isEditMode && (
//                       <div className="empImage">
//                         <img
//                           src={
//                             newEmployee.image1 instanceof File
//                               ? URL.createObjectURL(newEmployee.image1) // For new file preview
//                               : typeof newEmployee.image1 === "string"
//                                 ? `${SERVER_URL}${newEmployee.image1}?${new Date().getTime()}` // Add timestamp to prevent caching from existing image url
//                                 : ""
//                           }
//                           alt={`${newEmployee.fName} ${newEmployee.lName}`}
//                           className="employee-image"
//                         />
//                       </div>
//                     )}

//                     <img
//                       src={
//                         typeof newEmployee.image1 === "string"
//                           ? `${SERVER_URL}${newEmployee.image1}?${new Date().getTime()}` // Add timestamp to prevent caching from existing image url

//                           : newEmployee.image1 instanceof File
//                             ? URL.createObjectURL(newEmployee.image1)
//                             : ""
//                       }
//                       alt="Captured"
//                       className="captured-image"
//                     />
//                   </div>
//                   <WebcamModal
//                     isOpen={isWebcamOpen}
//                     onClose={() => setIsWebcamOpen(false)}
//                     onCapture={handleWebcamCapture}
//                   />
//                   <label>Enrolled Site</label>
//                   {/* <select
//                     name="enrollSite"
//                     value={newEmployee.locId}
//                     onChange={handleEnrollSiteChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.locId}>
//                         {editData.enrollSite}
//                       </option>
//                     )}
//                     <option value="">Select Enrolled Site</option>
//                     {enrollSites.map((site, index) => (
//                       <option key={site.locId} value={site.locId}>
//                         {site.name}
//                       </option>
//                     ))}
//                     <option value="Add-EnrollSite">+ Add Enrolled Site</option>
//                   </select> */}
//                   <div>
//                     <Select
//                       isMulti
//                       options={[
//                         ...enrollSites.map((site) => ({
//                           value: site.locId,
//                           label: site.name,
//                         })),
//                         { value: "Add-EnrollSite", label: "+ Add Enrolled Site" },
//                       ]}
//                       value={(newEmployee.locIds || []).map((id) => ({
//                         value: id,
//                         label: enrollSites.find((site) => site.locId === id)?.name || "Unknown Location",
//                       }))}
//                       onChange={(selectedOptions) => {
//                         if (selectedOptions.some((option) => option.value === "Add-EnrollSite")) {
//                           setSelectedPage("Enroll Site Management");
//                         } else {
//                           const selectedIds = selectedOptions.map((option) => option.value);

//                           // Update newEmployee state
//                           setNewEmployee((prevEmployee) => ({
//                             ...prevEmployee,
//                             locIds: selectedIds,
//                           }));

//                           // Update Redux state
//                           dispatch(setEmployeeData((prevState) => ({
//                             ...prevState,
//                             locIds: selectedIds,
//                           })));
//                         }
//                       }}
//                       placeholder="Select Enrolled Sites"
//                     />
//                   </div>

//                   <label>Gender</label>
//                   <select
//                     name="gender"
//                     value={newEmployee.gender}
//                     onChange={handleChange}
//                     required
//                   >
//                     {isEditMode && (
//                       <option value={editData.gender}>{editData.gender}</option>
//                     )}
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>

//                   <label>Joining Date</label>
//                   <input
//                     type="date"
//                     name="joiningDate"
//                     value={newEmployee.joiningDate}
//                     onChange={handleChange}
//                     required
//                   />

//                   <label>Bank Name</label>
//                   <input
//                     type="text"
//                     name="bankName"
//                     placeholder="Enter Bank Name"
//                     value={newEmployee.bankName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="employee-info-inner">
//                   <label>Shift</label>
//                   <select
//                     name="shift"
//                     value={newEmployee.xid}
//                     onChange={handleShiftChange}
//                     required
//                   >
//                     {isEditMode && (
//                       <option value={editData.xid}>{editData.shift}</option>
//                     )}
//                     <option value="">Select Shift</option>
//                     {shifts.map((shift, index) => (
//                       <option key={shift.shiftId} value={shift.shiftId}>
//                         {shift.name}
//                       </option>
//                     ))}
//                     <option value="Add-Shift">+ Add New Shift</option>
//                   </select>

//                   <label>Overtime Assigned</label>
//                   <select
//                     name="overtimeAssigned"
//                     value={newEmployee.otId}
//                     onChange={handleOvertimeChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.otId}>{editData.OTCode}</option>
//                     )}
//                     <option value="">Select Overtime</option>
//                     {overtime.map((ot) => (
//                       <option key={isEditMode ? ot.otId : ot.OTFormulaId} value={ot.OTFormulaId}>
//                         {ot.OTCode}
//                       </option>
//                     ))}
//                     <option value="Add-Overtime">+ Add Overtime</option>
//                   </select>

//                   <label>Leave Formula Assigned</label>
//                   <select
//                     name="overtimeAssigned"
//                     value={newEmployee.lvfId}
//                     onChange={handleLeaveFormulaChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.lvfId}>{editData.cutCode}</option>
//                     )}
//                     <option value="">Select Leave Formula</option>
//                     {lvf.map((lvf) => (
//                       <option key={lvf.leaveFormulaId} value={lvf.leaveFormulaId}>
//                         {lvf.cutCode}
//                       </option>
//                     ))}
//                     <option value="Add-Leave-Formula">+ Add Leave Formula</option>
//                   </select>

//                   <label>Department Name</label>
//                   <select
//                     name="department"
//                     value={newEmployee.dptId}
//                     onChange={handleDepartmentChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.dptId}>
//                         {editData.department}
//                       </option>
//                     )}
//                     <option value="" disabled>
//                       Select a Department
//                     </option>
//                     {departments.map((dept, index) => (
//                       <option key={dept.dptId} value={dept.dptId}>
//                         {dept.name}
//                       </option>
//                     ))}
//                     <option value="Add-Department">+ Add New Department</option>
//                   </select>

//                   <label>Designation Name</label>
//                   <select
//                     name="designation"
//                     value={newEmployee.dsgId}
//                     onChange={handleDesignationChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.dsgId}>
//                         {editData.designation}
//                       </option>
//                     )}
//                     <option value="" disabled>
//                       Select a Designation
//                     </option>
//                     {designations.map((dsg, index) => (
//                       <option key={dsg.dsgId} value={dsg.dsgId}>
//                         {dsg.name}
//                       </option>
//                     ))}
//                     <option value="Add-Designation">
//                       + Add New Designation
//                     </option>
//                   </select>

//                   <label>Basic Salary</label>
//                   <input
//                     type="number"
//                     name="basicSalary"
//                     placeholder="Enter Basic Salary"
//                     value={newEmployee.basicSalary}
//                     onChange={handleChange}
//                     required
//                   />

//                   <label>Account No</label>
//                   <input
//                     type="text"
//                     name="accountNo"
//                     placeholder="Enter Account Number"
//                     value={newEmployee.accountNo}
//                     onChange={handleChange}
//                     required
//                   />

//                   <label>Salary Period</label>
//                   <select
//                     name="salaryPeriod"
//                     value={newEmployee.salaryPeriod}
//                     onChange={handleChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.salaryPeriod}>
//                         {editData.salaryPeriod}
//                       </option>
//                     )}
//                     <option value="">Select Salary Period</option>
//                     <option value="Monthly">Monthly</option>
//                     <option value="Bi-Weekly">Bi-Weekly</option>
//                     <option value="Weekly">Weekly</option>
//                   </select>

//                   <label>Salary Type</label>
//                   <select
//                     name="salaryType"
//                     value={newEmployee.salaryType}
//                     onChange={handleChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.salaryType}>
//                         {editData.salaryType}
//                       </option>
//                     )}
//                     <option value="">Select Salary Type</option>
//                     <option value="Fixed">Fixed</option>
//                     <option value="Hourly">Hourly</option>
//                   </select>

//                   <label>Enable Attendance</label>
//                   <select
//                     name="enableAttendance"
//                     value={newEmployee.enableAttendance}
//                     onChange={handleChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.enableAttendance}>
//                         {(editData.enableAttendance = true ? "Yes" : "No")}
//                       </option>
//                     )}
//                     <option value="">Select Attendance Status</option>
//                     <option value="1">Yes</option>
//                     <option value="0">No</option>
//                   </select>

//                   <label>Enable Schedule</label>
//                   <select
//                     name="enableSchedule"
//                     value={newEmployee.enableSchedule}
//                     onChange={handleChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.enableSchedule}>
//                         {(editData.enableSchedule = true ? "Yes" : "No")}
//                       </option>
//                     )}
//                     <option value="">Select Schedule Status</option>
//                     <option value="1">Yes</option>
//                     <option value="0">No</option>
//                   </select>

//                   <label>Enable Overtime</label>
//                   <select
//                     name="enableOvertime"
//                     value={newEmployee.enableOvertime}
//                     onChange={handleChange}
//                   >
//                     {isEditMode && (
//                       <option value={editData.enableOvertime}>
//                         {(editData.enableOvertime = true ? "Yes" : "No")}
//                       </option>
//                     )}
//                     <option value="">Select Overtime Status</option>
//                     <option value="1">Yes</option>
//                     <option value="0">No</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="employee-buttons">
//                 <button
//                   className="submit-button"
//                   type="submit"
//                   disabled={exists || error || newEmployee.empId.length === 0}

//                   onClick={
//                     isEditMode ? () => updateEmployee(newEmployee) : addEmployee
//                   }
//                 >
//                   {isEditMode ? "Update Employee" : "Add Employee"}
//                 </button>
//                 <button
//                   className="cancel-button"
//                   type="button"
//                   onClick={cancelHandler}

//                 // onClick={() => {
//                 //   setIsEditMode(false);
//                 //   setNewEmployee({
//                 //     empId: "",
//                 //     fName: "",
//                 //     lName: "",
//                 //     email: "",
//                 //     contactNo: "",
//                 //     picture: null,
//                 //     enrollSite: "",
//                 //     gender: "",
//                 //     joiningDate: "",
//                 //     bankName: "",
//                 //     shift: "",
//                 //     overtimeAssigned: "",
//                 //     leaveFormulaAssigned: "",
//                 //     department: "",
//                 //     designation: "",
//                 //     basicSalary: "",
//                 //     accountNo: "",
//                 //     salaryPeriod: "",
//                 //     salaryType: "",
//                 //     enableAttendance: "",
//                 //     enableSchedule: "",
//                 //     enableOvertime: "",
//                 //   });

//                 //   setActiveTab("Employees");
//                 // }}

//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </section>
//         </form>
//       )}
//     </div>
//   );
// };

// export default AddEmployee;


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Department from "../Department/department";
import ShiftManagement from "../../Shift_Managment/shift_managment";
import WebcamModal from "./webcam";
import OvertimeTable from "../../Settings/Setting_Tabs/OvertimeSettings";
import Location from "../Location/location";
import LeaveTable from "../../Settings/Setting_Tabs/LeaveSettings";
import Designation from "../Designation/designation";
import ConirmationModal from "../../Modal/conirmationModal";
import { resetEmployeeData, setEmployeeData } from "../../../redux/employeeSlice";
import { SERVER_URL } from "../../../config";

// Import animations
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";

const AddEmployee = ({
  setActiveTab,
  isEditMode,
  setIsEditMode,
  editData,
  setEditData,
  onUpdateSuccess
}) => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.employee);
  const debounceTimeout = useRef(null);

  // State Management
  const [selectedPage, setSelectedPage] = useState("");
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [newEmployee, setNewEmployee] = useState(employeeData || {
    empId: "",
    fName: "",
    lName: "",
    dptId: "",
    dsgId: "",
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
    locIds: [],
  });

  // Options for dropdowns
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [enrollSites, setEnrollSites] = useState([]);
  const [overtime, setOvertime] = useState([]);
  const [lvf, setLvf] = useState([]);

  // Fetch initial data
  const fetchOptions = useCallback(async () => {
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
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }, [isEditMode, editData]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchOptions();
  }, [fetchEmployees, fetchOptions]);

  // Cleanup for image URLs and modals
  useEffect(() => {
    let objectUrl;
    if (newEmployee.image1 instanceof File) {
      objectUrl = URL.createObjectURL(newEmployee.image1);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [newEmployee.image1]);

  // Handlers
  const handleLocationChange = useCallback((selectedOptions) => {
    if (!selectedOptions) return;

    if (selectedOptions.some((option) => option.value === "Add-EnrollSite")) {
      setSelectedPage("Enroll Site Management");
    } else {
      const selectedIds = selectedOptions.map((option) => option.value);

      setNewEmployee((prevEmployee) => ({
        ...prevEmployee,
        locIds: selectedIds,
      }));

      // dispatch(setEmployeeData((prevState) => ({
      //   ...prevState,
      //   locIds: selectedIds,
      // })));
      dispatch(setEmployeeData({ locIds: selectedIds }));
    }
  }, [dispatch]);

  const handleDepartmentChange = (event) => {
    const { value } = event.target;
    if (value === "Add-Department") {
      setSelectedPage("Department");
    } else {
      setNewEmployee(prev => ({ ...prev, dptId: value }));
      dispatch(setEmployeeData({ dptId: value }));
    }
  };

  const handleDesignationChange = (event) => {
    const { value } = event.target;
    if (value === "Add-Designation") {
      setSelectedPage("Designation");
    } else {
      setNewEmployee(prev => ({ ...prev, dsgId: value }));
      dispatch(setEmployeeData({ dsgId: value }));
    }
  };

  const handleShiftChange = (event) => {
    const { value } = event.target;
    if (value === "Add-Shift") {
      setSelectedPage("Shift Management");
    } else {
      setNewEmployee(prev => ({ ...prev, xid: value }));
      dispatch(setEmployeeData({ xid: value }));
    }
  };

  const handleOvertimeChange = (event) => {
    const { value } = event.target;
    if (value === "Add-Overtime") {
      setSelectedPage("Overtime Management");
    } else {
      setNewEmployee(prev => ({ ...prev, otId: value }));
      dispatch(setEmployeeData({ otId: value }));
    }
  };

  const handleLeaveFormulaChange = (event) => {
    const { value } = event.target;
    if (value === "Add-Leave-Formula") {
      setSelectedPage("Leave Formula");
    } else {
      setNewEmployee(prev => ({ ...prev, lvfId: value }));
      dispatch(setEmployeeData({ lvfId: value }));
    }
  };

  // const handleChange = useCallback((e, fieldName = null) => {
  //   if (Array.isArray(e)) {
  //     handleLocationChange(e);
  //   } else {
  //     const { name, value } = e.target;

  //     if (name === "empId") {
  //       if (value.length > 9) {
  //         setError("ID cannot exceed 9 characters.");
  //         setExists(false);
  //         return;
  //       }

  //       setError("");
  //       const empExists = employees.some(
  //         (employee) => employee.empId?.toLowerCase() === value.toLowerCase()
  //       );
  //       setExists(empExists);
  //     }

  //     setNewEmployee(prev => ({ ...prev, [name]: value }));
  //     dispatch(setEmployeeData(prev => ({ ...prev, [name]: value })));
  //   }
  // }, [dispatch, employees, handleLocationChange]);


  const handleChange = (e, fieldName = null) => {

    if (Array.isArray(e)) {
      // Handle React-Select multi-select
      const selectedOptions = e.map((option) => ({
        value: option.value,
        label: option.label,
      }));

      setNewEmployee((prev) => {
        const updatedData = {
          ...prev,
          [fieldName]: selectedOptions.map((option) => option.value), // Store only the locIds in the state
        };
        dispatch(setEmployeeData(updatedData)); // Dispatch updated data
        return updatedData;
      });
    }
    else {
      // Handle standard input fields
      const { name, value } = e.target;

      if (name === "empId") {
        setNewEmployee((prev) => {
          const updatedData = { ...prev, empId: value };
          dispatch(setEmployeeData(updatedData)); // Dispatch the updated employee data
          return updatedData;
        });

        if (value.length > 9) {
          setError("ID cannot exceed 9 characters.");
          setExists(false);
          return;
        } else {
          setError("");
        }

        const empExists = employees.some(
          (employee) => employee.empId.toLowerCase() === value.toLowerCase()
        );
        setExists(empExists);
        // setSearchQuery(value);
      } else if (name === "locIds") {
        setNewEmployee((prev) => {
          const updatedData = { ...prev, locIds: value.map((option) => option.value) };
          dispatch(setEmployeeData(updatedData));
          return updatedData;
        });
      } else {
        setNewEmployee((prev) => {
          const updatedData = { ...prev, [name]: value };
          dispatch(setEmployeeData(updatedData));
          return updatedData;
        });
      }
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewEmployee(prev => ({ ...prev, image1: file }));
      dispatch(setEmployeeData(prev => ({ ...prev, image1: file })));
    }
  };

  const handleWebcamCapture = useCallback((imageSrc) => {
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "webcam-image.jpg", { type: "image/jpeg" });
        setNewEmployee(prev => ({ ...prev, image1: file }));
        dispatch(setEmployeeData(prev => ({ ...prev, image1: file })));
      })
      .catch(error => console.error("Error capturing webcam image:", error));
  }, [dispatch]);

  const addEmployee = () => {
    setModalType("create");
    setShowModal(true);
  };

  const updateEmployee = () => {
    setModalType("update");
    setShowModal(true);
  };

  const confirmAdd = async () => {
    if (!Object.values(newEmployee).every(value => value !== "")) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const formData = new FormData();
    Object.keys(newEmployee).forEach(key => {
      if (key === "locIds" && Array.isArray(newEmployee.locIds)) {
        formData.append("locIds", newEmployee.locIds.join(","));
      } else if (key !== "locId") {
        formData.append(key, newEmployee[key]);
      }
    });

    try {
      await axios.post(`${SERVER_URL}pr-emp/`, formData);
      setShowModal(false);
      setSuccessModal(true);
      dispatch(resetEmployeeData());
      setTimeout(() => {
        setActiveTab("Employees");
      }, 2000);
    } catch (error) {
      console.error('Error adding employee:', error);
      setResMsg("Error adding employee. Please try again.");
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const confirmUpdate = async () => {
    if (!Object.values(newEmployee).every(value => value !== "")) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('id', newEmployee.id);
    Object.keys(newEmployee).forEach(key => {
      if (key === "locIds" && Array.isArray(newEmployee.locIds)) {
        formData.append("locIds", newEmployee.locIds.join(","));
      } else if (key !== "locId") {
        formData.append(key, newEmployee[key]);
      }
    });

    try {
      const response = await axios.post(`${SERVER_URL}pr-emp-up/`, formData);
      if (response.data) {
        setShowModal(false);
        setSuccessModal(true);
        dispatch(resetEmployeeData());
        setIsEditMode(false);
        if (typeof onUpdateSuccess === 'function') {
          onUpdateSuccess();
        }
        setTimeout(() => {
          setActiveTab("Employees");
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setResMsg("Error updating employee. Please try again.");
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const cancelHandler = () => {
    dispatch(resetEmployeeData());
    setIsEditMode(false);
    setActiveTab("Employees");
  };

  // // Render different pages based on selectedPage
  // if (selectedPage === "Department") return <Department setSelectedPage={setSelectedPage} />;
  // if (selectedPage === "Shift Management") return <ShiftManagement setSelectedPage={setSelectedPage} />;
  // if (selectedPage === "Designation") return <Designation setSelectedPage={setSelectedPage} />;
  // if (selectedPage === "Overtime Management") return <OvertimeTable setSelectedPage={setSelectedPage} />;
  // if (selectedPage === "Enroll Site Management") return <Location setSelectedPage={setSelectedPage} />;
  // if (selectedPage === "Leave Formula") return <LeaveTable setSelectedPage={setSelectedPage} />;


  return (
    <div className="add-employee-main">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this employee?`}
        onConfirm={() => modalType === "create" ? confirmAdd() : confirmUpdate()}
        onCancel={() => setShowModal(false)}
        animationData={modalType === "create" ? addAnimation : modalType === "update" ? updateAnimation : deleteAnimation}
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
                  {/* Employee ID */}
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="empId"
                    placeholder="Enter Employee ID"
                    value={newEmployee.empId}
                    onChange={handleChange}
                    required
                    disabled={isEditMode}
                  />

                  {!isEditMode && error && (
                    <p style={{ color: "red", fontSize: "0.9em", marginTop: "-30px" }}>
                      &#10006; {error}
                    </p>
                  )}
                  {!isEditMode && !error && exists && (
                    <p style={{ color: "orange", fontSize: "0.9em", marginTop: "-30px" }}>
                      &#9888; This Employee ID already exists.
                    </p>
                  )}
                  {!isEditMode && !error && !exists && newEmployee.empId && (
                    <p style={{ color: "green", fontSize: "0.9em", marginTop: "-30px" }}>
                      &#x2714; This Employee ID is available.
                    </p>
                  )}

                  {/* Basic Information */}
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

                  {/* Picture Upload */}
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
                    {
                      isEditMode && (
                        <div className="empImage">
                          <img
                            src={
                              newEmployee.image1 instanceof File
                                ? URL.createObjectURL(newEmployee.image1) // For new file preview
                                : typeof newEmployee.image1 === "string"
                                  ? `${SERVER_URL}${newEmployee.image1}?${new Date().getTime()}` // Add timestamp to prevent caching from existing image url
                                  : ""
                            }
                            alt={`${newEmployee.fName} ${newEmployee.lName}`}
                            className="employee-image"
                          />
                        </div>
                      )
                    }

                    <img
                      src={
                        typeof newEmployee.image1 === "string"
                          ? `${SERVER_URL}${newEmployee.image1}?${new Date().getTime()}` // Add timestamp to prevent caching from existing image url

                          : newEmployee.image1 instanceof File
                            ? URL.createObjectURL(newEmployee.image1)
                            : ""
                      }
                      alt="Captured"
                      className="captured-image"
                    />
                  </div >

                  {/* Enrolled Sites */}
                  <label>Enrolled Site</label>
                  {/* <Select
                    isMulti
                    options={[
                      ...enrollSites.map((site) => ({
                        value: site.locId,
                        label: site.name,
                      })),
                      { value: "Add-EnrollSite", label: "+ Add Enrolled Site" },
                    ]}
                    value={(newEmployee.locIds || []).map((id) => ({
                      value: id,
                      label: enrollSites.find((site) => site.locId === id)?.name || "Unknown Location",
                    }))}
                    onChange={handleLocationChange}
                    placeholder="Select Enrolled Sites"
                    isSearchable={false}
                    menuPlacement="auto"
                    className="basic-multi-select"
                    classNamePrefix="select"
                  /> */}

                  <Select
                    isMulti
                    options={[
                      ...enrollSites.map((site) => ({
                        value: site.locId,
                        label: site.name,
                      })),
                      { value: "Add-EnrollSite", label: "+ Add Enrolled Site" },
                    ]}
                    value={(newEmployee.locIds || []).map((id) => ({
                      value: id,
                      label: enrollSites.find((site) => site.locId === id)?.name || "Unknown Location",
                    }))}
                    onChange={(selectedOptions) => {
                      if (selectedOptions.some((option) => option.value === "Add-EnrollSite")) {
                        setSelectedPage("Enroll Site Management");
                      } else {
                        const selectedIds = selectedOptions.map((option) => option.value);

                        // Update newEmployee state
                        setNewEmployee((prevEmployee) => ({
                          ...prevEmployee,
                          locIds: selectedIds,
                        }));

                        // // Update Redux state
                        // dispatch(setEmployeeData((prevState) => ({
                        //   ...prevState,
                        //   locIds: selectedIds,
                        // })));
                        dispatch(setEmployeeData({ locIds: selectedIds }));
                      }
                    }}
                    placeholder="Select Enrolled Sites"
                  />

                  {/* Gender */}
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

                  {/* Other Basic Information */}
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
                  {/* Shift */}
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
                    {shifts.map((shift) => (
                      <option key={shift.shiftId} value={shift.shiftId}>
                        {shift.name}
                      </option>
                    ))}
                    <option value="Add-Shift">+ Add New Shift</option>
                  </select>

                  {/* Overtime */}
                  <label>Overtime Assigned</label>
                  <select
                    name="overtimeAssigned"
                    value={newEmployee.otId}
                    onChange={handleOvertimeChange}
                  >
                    <option value="">Select Overtime</option>
                    {overtime.map((ot) => (
                      <option key={ot.OTFormulaId} value={ot.OTFormulaId}>
                        {ot.OTCode}
                      </option>
                    ))}
                    <option value="Add-Overtime">+ Add Overtime</option>
                  </select>

                  {/* Leave Formula */}
                  <label>Leave Formula Assigned</label>
                  <select
                    name="overtimeAssigned"
                    value={newEmployee.lvfId}
                    onChange={handleLeaveFormulaChange}
                  >
                    <option value="">Select Leave Formula</option>
                    {lvf.map((item) => (
                      <option key={item.leaveFormulaId} value={item.leaveFormulaId}>
                        {item.cutCode}
                      </option>
                    ))}
                    <option value="Add-Leave-Formula">+ Add Leave Formula</option>
                  </select>

                  {/* Department */}
                  <label>Department Name</label>
                  <select
                    name="department"
                    value={newEmployee.dptId}
                    onChange={handleDepartmentChange}
                  >
                    <option value="">Select a Department</option>
                    {departments.map((dept) => (
                      <option key={dept.dptId} value={dept.dptId}>
                        {dept.name}
                      </option>
                    ))}
                    <option value="Add-Department">+ Add New Department</option>
                  </select>

                  {/* Designation */}
                  <label>Designation Name</label>
                  <select
                    name="designation"
                    value={newEmployee.dsgId}
                    onChange={handleDesignationChange}
                  >
                    <option value="">Select a Designation</option>
                    {designations.map((dsg) => (
                      <option key={dsg.dsgId} value={dsg.dsgId}>
                        {dsg.name}
                      </option>
                    ))}
                    <option value="Add-Designation">+ Add New Designation</option>
                  </select>

                  {/* Salary Information */}
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

              {/* Form Buttons */}
              <div className="employee-buttons">
                <button
                  className="submit-button"
                  type="submit"
                  disabled={exists || error || !newEmployee.empId}
                  onClick={isEditMode ? () => updateEmployee(newEmployee) : addEmployee}
                >
                  {isEditMode ? "Update Employee" : "Add Employee"}
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={cancelHandler}
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </form>
      )}

      {/* Webcam Modal */}
      <WebcamModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={handleWebcamCapture}
      />
    </div>
  );
};

export default AddEmployee;