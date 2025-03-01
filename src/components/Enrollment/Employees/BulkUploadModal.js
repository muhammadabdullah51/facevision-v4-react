import React, { useCallback, useEffect, useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
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
  const validateColumns = (headers) => {
    const invalidColumns = headers.filter(header => !allowedColumns.includes(header));
    if (invalidColumns.length > 0) {
      throw new Error(`Invalid columns detected: ${invalidColumns.join(', ')}`);
    }
  };

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

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   const fileExtension = file.name.split('.').pop().toLowerCase();

  //   reader.onload = (event) => {


  //     const result = event.target.result;
  //     let parsedData = [];
  //     let headers = [];
  //     try {

  //       if (fileExtension === 'csv') {
  //         const csvResult = Papa.parse(result, {
  //           header: true,
  //           skipEmptyLines: true,
  //           transformHeader: h => h.trim()
  //         });
  //         headers = csvResult.meta.fields || [];
  //         validateColumns(headers);
  //         parsedData = csvResult.data;
  //       } else {
  //         const workbook = XLSX.read(result, { type: 'array' });
  //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //         headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
  //         validateColumns(headers);
  //         parsedData = XLSX.utils.sheet_to_json(worksheet);
  //       }

  //       // Rest of mapping logic...
  //     } catch (error) {
  //       alert(error.message);
  //     }

  //     // Map CSV/excel data to our structure with default values
  //     const mappedData = parsedData.map(row => ({
  //       ...emptyRow,
  //       ...row,
  //       // Handle special cases
  //       enableAttendance: row.enableAttendance?.toLowerCase() === 'true',
  //       enableOvertime: row.enableOvertime?.toLowerCase() === 'true',
  //       enableSchedule: row.enableSchedule?.toLowerCase() === 'true',
  //       locIds: row.locIds ? row.locIds.split(',').map(id => id.trim()) : [],
  //       basicSalary: parseFloat(row.basicSalary) || 0,
  //     }));

  //     setBulkData(mappedData);
  //   };

  //   fileExtension === 'csv' ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
  // };


  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();
  
    reader.onload = (event) => {
      try {
        const result = event.target.result;
        let parsedData = [];
        let headers = [];
  
        if (fileExtension === 'csv') {
          const csvResult = Papa.parse(result, {
            header: true,
            skipEmptyLines: true,
            transformHeader: h => h.trim()
          });
          
          // Get original headers and filter allowed ones
          headers = csvResult.meta.fields || [];
          const filteredHeaders = headers.filter(header => 
            allowedColumns.includes(header)
          );
          
          // Map data with only allowed columns
          parsedData = csvResult.data.map(row => {
            const filteredRow = {};
            filteredHeaders.forEach(header => {
              filteredRow[header] = row[header] || '';
            });
            return filteredRow;
          });
  
        } else {
          const workbook = XLSX.read(result, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
          
          // Filter allowed columns
          const filteredHeaders = headers.filter(header => 
            allowedColumns.includes(header)
          );
          
          // Process data with only allowed columns
          parsedData = XLSX.utils.sheet_to_json(worksheet)
            .map(row => {
              const filteredRow = {};
              filteredHeaders.forEach(header => {
                filteredRow[header] = row[header] || '';
              });
              return filteredRow;
            });
        }
  
        // Map to your structure with default values
        const mappedData = parsedData.map(row => ({
          ...emptyRow,
          ...row,
          // Handle special cases
          enableAttendance: String(row.enableAttendance).toLowerCase() === 'true',
          enableOvertime: String(row.enableOvertime).toLowerCase() === 'true',
          enableSchedule: String(row.enableSchedule).toLowerCase() === 'true',
          locIds: row.locIds ? row.locIds.split(',').map(id => id.trim()) : [],
          basicSalary: parseFloat(row.basicSalary) || 0,
        }));
  
        setBulkData(mappedData);
  
      } catch (error) {
        alert(`Error processing file: ${error.message}`);
      }
    };
  
    fileExtension === 'csv' ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
  };


  const addNewRow = () => {
    setBulkData([...bulkData, { ...emptyRow }]);
  };

  const handleSave = () => {
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
  const API_KEY = 'Qc9472XGJioHSbKUbKyYjF2a'; // Replace with your actual API key

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
          <div className="image-upload-container">
            {previewUrl || currentFile ? (
              <div className="image-preview-wrapper">
                <img
                  src={previewUrl || URL.createObjectURL(currentFile)}
                  alt="Employee preview"
                  className="image-preview"
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
              const location = enrollSites.find(l => l.locId == id);
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
      <div className="bulk-upload-header">
        <h3>Bulk Employee Upload</h3>
        <div className='bulk-add-btns'>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
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