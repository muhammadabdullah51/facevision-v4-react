import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaFileAlt, FaTable, FaThLarge } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import EmployeeReportModal from "./EmployeeReportModal";
import Default_picture from "../../../assets/profile.jpg";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import "./employees.css";
import { Tooltip } from 'react-tooltip'
import BulkUploadModal from "./BulkUploadModal";
const EmployeeTable = ({
  // data,
  // setData,
  // setActiveTab,
  // setSelectedEmployee,
  onEdit,
  onAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  // const [isActiveTab, setIsActiveTab] = useState(false);
  const [formData, setFormData] = useState({
    empId: null,
    employeeName: "",
    fName: "",
    lName: "",
    department: "",
    enrollSite: "",
    shift: "",
    salaryType: "",
    contactNo: "",
    basicSalary: "",
    accountNo: "",
    bankName: "",
    image1: "",
  });

  // const [editData, setEditData] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7;

  // Filter the data based on search input
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle Generate Report
  const handleGenerateReport = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  // const handleEdit = (row) => {
  //   onEdit(row);
  // };
  const handleEdit = useCallback((row) => {
    setFormData(row); // Update form data before edit
    setIsEditMode(true);
    onEdit(row);
  }, [onEdit]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const fetchEmployees = useCallback(

    async () => {
      try {
        const response = await axios.get(`${SERVER_URL}pr-emp/`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
      }
    }, []
  )

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchEmployees, successModal]);


  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });
    console.log(formData);

  };
  const confirmDelete = async () => {
    console.log(formData.id);

    try {
      await axios.delete(`${SERVER_URL}pr-emp-del/${formData.id}/delete/`);
      const updatedData = await axios.get(`${SERVER_URL}pr-emp/`);
      setData(updatedData.data);
      fetchEmployees();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  }

  const handleAdd = () => {
    onAdd()
  };

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Slice data for current page
  const currentPageData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const [isTableView, setIsTableView] = useState(true);
  const [isCardView, setIsCardView] = useState(false);


  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = currentPageData.map((row) => row.id);
      setSelectedIds(allIds);
      console.log(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowCheckboxChange = (event, rowId) => {
    const isChecked = event.target.checked;

    setSelectedIds((prevSelectedIds) => {
      if (isChecked) {
        return [...prevSelectedIds, rowId];
      } else {
        const updatedIds = prevSelectedIds.filter((id) => id !== rowId);
        if (updatedIds.length !== currentPageData.length) {
          setSelectAll(false);
        }
        return updatedIds;
      }
    });
    console.log(selectedIds);
  };
  useEffect(() => {
    if (selectedIds.length === currentPageData.length && currentPageData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedIds, currentPageData]);


  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setModalType("delete selected");
      setShowModal(true);
    } else {
      setResMsg("No rows selected for deletion.");
      setShowModal(false);
      setWarningModal(true);
    }
  };


  const confirmBulkDelete = async () => {
    try {
      const payload = { ids: selectedIds };
      console.log(payload);
      await axios.post(`${SERVER_URL}emp/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pr-emp/`);
      setData(updatedData.data);
      setShowModal(false);
      setSelectedIds([]);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting rows:", error);
    } finally {
      setShowModal(false);
    }
  };



  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const handleBulkAdd = () => {
    setShowBulkUpload(true);
    setIsCardView(false);
    setIsTableView(false);
  };

  const handleBulkUploadClose = () => {
    setShowBulkUpload(false);
  };
  const [bulkEditData, setBulkEditData] = useState([]);
  

  const convertBlobUrlToFile = async (blobUrl, fileName, mimeType) => {
    console.log("Fetching blob from URL:", blobUrl);
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    console.log("Blob fetched. Creating file:", fileName);
    return new File([blob], fileName, { type: mimeType });
  };

  const handleBulkSave = async (data) => {
    try {
      const formData = new FormData();
      const employeeData = [];
  
      console.log("Original employee data:", data);
  
      for (let employee of data) {
        const employeeCopy = { ...employee };
        if (employeeCopy.image1) {
          if (typeof employeeCopy.image1 === "string" && employeeCopy.image1.startsWith("blob:")) {
            const fileName = `${employee.empId}.png`;
            console.log(`Converting blob image for employee ID ${employee.empId} with file name: ${fileName}`);
            const imageFile = await convertBlobUrlToFile(employeeCopy.image1, fileName, "image/png");
            console.log("Converted file object:", imageFile);
            formData.append(fileName, imageFile);
            employeeCopy.image1 = fileName;
          }
          else if (employeeCopy.image1 instanceof File) {
            const fileName = employeeCopy.image1.name;
            console.log(`Attaching existing File for employee ID ${employee.empId} with file name: ${fileName}`);
            formData.append(fileName, employeeCopy.image1);
            employeeCopy.image1 = fileName;
          }
        }
  
        employeeData.push(employeeCopy);
      }
      console.log("Employee data prepared for JSON (with file references):", employeeData);
      // formData.append("employee", employeeData);  
      formData.append("employee", JSON.stringify(employeeData));  
      console.log("Final FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log("Sending request...");
      const response = await axios.post(
        `${SERVER_URL}pr-bulk-add-emp/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Bulk upload success:", response.data);
      setShowModal(false)
      setModalType('bulkAdd')
      setSuccessModal(true)
      
    } catch (error) {
      console.error("Error uploading bulk data:", error);
    }
  };


  const handleSaveFromModal = (data) => {
    setBulkEditData(data);
    handleBulkSave(data);
  };



  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Employee?`
        }
        onConfirm={() => {
          if (modalType === "delete selected") confirmBulkDelete();
          else confirmDelete();
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
        message={
          modalType === "delete selected"
            ? "Selected items deleted successfully!"
            : modalType === "bulkAdd" ?
            `Bulk data uploaded successfully!`
            : `Employee ${modalType}d successfully!`
        }
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
      <EmployeeReportModal
        isOpen={isModalOpen}
        onClose={closeModal}
        rowData={selectedRow}
      />
      <div className="table-header employee-table-new">
        <form className="form" id="employee-form" onSubmit={(e) => e.preventDefault()}>
          <button type="submit">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="search"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any query..."
            className="input"
            type="text"
          />
          <button
            className="reset"
            type="button"
            onClick={() => setSearchQuery("")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>

        <div className="tabs card-table-toggle">
          <button
            onClick={() => {
              setIsTableView(true)
              setShowBulkUpload(false);
              setIsCardView(false)
            }}
            className={`table-view-123 toggle-button ${isTableView && !isCardView ? "active" : ""}`}
            data-tip="Table View"
            data-for="tableViewTooltip"
          >
            <FaTable className="table-view" />
          </button>
          <Tooltip anchorSelect=".table-view-123" id="tableViewTooltip" place="bottom" effect="solid">Table View</Tooltip>

          <button
            onClick={() => {
              setIsTableView(false)
              setShowBulkUpload(false);
              setIsCardView(true)
            }}
            className={`card-view-123 toggle-button ${!isTableView && isCardView ? "active" : ""}`}
            data-tip="Card View"
            data-for="cardViewTooltip"
          >
            <FaThLarge className="table-view" />
          </button>
          <Tooltip anchorSelect=".card-view-123" id="cardViewTooltip" place="bottom" effect="solid">Card View</Tooltip>
        </div>

        <div className="add-delete-conainer add-delete-emp">
          <button className="add-button" onClick={handleAdd}>
            <FaPlus className="add-icon" /> Add New Employee
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
          <button className="add-button" onClick={handleBulkAdd}>
            <FaPlus className="add-icon" /> Bulk Add
          </button>
        </div>
      </div>


      <div className="departments-table">
        {showBulkUpload && !isTableView && !isCardView ? (
          <BulkUploadModal
            onClose={handleBulkUploadClose}
            onSave={handleSaveFromModal}
          />
        ) : isTableView && !isCardView && !showBulkUpload ? (

          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    id="delete-checkbox"
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </th>
                {/* <th>Serial No</th> */}
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Enroll Site</th>
                <th>Shift</th>
                <th>Salary Type</th>
                <th>Contact No</th>
                <th>Basic Salary</th>
                <th>Account No</th>
                <th>Bank Name</th>
                <th>Identity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((row, index) => (

                <tr key={row.empId}>
                  <td>
                    <input
                      type="checkbox"
                      id="delete-checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={(event) => handleRowCheckboxChange(event, row.id)}
                    />
                  </td>
                  {/* <td>{index + 1 + currentPage * rowsPerPage}</td> */}
                  <td>{row.empId}</td>
                  <td className="bold-fonts">
                    {row.fName} {row.lName}
                  </td>
                  <td>{row.department}</td>
                  <td className="accessible-items">
                    {Array.isArray(row.enrollSite) && row.enrollSite.length > 0
                      ? row.enrollSite.map((loc, index) => (
                        <span key={index} style={{ marginRight: "5px" }}>
                          {loc}
                        </span>
                      ))
                      : "No Locaion"}
                  </td>
                  {/* <td>{row.enrollSite}</td> */}
                  <td>{row.shift}</td>
                  <td>{row.salaryType}</td>
                  <td>{row.contactNo}</td>
                  <td>{row.basicSalary}</td>
                  <td>{row.accountNo}</td>
                  <td>{row.bankName}</td>
                  <td className="empImage">
                    <img
                      src={
                        row.image1
                          ? `${SERVER_URL}${row.image1}?${new Date().getTime()}` // Add timestamp to prevent caching
                          : Default_picture
                      }
                      alt={row.employeeName}
                      className="employee-image"
                    />
                  </td>
                  <td>
                    <div className="icons-box">
                      <button
                        onClick={() => handleEdit(row)}
                        style={{ background: "none", border: "none" }}
                      >
                        <FaEdit className="table-edit" />
                      </button>
                      {/* {isActiveTab === "Add Employee" &&(
                      <AddEmployee editData={editData} isEditMode={isEditMode} />
                      )} */}
                      <button
                        onClick={() => handleDelete(row.id)}
                        style={{ background: "none", border: "none" }}
                      >
                        <FaTrash className="table-delete" />
                      </button>
                      <button
                        onClick={() => handleGenerateReport(row)}
                        style={{ background: "none", border: "none" }}
                      >
                        <FaFileAlt className="report-selector-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : !isTableView && isCardView && !showBulkUpload ? (
          <div className="employee-cards">
            <div className="card-employee card-header" >
              <div className="card-body image-name">
                <p>Employee Info</p>
              </div>
              <div className="card-body">
                <p>Shift</p>
              </div>
              <div className="card-body">
                <p>Payroll Info</p>
              </div>
              <div className="card-body">
                <p>Location</p>
              </div>
              <div className="card-body">
              </div>
            </div>
            {currentPageData.map((row) => (
              <>

                <div className="card-employee" key={row.empId}>
                  <div className={`card-body empImage ${window.innerWidth <= 700 ? '' : 'image-name'}`}>
                    <img
                      src={row.image1 ? `${SERVER_URL}${row.image1}` : Default_picture}
                      alt={row.employeeName}
                      className="employee-image"
                    />
                    <div>
                      <p>{row.empId}</p>
                      <h3>{row.fName} {row.lName}</h3>
                      <p>{row.department} / {row.designation}</p>
                    </div>
                  </div>
                  <div className="card-body">
                    <p>{row.shift}</p>
                  </div>
                  <div className="card-body">
                    <p>{row.salaryType} / {row.salaryPeriod} / Rs. {row.basicSalary}</p>
                  </div>
                  <div className="card-body">
                    <p className="accessible-items">
                      {Array.isArray(row.enrollSite) && row.enrollSite.length > 0
                        ? row.enrollSite.map((loc, index) => (
                          <span key={index} style={{ marginRight: "5px" }}>
                            {loc}
                          </span>
                        ))
                        : "No Locaion"}

                    </p>
                  </div>
                  <div className="card-body icons-box">
                    <button
                      onClick={() => handleEdit(row)}
                      style={{ background: "none", border: "none" }}
                    >
                      <FaEdit className="table-edit" />
                    </button>
                    {/* {isActiveTab === "Add Employee" &&(
                      <AddEmployee editData={editData} isEditMode={isEditMode} />
                      )} */}
                    <button
                      onClick={() => handleDelete(row.id)}
                      style={{ background: "none", border: "none" }}
                    >
                      <FaTrash className="table-delete" />
                    </button>

                  </div>

                </div>
              </>
            ))}
          </div>
        ) : ""}
      </div>
      <div className="pagination">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredData.length / rowsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default React.memo(EmployeeTable);;
