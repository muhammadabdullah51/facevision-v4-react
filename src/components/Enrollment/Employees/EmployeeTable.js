import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaFileAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./employees.css";
import EmployeeReportModal from "./EmployeeReportModal";
import Default_picture from "../../../assets/profile.jpg";
import axios from "axios";
import TableComponent from "../Department/departmentTable";
import DesignationTable from "../Designation/designationTable";
import LocationTable from "../Location/LocationTable";
import ResignTable from "../Resign/ResignTable";
import AddEmployee from "./AddEmployee";
import { SERVER_URL } from "../../../config";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";

const EmployeeTable = ({
  // data,
  // setData,
  setActiveTab,
  setSelectedEmployee,
  onEdit,
  onAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isActiveTab, setIsActiveTab] = useState(false);
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

  const [editData, setEditData] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
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
  const handleEdit = (row) => {
    // console.log("selected row for edit",row)
    // setEditData(row)
    // setIsEditMode(true);
    // setIsActiveTab("Add Employee");
    onEdit(row);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const fetchEmployees = useCallback(

    async () => {
      try {
        const response = await axios.get(`${SERVER_URL}pr-emp/`);
        console.log(response.data)
        setData(response.data);
        } catch (error) {
        console.error("Error fetching employees data:", error);
      }
    },[setData]
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

  // working handle delete
  // const handleDelete = async (empId) => {
  //   try {
  //     await axios.post(`${SERVER_URL}pr-emp-del/`, { empId: empId });
  //     console.log(`Employee deleted ID: ${empId}`);
  //     const updatedData = await axios.get(`${SERVER_URL}pr-emp/`);
  //     setData(updatedData.data);
  //     fetchEmployees();
  //   } catch (error) {
  //     console.error("Error deleting department:", error);
  //   }
  // };

  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({...formData, id: id });

  };
  const confirmDelete = async() => {
    
    try {
      await axios.post(`${SERVER_URL}pr-emp-del/`, { id: formData.id });
      console.log(`Employee deleted `);
      const updatedData = await axios.get(`${SERVER_URL}pr-emp/`);
      setData(updatedData.data);
      fetchEmployees();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  }

  const handleAdd = () => {
    onAdd()
    // setIsEditMode(false);
    // setActiveTab("Add Employee"); // Update the activeTab state from parent
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

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this employee?`}
        onConfirm={() =>  confirmDelete()}
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
      <EmployeeReportModal
        isOpen={isModalOpen}
        onClose={closeModal}
        rowData={selectedRow}
      />
      <div className="table-header">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
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
        <button className="add-button" onClick={handleAdd}>
          <FaPlus className="add-icon" /> Add New Employee
        </button>
      </div>
      <div className="departments-table">
        <table className="table">
          <thead>
            <tr>
              <th>Serial No</th>
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
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((row, index) => (
              <tr key={row.empId}>
                <td>{index + 1 + currentPage * rowsPerPage}</td>
                <td>{row.empId}</td>
                <td className="bold-fonts">
                  {row.fName} {row.lName}
                </td>
                <td>{row.department}</td>
                <td>{row.enrollSite}</td>
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
                        ? `${SERVER_URL}${row.image1}`
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

export default EmployeeTable;
