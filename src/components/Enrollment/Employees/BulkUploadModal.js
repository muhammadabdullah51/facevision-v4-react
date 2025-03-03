import React, { useCallback, useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";

// import * as XLSX from 'xlsx';
import axios from 'axios';
import SERVER_URL from '../../../config';
import Select from "react-select";
import { FaPlus, FaTrash } from 'react-icons/fa';
import JSZip from 'jszip';
import { read, utils } from 'xlsx';


const BulkUploadView = ({ onClose, onSave }) => {
  const [bulkData, setBulkData] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [enrollSites, setEnrollSites] = useState([]);
  const [overtime, setOvertime] = useState([]);
  const [lvf, setLvf] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  useEffect(() => {
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [successModal]);


  const fetchOptions = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}emp-fun/`);
      setDepartments(response.data.dpt_data);
      setShifts(response.data.shft_data);
      setEnrollSites(response.data.loc_data);
      setOvertime(response.data.ot_data);
      setDesignations(response.data.dsg_data);
      setLvf(response.data.lvf_data);


    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }, []);

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

  const [empIdValidations, setEmpIdValidations] = useState([]);

  // Update validation state when bulkData changes
  useEffect(() => {
    setEmpIdValidations(bulkData.map(row => ({
      error: row.empId.length > 9 ? "ID cannot exceed 9 characters" : "",
      exists: employees.some(emp => emp.empId === row.empId),
      isEmpty: !row.empId
    })));
  }, [bulkData, employees]);

  // Initialize empty row template
  const emptyRow = {
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
  };

  const allowedColumns = [
    'empId', 'fName', 'lName', 'dptId', 'dsgId', 'xid', 'otId', 'lvfId',
    'gender', 'email', 'joiningDate', 'contactNo', 'image1', 'bankName',
    'basicSalary', 'accountNo', 'salaryPeriod', 'salaryType', 'enableAttendance',
    'enableOvertime', 'enableSchedule', 'locIds'
  ];

  // Add validation function
  // const validateColumns = (headers) => {
  //   const invalidColumns = headers.filter(header => !allowedColumns.includes(header));
  //   if (invalidColumns.length > 0) {
  //     throw new Error(`Invalid columns detected: ${invalidColumns.join(', ')}`);
  //   }
  // };

  const validateEmpId = (index, value) => {
    const error = value.length > 9 ? "ID cannot exceed 9 characters" : "";
    const exists = employees.some(emp => emp.empId === value);
    const isEmpty = !value;

    setEmpIdValidations(prev => {
      const newValidations = [...prev];
      newValidations[index] = { error, exists, isEmpty };
      return newValidations;
    });
  };

  const [imageFolderMap, setImageFolderMap] = useState({});
  const folderInputRef = useRef(null);
  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const mapping = {};
    files.forEach((file) => {
      // Use the filename (without extension) as the key
      const empID = file.name.split(".")[0];
      mapping[empID] = URL.createObjectURL(file);
    });
    setImageFolderMap(mapping);
  };

  // Trigger the hidden folder input when button is clicked
  const triggerFolderUpload = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  const [companyCode, setCompanyCode] = useState("");

  useEffect(() => {
    axios
      .get(`${SERVER_URL}auth-cmp-reg/`)
      .then((response) => {
        // Assuming response.data.context is an array with at least one element.
        const companyData = response.data.context[0];
        // Extract the first two letters of companyName and convert to uppercase.
        const code = companyData.companyName.slice(0, 2).toUpperCase();
        setCompanyCode(code);
      })
      .catch((error) => {
        console.error("There was an error checking company info status", error);
      });
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      function formatDate(inputDate) {
        const date = new Date(inputDate);
        if (!isNaN(date)) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return inputDate; // fallback if parsing fails.
      }
      // Common processing function for each row.
      // const processData = (data) =>
      //   data.map((row) => {
      //     // Get the full name from either "name" or "Name"
      //     const fullName = row.name || row.Name || "";

      //     // If fname and lname are missing but fullName exists, split it.
      //     if (!row.fName && !row.lName && fullName) {
      //       const parts = String(fullName).trim().split(" ");
      //       if (parts.length === 1) {
      //         // Only one name found; use it for both fName and lname.
      //         row.fName = parts[0];
      //         row.lName = parts[0];
      //       } else {
      //         row.fName = parts[0] || "";
      //         row.lName = parts.slice(1).join(" ") || "";
      //       }
      //     }

      //     return {
      //       ...emptyRow,
      //       ...row,
      //       enableAttendance: String(row.enableAttendance).toLowerCase() === "true",
      //       enableOvertime: String(row.enableOvertime).toLowerCase() === "true",
      //       enableSchedule: String(row.enableSchedule).toLowerCase() === "true",
      //       // Convert locIds to string first so .split() always works.
      //       locIds: row.locIds ? String(row.locIds).split(",").map((id) => id.trim()) : [],
      //       basicSalary: parseFloat(row.basicSalary) || 0,
      //       image1:
      //         row.empId && imageFolderMap[row.empId]
      //           ? imageFolderMap[row.empId]
      //           : row.image1,
      //     };
      //   });
      const processData = (data) =>
        data.map((row) => {

          // empId: if missing, assign a random number.
          const empId = row.empId || `${companyCode}-${Math.floor(Math.random() * 10000)}`;
          // Handle name: check for fName and lName, otherwise try splitting "name" or "Name".
          let fName = row.fName || "";
          let lName = row.lName || "";
          const fullName = row.name || row.Name || "";
          if (!fName && !lName && fullName) {
            const parts = String(fullName).trim().split(" ");
            if (parts.length === 1) {
              fName = parts[0];
              lName = parts[0];
            } else if (parts.length > 1) {
              fName = parts[0];
              lName = parts.slice(1).join(" ");
            }
          }
          // If still missing, assign default "none".
          if (!fName) fName = "none";
          if (!lName) lName = "none";

          // For IDs, default to 1 if missing.
          const dptId = row.dptId || 1;
          const dsgId = row.dsgId || 3;
          const xid = row.xid || 1;
          const otId = row.otId || 1;
          const lvfId = row.lvfId || 1;

          // Other fields with defaults.
          const gender = row.gender || "Male";
          const email = row.email || "abc@gmail.com";
          // For joiningDate, default to current date (YYYY-MM-DD).
          const joiningDate = row.joiningDate
            ? formatDate(row.joiningDate)
            : new Date().toISOString().split("T")[0];
          const contactNo = row.contactNo || "132";
          const bankName = row.bankName || "132";
          const basicSalary = row.basicSalary ? parseFloat(row.basicSalary) : 0;
          const accountNo = row.accountNo || "123";
          const salaryType = row.salaryType || "Fixed";
          const salaryPeriod = row.salaryPeriod || "Monthly";
          // For locIds, ensure it's a string, then split, or default to [1].
          const locIds = row.locIds
            ? String(row.locIds)
              .split(",")
              .map((id) => id.trim())
            : [1];

          // Process booleans.
          const enableAttendance =
            String(row.enableAttendance).toLowerCase() === "true";
          const enableOvertime = String(row.enableOvertime).toLowerCase() === "true";
          const enableSchedule = String(row.enableSchedule).toLowerCase() === "true";

          // Image mapping: if there's an image for empId in imageFolderMap, use that.
          const image1 = imageFolderMap[empId] ? imageFolderMap[empId] : (row.image1 || "");

          return {
            ...emptyRow,
            ...row, // merge original row data (overridden by defaults below)
            empId,
            fName,
            lName,
            dptId,
            dsgId,
            xid,
            otId,
            lvfId,
            gender,
            email,
            joiningDate,
            contactNo,
            image1,
            bankName,
            basicSalary,
            accountNo,
            salaryType,
            salaryPeriod,
            locIds,
            enableAttendance,
            enableOvertime,
            enableSchedule,
          };
        });



      if (file.name.endsWith(".csv")) {
        // CSV file handling.
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvResult = Papa.parse(event.target.result, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim(),
          });
          const filteredHeaders =
            csvResult.meta.fields?.filter((header) =>
              allowedColumns.includes(header)
            ) || [];
          const parsedData = csvResult.data.map((row) => {
            const filteredRow = {};
            filteredHeaders.forEach((header) => {
              filteredRow[header] = row[header] || "";
            });
            return filteredRow;
          });
          setBulkData(processData(parsedData));
        };
        reader.readAsText(file);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // Process XLSX/XLS file.
        const workbook = read(await file.arrayBuffer(), { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // Use defval: "" so that missing values are empty strings.
        const jsonData = utils.sheet_to_json(worksheet, { defval: "" });

        // Step 1: Trim header keys (to mimic CSV's transformHeader).
        const trimmedData = jsonData.map((row) => {
          const newRow = {};
          Object.keys(row).forEach((key) => {
            newRow[key.trim()] = row[key];
          });
          return newRow;
        });

        // Step 2: Filter to allowed columns (like CSV processing).
        const filteredData = trimmedData.map((row) => {
          const filteredRow = {};
          allowedColumns.forEach((header) => {
            filteredRow[header] = row[header] || "";
          });
          return filteredRow;
        });

        // Build a local mapping: use external mapping if available; 
        // otherwise attempt to extract embedded images from the Excel file.
        let localImageMap = { ...imageFolderMap };
        if (Object.keys(localImageMap).length === 0) {
          const zip = await JSZip.loadAsync(file);
          const mediaFolder = zip.folder("xl/media");
          if (mediaFolder) {
            const mediaFiles = Object.keys(zip.files).filter((name) =>
              name.startsWith("xl/media/")
            );
            const mappingEntries = await Promise.all(
              mediaFiles.map(async (filePath) => {
                const fileEntry = zip.files[filePath];
                const blob = await fileEntry.async("blob");
                const fileName = filePath.split("/").pop();
                const empID = fileName.split(".")[0];
                return [empID, URL.createObjectURL(blob)];
              })
            );
            localImageMap = Object.fromEntries(mappingEntries);
          }
        }

        // Process each row: if a matching image exists in the mapping, assign it.
        const processedData = jsonData.map((row) => {
          const processedRow = processData([row])[0];
          if (processedRow.empId && localImageMap[processedRow.empId]) {
            processedRow.image1 = localImageMap[processedRow.empId];
          }
          return processedRow;
        });

        setBulkData(processedData);
      }
    } catch (error) {
      alert(`Error processing file: ${error.message}`);
    }
  };

  useEffect(() => {
    if (bulkData.length > 0) {
      const updatedData = bulkData.map((row) => {
        if (row.empId && imageFolderMap[row.empId]) {
          return { ...row, image1: imageFolderMap[row.empId] };
        }
        return row;
      });
      setBulkData(updatedData);
    }
  }, [bulkData, imageFolderMap]);




  const addNewRow = () => {
    setBulkData([...bulkData, { ...emptyRow }]);
  };

  // const handleSave = () => {
  //   onSave(bulkData);
  //   onClose();
  // };
  const handleSave = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    // Validate every allowed column in each row.
    for (const row of bulkData) {
      for (const column of allowedColumns) {
        if (
          row[column] === undefined ||
          row[column] === null ||
          (typeof row[column] === "string" && row[column].trim() === "")
        ) {
          setResMsg(`Please fill in all required fields. Missing ${column}.`);
          // Close the confirmation modal and show warning.
          setShowModal(false);
          setWarningModal(true);
          return;
        }
      }
    }

    // If all rows pass validation, show the success modal.
    // setShowModal(false);
    // setSuccessModal(true);

    // Proceed to save and close.
    onSave(bulkData);
    onClose();
  };
  const handleRemoveRow = (index) => {
    setBulkData(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const newData = [...bulkData];
    newData[index][field] = value;
    setBulkData(newData);

    // Handle special field types
    switch (field) {
      case 'empId':
        validateEmpId(index, value);
        break;
      case 'basicSalary':
      case 'locIds':
        // newData[index][field] = value.split(',').map(id => id.trim());
        newData[index][field] = value;
        break;
      case 'dptId':
      case 'dsgId':
      case 'xid':
      case 'otId':
      case 'itId':
      case 'lvfId':
        newData[index][field] = value;
        // Find and store corresponding name for display
        const option = getOptionForField(field, value);
        if (option) newData[index][`${field}Name`] = option.name;
        break;
      case 'enableAttendance':
      case 'enableOvertime':
      case 'enableSchedule':
        newData[index][field] = typeof value === 'boolean' ? value : value === 'true';
        break;
      default:
        newData[index][field] = value;
    }

    setBulkData(newData);
  };

  const allEmpIdsValid = () => {
    return empIdValidations.every(validation =>
      !validation.error &&
      !validation.exists &&
      !validation.isEmpty
    );
  };

  const getOptionForField = (field, value) => {
    const options = {
      dptId: departments,
      dsgId: designations,
      xid: shifts,
      otId: overtime,
      lvfId: lvf,
      locIds: enrollSites
    }[field];

    return options?.find(opt => opt.id === value);
  };


  const [imagePreviews, setImagePreviews] = useState({});
  const API_KEY = process.env.REACT_APP_BG_REMOVE_API_KEY;


  const handleImageUpload = async (file, index) => {
    try {
      const formData = new FormData();
      formData.append('image_file', file);

      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: { 'X-Api-Key': API_KEY },
        responseType: 'blob'
      });

      const bgRemovedFile = new File([response.data], 'bg-removed-image.png', {
        type: 'image/png'
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(bgRemovedFile);

      // Update state
      setBulkData(prev => {
        const newData = [...prev];
        newData[index].image1 = bgRemovedFile;
        return newData;
      });

      setImagePreviews(prev => ({ ...prev, [index]: previewUrl }));

    } catch (error) {
      console.error("Error removing background:", error);
      // Fallback to original file
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [index]: previewUrl }));
      setBulkData(prev => {
        const newData = [...prev];
        newData[index].image1 = file;
        return newData;
      });
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });

    setBulkData(prev => {
      const newData = [...prev];
      newData[index].image1 = null;
      return newData;
    });
  };

  const renderFieldInput = (index, field, value) => {
    const commonSelectProps = {
      value: value || '',
      onChange: (e) => handleFieldChange(index, field, e.target.value),
      className: 'bulk-select'
    };

    switch (field) {
      case 'empId':
        return (
          <div className="empId-validation-container">
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(index, field, e.target.value)}
              className="bulk-input"
              // placeholder="Enter Employee ID"
              maxLength={9}
            />
            {empIdValidations[index]?.error && (
              <div className="validation-message error">
                <p style={{ color: "red", fontSize: "0.9em", marginTop: "-5px" }}>
                  &#10006; {empIdValidations[index].error}
                </p>

              </div>
            )}
            {!empIdValidations[index]?.error && empIdValidations[index]?.exists && (
              <p style={{ color: "orange", fontSize: "0.9em", marginTop: "-5px" }}>
                &#9888; This Employee ID already exists.
              </p>
            )}
            {!empIdValidations[index]?.error &&
              !empIdValidations[index]?.exists &&
              empIdValidations[index]?.isEmpty && (
                <p style={{ color: "red", fontSize: "0.9em", marginTop: "-5px" }}>
                  &#10006; Employee ID is required.
                </p>
              )}
            {!empIdValidations[index]?.error &&
              !empIdValidations[index]?.exists &&
              !empIdValidations[index]?.isEmpty && (
                <p style={{ color: "green", fontSize: "0.9em", marginTop: "-5px" }}>
                  &#x2714; This Employee ID is available.
                </p>
              )}
          </div>
        );
      case 'gender':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        );

      case 'salaryPeriod':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Salary Period</option>
            <option value="Monthly">Monthly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Weekly">Weekly</option>
          </select>
        );

      case 'salaryType':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Salary Type</option>
            <option value="Fixed">Fixed</option>
            <option value="Hourly">Hourly</option>
          </select>
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(index, field, e.target.value)}
            className="bulk-input"
            placeholder="Enter valid email"
          />
        );

      case 'joiningDate':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(index, field, e.target.value)}
            className="bulk-input"
          />
        );

      case 'image1':
        const previewUrl = imagePreviews[index];
        const currentFile = bulkData[index].image1;

        return (
          <div className="image-upload-container empImage">
            {previewUrl || currentFile ? (
              <div className="image-preview-wrapper">
                <img
                  src={previewUrl || (typeof currentFile === "string" ? currentFile : URL.createObjectURL(currentFile))}
                  alt="Employee preview"
                  className="employee-image"
                />
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleImageUpload(file, index);
                }}
              />
            )}
          </div>
        );
      case 'dptId':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.dptId} value={dept.dptId}>
                {dept.name}
              </option>
            ))}
          </select>
        );

      case 'dsgId':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Designation</option>
            {designations.map(dsg => (
              <option key={dsg.dsgId} value={dsg.dsgId}>
                {dsg.name}
              </option>
            ))}
          </select>
        );

      case 'xid':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Shift</option>
            {shifts.map(shift => (
              <option key={shift.shiftId} value={shift.shiftId}>
                {shift.name}
              </option>
            ))}
          </select>
        );

      case 'lvfId':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Leave Formula</option>
            {lvf.map(formula => (
              <option key={formula.leaveFormulaId} value={formula.leaveFormulaId}>
                {formula.cutCode}
              </option>
            ))}
          </select>
        );
      case 'otId':
        return (
          <select {...commonSelectProps}>
            <option value="">Select Overtime Formula</option>
            {overtime.map(ot => (
              <option key={ot.OTFormulaId} value={ot.OTFormulaId}>
                {ot.OTCode}
              </option>
            ))}
          </select>
        );

      case 'locIds':
        return (
          // <Select
          //   isMulti
          //   options={enrollSites.map(loc => ({
          //     value: loc.locId,
          //     label: loc.name
          //   }))}
          //   value={value.map(id => ({
          //     value: id,
          //     label: enrollSites.find(l => l.locId === id)?.name || id
          //   }))}
          //   onChange={(selected) => handleFieldChange(
          //     index,
          //     'locIds',
          //     selected.map(s => s.value).join(',')
          //   )}
          //   className="bulk-multi-select"
          // />
          <Select
            isMulti
            options={enrollSites.map(loc => ({
              value: loc.locId,
              label: loc.name
            }))}
            value={value.map(id => {
              const location = enrollSites.find(l => l.locId === id);
              return {
                value: id,
                label: location ? location.name : `Unknown Location (ID: ${id})`
              };
            })}
            onChange={(selected) => handleFieldChange(
              index,
              'locIds',
              selected.map(s => s.value)
            )}
            className="bulk-multi-select"
            isLoading={!enrollSites.length} // Show loading if data not fetched
          />
        );

      case 'enableAttendance':
      case 'enableOvertime':
      case 'enableSchedule':
        return (
          <select {...commonSelectProps}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      default:
        return <input
          value={value}
          onChange={(e) => handleFieldChange(index, field, e.target.value)}
          className="bulk-input"
        />;
    }
  };


  return (
    <div className="departments-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to add all these employees?`
        }
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
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
        message={ `Department ${modalType}d successfully!`}
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
      <div className="bulk-upload-header">
        <h3>Bulk Employee Upload</h3>
        <div className='bulk-add-btns'>

          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />

          {/* Hidden file input for folder selection */}
          <input
            type="file"
            webkitdirectory="true"
            ref={folderInputRef}
            style={{ display: "none" }}
            onChange={handleFolderUpload}
          />

          {/* Button to trigger folder upload */}
          <button onClick={triggerFolderUpload} className="add-button">
            <FaPlus className="add-icon" /> Add All Images
          </button>
          {/* <pre>{JSON.stringify(bulkData, null, 2)}</pre> */}



          <button onClick={addNewRow} className='add-button'><FaPlus className="add-icon" />Add New Row</button>

          <button onClick={handleSave} className="submit-button" style={{ marginLeft: '10px' }} disabled={!allEmpIdsValid()}>Save All</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>

      <div className="editable-table-container">
        <table className="table">
          <thead>
            <tr>
              {Object.keys(emptyRow).map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bulkData.map((row, index) => (
              <tr key={index} className='bulk-add-form'>
                {Object.entries(row).map(([field, value]) => (
                  <td key={field}>
                    {renderFieldInput(index, field, value)}
                  </td>
                ))}
                <td>
                  <button
                    onClick={() => handleRemoveRow(index)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaTrash className="table-delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkUploadView;