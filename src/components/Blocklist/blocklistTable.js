import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";

const BlockListTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    empId: "",
    employeeName: "",
    blockDate: "",
    blockReason: "",
    allowAttendance: false,
    allowReason: "",
    status: "Blocked",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBlock = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchBlock");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching resign data:", error);
    }
  }, [setData]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetchEmployees"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchBlock();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchBlock, successModal]);

  const columns = useMemo(
    () => [
      { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
      { Header: "Employee ID", accessor: "empId" },
      {
        Header: "Employee Name",
        accessor: "employeeName",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      { Header: "Block Date", accessor: "blockDate" },
      { Header: "Block Reason", accessor: "blockReason" },
      { Header: "Allow Attendance", accessor: "allowAttendance" },
      { Header: "Allow Reason", accessor: "allowReason" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status ${
              value === "Active" ? "approvedStatus" : "pendingStatus"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div>
            <button
              onClick={() => handleEdit(row.original)}
              style={{ background: "none", border: "none" }}
            >
              <FaEdit className="table-edit" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              style={{ background: "none", border: "none" }}
            >
              <FaTrash className="table-delete" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [data, searchQuery]
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    useTable(
      { columns, data: filteredData, initialState: { pageIndex: 0 } },
      usePagination,
      useRowSelect
    );

  const handleEdit = (row) => {
    setFormData({
      ...row,
      allowAttendance: row.allowAttendance || false,
      blockDate: row.blockDate ? row.blockDate.slice(0, 10) : "",
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    setModalType("update");

    setFormData({
      _id: formData._id,
      empId: formData.empId,
      employeeName: formData.employeeName,
      blockDate: formData.blockDate,
      blockReason: formData.blockReason,
      allowAttendance: formData.allowAttendance,
      allowReason: formData.allowReason,
      status: formData.status,
    });
    console.log(formData);
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    const updateBlock = {
      _id: formData._id,
      empId: formData.empId,
      employeeName: formData.employeeName,
      blockDate: formData.blockDate,
      blockReason: formData.blockReason,
      allowAttendance: formData.allowAttendance,
      allowReason: formData.allowReason,
      status: formData.status,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/updateBlock`,
        updateBlock
      );
      console.log(response.data); // Log the response
      fetchBlock(); // Fetch the updated locations
      setShowEditForm(false); // Close the edit form
      setShowModal(false); // Close the confirmation modal
      setSuccessModal(true); // Show the success modal
    } catch (error) {
      console.error("Error updating Block:", error);
    }
  };

  const handleDelete = async (blockId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: blockId });
  };

  const confirmDelete = async () => {
    try {
      const blockId = formData._id;
      await axios.post("http://localhost:5000/api/deleteBlock", { blockId });
      fetchBlock();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };

  const handleAdd = () => {
    setFormData({
      empId: "",
      employeeName: "",
      blockDate: "",
      blockReason: "",
      allowAttendance: false,
      allowReason: "",
      status: "Blocked",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addBlock = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    try {
      // console.log(formData.blockDate);
      await axios.post("http://localhost:5000/api/addBlock", formData);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchBlock"
      );
      setData(updatedData.data);
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
      fetchBlock();
    } catch (error) {
      console.error("Error adding block:", error);
    }
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this to Blocked Employees?`}
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
          else if (modalType === "update") confirmUpdate();
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
        message={`Employee ${modalType}d from Blocklist successfully!`}
        onConfirm={() => setSuccessModal(false)}
        onCancel={() => setSuccessModal(false)}
        animationData={successAnimation}
        successModal={successModal}
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
          <FaPlus className="add-icon" /> Block New Employee
        </button>
      </div>
      {(showAddForm || showEditForm) && (
        <div className="add-department-form add-leave-form">
          <h3>
            {showAddForm ? "Add Blocked Employee" : "Edit Blocked Employee"}
          </h3>
          <select
            value={formData.employeeName}
            onChange={(e) => {
              const selectedEmployee = employees.find(
                (emp) => `${emp.fName} ${emp.lName}` === e.target.value
              );
              setFormData({
                ...formData,
                employeeName: e.target.value,
                empId: selectedEmployee ? selectedEmployee.empId : "",
              });
            }}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Block Date"
            value={formData.blockDate}
            onChange={(e) =>
              setFormData({ ...formData, blockDate: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Block Reason"
            value={formData.blockReason}
            onChange={(e) =>
              setFormData({ ...formData, blockReason: e.target.value })
            }
          />
          <select
            value={formData.allowAttendance}
            onChange={(e) =>
              setFormData({ ...formData, allowAttendance: e.target.value })
            }
          >
            <option value="">Allow Attendance?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input
            type="text"
            placeholder="Allow Reason"
            value={formData.allowReason}
            onChange={(e) =>
              setFormData({ ...formData, allowReason: e.target.value })
            }
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Blocked">Blocked</option>
            <option value="Active">Active</option>
          </select>
          <button
            className="submit-button"
            onClick={showAddForm ? addBlock : handleUpdate}
          >
            {showAddForm ? "Add Employee" : "Update Employee"}
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BlockListTable;
