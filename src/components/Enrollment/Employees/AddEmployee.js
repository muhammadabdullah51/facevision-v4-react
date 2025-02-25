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
import ImageCropper from "./ImageCropper";
import getCroppedImg from "./cropImage";

// import imglyRemoveBackground from '@imgly/background-removal';

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

  const [isCropping, setIsCropping] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState("");

  // Determine the current image source (preview)
  const imageSrc =
    newEmployee.image1 instanceof File || newEmployee.image1 instanceof Blob
      ? URL.createObjectURL(newEmployee.image1)
      : typeof newEmployee.image1 === "string"
        ? `${SERVER_URL}${newEmployee.image1}?${new Date().getTime()}`
        : "";

  // When the crop is applied, generate the cropped image blob and update state.
  // const onCropSave = useCallback(
  //   async (croppedAreaPixels) => {
  //     try {
  //       const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
  //       setCroppedImageUrl(croppedDataUrl);

  //       // Update your state with the Data URL instead of a Blob
  //       setNewEmployee((prev) => ({ ...prev, image1: croppedDataUrl }));
  //       // dispatch({ type: "SET_EMPLOYEE_DATA", payload: { image1: croppedDataUrl } });

  //       // Close the cropper
  //       setIsCropping(false);
  //     } catch (error) {
  //       console.error("Error cropping image:", error);
  //     }
  //   },
  //   [imageSrc, setNewEmployee, dispatch]
  // );

  const onCropSave = useCallback(
    async (croppedAreaPixels) => {
      try {
        const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
        
        // Convert Data URL to File
        const blob = await fetch(croppedDataUrl).then(res => res.blob());
        const croppedFile = new File([blob], 'cropped-image.png', {
          type: 'image/png'
        });
  
        // Update state with File
        setNewEmployee((prev) => ({
          ...prev,
          image1: croppedFile
        }));
        
        dispatch(setEmployeeData({ image1: croppedFile }));
        setCroppedImageUrl(URL.createObjectURL(croppedFile));
        setIsCropping(false);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    },
    [imageSrc, dispatch]
  );
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


  const API_KEY = 'Qc9472XGJioHSbKUbKyYjF2a'; // Replace with your actual API key





  // const handlePictureChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('image_file', file);

  //     try {
  //       const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
  //         headers: {
  //           'X-Api-Key': API_KEY,
  //         },
  //         responseType: 'blob', // Important for handling binary data
  //       });

  //       const bgRemovedFile = new File([response.data], 'bg-removed-image.png', { type: 'image/png' });
  //       setNewEmployee(prev => ({ ...prev, image1: bgRemovedFile }));
  //       dispatch(setEmployeeData(prev => ({ ...prev, image1: bgRemovedFile })));
  //     } catch (error) {
  //       console.error("Error removing background:", error);
  //     }
  //   }
  // };

  // const handleWebcamCapture = useCallback(async (imageSrc) => {
  //   try {
  //     const response = await fetch(imageSrc);
  //     const blob = await response.blob();
  //     const file = new File([blob], "webcam-image.jpg", { type: "image/jpeg" });

  //     const formData = new FormData();
  //     formData.append('image_file', file);

  //     const bgResponse = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
  //       headers: {
  //         'X-Api-Key': API_KEY,
  //       },
  //       responseType: 'blob',
  //     });

  //     const bgRemovedFile = new File([bgResponse.data], 'bg-removed-webcam-image.png', { type: 'image/png' });
  //     setNewEmployee(prev => ({ ...prev, image1: bgRemovedFile }));
  //     dispatch(setEmployeeData(prev => ({ ...prev, image1: bgRemovedFile })));
  //   } catch (error) {
  //     console.error("Error capturing or removing background from webcam image:", error);
  //   }
  // }, [dispatch]);






  // Handle image file change
  //  const handlePictureChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setNewEmployee((prevState) => {
  //       const updatedState = { ...prevState, image1: file };
  //       dispatch(setEmployeeData(updatedState));  // Dispatch updated data to Redux
  //       return updatedState;
  //     });
  //   }
  // };

  // const handleWebcamCapture = (imageSrc) => {
  //   fetch(imageSrc)
  //     .then((res) => res.blob())
  //     .then((blob) => {
  //       const file = new File([blob], "webcam-image.jpg", { type: "image/jpeg" });

  //       // Update the local state first
  //       setNewEmployee((prevState) => ({ ...prevState, image1: file }));

  //       // Dispatch the updated state separately
  //       const updatedState = { image1: file }; // Only the new file
  //       dispatch(setEmployeeData(updatedState));
  //     })
  //     .catch((error) => {
  //       console.error("Error capturing webcam image:", error);
  //     });
  // };

  // const handlePictureChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Prepare formData for remove.bg
  //     const formData = new FormData();
  //     formData.append("image_file", file);

  //     try {
  //       // Call remove.bg API to remove the background
  //       const response = await axios.post(
  //         "https://api.remove.bg/v1.0/removebg",
  //         formData,
  //         {
  //           headers: {
  //             "X-Api-Key": API_KEY,
  //           },
  //           responseType: "blob", // We expect a blob as a response
  //         }
  //       );

  //       // Convert the response blob to a Data URL
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         const dataUrl = reader.result;
  //         // Update state with the background-removed image (as a Data URL)
  //         setNewEmployee((prevState) => {
  //           const updatedState = { ...prevState, image1: dataUrl };
  //           dispatch(setEmployeeData(updatedState));
  //           return updatedState;
  //         });
  //       };
  //       reader.readAsDataURL(response.data);
  //     } catch (error) {
  //       console.error("Error removing background:", error);
  //     }
  //   }
  // };

  // const handleWebcamCapture = async (imageSrc) => {
  //   try {
  //     // Convert the webcam image source (data URL) to a blob
  //     const response = await fetch(imageSrc);
  //     const blob = await response.blob();
  //     // Create a File object from the blob
  //     const file = new File([blob], "webcam-image.jpg", { type: "image/jpeg" });

  //     // Prepare formData for remove.bg
  //     const formData = new FormData();
  //     formData.append("image_file", file);

  //     // Call remove.bg API to remove the background
  //     const bgResponse = await axios.post(
  //       "https://api.remove.bg/v1.0/removebg",
  //       formData,
  //       {
  //         headers: {
  //           "X-Api-Key": API_KEY,
  //         },
  //         responseType: "blob",
  //       }
  //     );

  //     // Convert the response blob to a Data URL
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const dataUrl = reader.result;
  //       // Update state with the background-removed image (as a Data URL)
  //       setNewEmployee((prevState) => ({ ...prevState, image1: dataUrl }));
  //       dispatch(setEmployeeData({ image1: dataUrl }));
  //     };
  //     reader.readAsDataURL(bgResponse.data);
  //   } catch (error) {
  //     console.error("Error capturing or removing background from webcam image:", error);
  //   }
  // };

  const handlePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Add background removal API call
        const formData = new FormData();
        formData.append('image_file', file);

        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
          headers: { 'X-Api-Key': API_KEY },
          responseType: 'blob'
        });

        // Convert blob to File
        const bgRemovedFile = new File([response.data], 'bg-removed-image.png', {
          type: 'image/png'
        });

        // Use your existing state update pattern
        setNewEmployee((prevState) => {
          const updatedState = { ...prevState, image1: bgRemovedFile };
          dispatch(setEmployeeData(updatedState));
          return updatedState;
        });

      } catch (error) {
        console.error("Error removing background:", error);
        // Fallback to original file if API fails
        setNewEmployee((prevState) => {
          const updatedState = { ...prevState, image1: file };
          dispatch(setEmployeeData(updatedState));
          return updatedState;
        });
      }
    }
  };

  const handleWebcamCapture = (imageSrc) => {
    fetch(imageSrc)
      .then((res) => res.blob())
      .then(async (blob) => {
        const originalFile = new File([blob], "webcam-image.jpg", {
          type: "image/jpeg"
        });

        try {
          // Add background removal API call
          const formData = new FormData();
          formData.append('image_file', originalFile);

          const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: { 'X-Api-Key': API_KEY },
            responseType: 'blob'
          });

          // Convert blob to File
          const bgRemovedFile = new File([response.data], 'bg-removed-webcam.png', {
            type: 'image/png'
          });

          // Use your existing state update pattern
          setNewEmployee((prevState) => ({ ...prevState, image1: bgRemovedFile }));
          dispatch(setEmployeeData({ image1: bgRemovedFile }));

        } catch (error) {
          console.error("Background removal failed:", error);
          // Fallback to original webcam image
          setNewEmployee((prevState) => ({ ...prevState, image1: originalFile }));
          dispatch(setEmployeeData({ image1: originalFile }));
        }
      })
      .catch((error) => {
        console.error("Error capturing webcam image:", error);
      });
  };



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
                    id="button-webcam"
                  >
                    Capture Picture with Webcam
                  </button>


                  <div className="captured-image-container">
                    {isEditMode && (
                      <div className="empImage">
                        <img
                          src={croppedImageUrl || imageSrc}
                          alt="Employee"
                          className="employee-image"
                        />
                      </div>
                    )}
                    {imageSrc && (
                      <>
                        <img
                          src={croppedImageUrl || imageSrc}
                          alt="Captured"
                          className="captured-image"
                          style={{ borderRadius: "20px" }}
                        />
                        <br />
                        <button
                          type="button"
                          onClick={() => setIsCropping(true)}
                          className="submit-button"
                        >
                          Crop Image
                        </button>
                      </>
                    )}

                  </div>
                  <div
                  >

                    {isCropping && (
                      <ImageCropper imageSrc={imageSrc} onCropSave={onCropSave} />
                    )}
                  </div>




                 
                  <WebcamModal
                    isOpen={isWebcamOpen}
                    onClose={() => setIsWebcamOpen(false)}
                    onCapture={handleWebcamCapture}
                  />



                  {/* Enrolled Sites */}
                  <label>Enrolled Site</label>
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
                        ;
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