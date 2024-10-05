import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaFileAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./employees.css";
import EmployeeReportModal from "./EmployeeReportModal";
import Default_picture from '../../../assets/profile.jpg';
import axios from "axios";

const EmployeeTable = ({ data, setData, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: null,
    employeeName: "",
    firstName: "",
    lastName: "",
    department: "",
    enrollSite: "",
    salaryType: "",
    contactNo: "",
    basicSalary: "",
    accountNo: "",
    bankName: "",
    image: "",
  });

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null); 
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fetchEmployees");
      if (response.ok) {
        const employees = await response.json();
        setData(employees);
      } else {
        throw new Error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees data:", error);
    }
  };

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);



  // Handle Edit
  const handleEdit = async (row) => {
    setFormData({
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        department: row.department,
        enrollSite: row.enrollSite,
        salaryType: row.salaryType,
        contactNo: row.contactNo,
        basicSalary: row.basicSalary,
        accountNo: row.accountNo,
        bankName: row.bankName,
        picture: row.picture,
    });

    // Update Employee API call
    try {
        await axios.put(`http://localhost:5000/api/employees/${row.employeeId}`, formData);
        setData((prevData) =>
            prevData.map((employee) =>
                employee.employeeId === row.employeeId ? { ...row, ...formData } : employee
            )
        );
    } catch (error) {
        console.error("Error updating employee data:", error);
    }
};

  // Handle Delete
//   const handleDelete = async (row) => {
//     try {
//         await axios.delete(`http://localhost:5000/api/employees/${row.employeeId}`);
//         setData(prevData => prevData.filter(item => item.employeeId !== row.employeeId));  
//     } catch (error) {
//         console.error("Error deleting employee:", error);
//     }
// };
const handleDelete = async (id) => {
  try {
    axios.post(`http://localhost:5000/api/deleteEmployees`, { id });
    console.log(`Department deleted ID: ${id}`);
    const updatedData = await axios.get('http://localhost:5000/api/fetchEmployees');
    setData(updatedData.data)
    fetchEmployees();
  } catch (error) {
    console.error("Error deleting department:", error);
  }
};

  const handleAdd = () => {
    setActiveTab("Add Employee"); // Update the activeTab state from parent
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
    <div className="employee-table">
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
            placeholder="Search..."
            className="input"
            type="text"
          />
          <button
            className="reset"
            type="button" // Change to type="button" to prevent form reset
            onClick={() => setSearchQuery("")} // Clear the input on click
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
              <tr key={row.employeeId}>
                <td>{index + 1 + currentPage * rowsPerPage}</td>
                <td>{row.employeeId}</td>
                <td className="bold-fonts">{row.firstName} {row.lastName}</td>
                <td>{row.department}</td>
                <td>{row.enrollSite}</td>
                <td>{row.salaryType}</td>
                <td>{row.contactNo}</td>
                <td>{row.basicSalary}</td>
                <td>{row.accountNo}</td>
                <td>{row.bankName}</td>
                <td className="empImage">
                  <img
                    src={row.picture ? `http://localhost:5000/${row.picture.replace(/\\/g, "/")}` : Default_picture} 
                    alt={row.employeeName}
                    className="employee-image"
                  />
                </td>
                <td>
                  <div>
                    <button
                      onClick={() => handleEdit(row)}
                      style={{ background: "none", border: "none" }}
                    >
                      <FaEdit className="table-edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(row._id)}
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
