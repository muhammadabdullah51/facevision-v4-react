import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaFileAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./employees.css";
import EmployeeReportModal from "./EmployeeReportModal";
import Default_picture from '../../../assets/profile.jpg';

const EmployeeTable = ({ data, setData, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: null,
    employeeName: "",
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
  const rowsPerPage = 10;

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

  // Handle Edit
  const handleEdit = (row) => {
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
  };

  // Handle Delete
  const handleDelete = (row) => {
    setData((prevData) =>
      prevData.filter((item) => item.employeeId !== row.employeeId)
    );
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
        <form className="form">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="input"
            required
            type="text"
          />
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
                <td className="bold-fonts">{row.employeeName}</td>
                <td>{row.department}</td>
                <td>{row.enrollSite}</td>
                <td>{row.salaryType}</td>
                <td>{row.contactNo}</td>
                <td>{row.basicSalary}</td>
                <td>{row.accountNo}</td>
                <td>{row.bankName}</td>
                <td className="empImage">
                  <img
                    src={row.picture}
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
                      onClick={() => handleDelete(row)}
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
