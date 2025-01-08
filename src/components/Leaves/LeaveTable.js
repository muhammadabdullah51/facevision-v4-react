import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./leaves.css";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";

const LeaveTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const leaveTypes = ["Sick Leave", "Vacation", "Personal Leave"];
  const statuses = ["Pending", "Approved", "Rejected", "Cancelled"];

  const [formData, setFormData] = useState({
    id: null,
    employee: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    status: "Pending",
    created_at: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchLeave = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}att-lv-cr/`);
      setData(response.data);
    } catch (error) {
    }
  }, [setData]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      setEmployees(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchLeave();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchLeave, successModal]);

  const handleStatusToggle = useCallback(() => {
    setFormData((prevState) => ({
      ...prevState,
      status: prevState.status === "Approved" ? "Pending" : "Approved",
    }));
  }, []);






  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [data, searchQuery]
  );

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = filteredData.map((row) => row.id);
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
        // Add the row ID to selected IDs
        return [...prevSelectedIds, rowId];
      } else {
        // Remove the row ID from selected IDs
        const updatedIds = prevSelectedIds.filter((id) => id !== rowId);
        if (updatedIds.length !== filteredData.length) {
          setSelectAll(false); // Uncheck "Select All" if a row is deselected
        }
        return updatedIds;
      }
    });
    console.log(selectedIds);
  };
  useEffect(() => {
    if (selectedIds.length === filteredData.length && filteredData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedIds, filteredData]);


  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setModalType("delete selected");
      setShowModal(true);
    } else if (selectedIds.length < 1) {
      setResMsg("No rows selected for deletion.");
      setShowModal(false);
      setWarningModal(true);
    }
  };


  const confirmBulkDelete = async () => {
    try {
      const payload = { ids: selectedIds };
      await axios.post(`${SERVER_URL}leaves/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}att-lv-cr/`);
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


  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            id="delete-checkbox"
            type="checkbox"
            checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
            onChange={handleSelectAllChange} // Function to handle "Select All"
          />
        ),
        Cell: ({ row }) => (
          <input
            id="delete-checkbox"
            type="checkbox"
            checked={selectedIds.includes(row.original.id)} // Unique identifier (id)
            onChange={(event) => handleRowCheckboxChange(event, row.original.id)} // Row selection handler
          />
        ),
        id: "selection",
      },
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Employee Name",
        accessor: "empName",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Leave Type",
        accessor: "leave_type",
      },
      {
        Header: "Start Date",
        accessor: "start_date",
      },
      {
        Header: "End Date",
        accessor: "end_date",
      },
      {
        Header: "Reason",
        accessor: "reason",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status ${value === "Approved" || value === "Cancelled"
                ? "approvedStatus"
                : value === "Pending"
                  ? "lateStatus"
                  : "absentStatus"
              }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => {
          const date = new Date(value); // Convert the ISO string to a Date object
          const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so add 1)
          const year = date.getFullYear(); // Get year
          const hours = String(date.getHours()).padStart(2, "0"); // Get hours and pad with leading zero if needed
          const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad
          const seconds = String(date.getSeconds()).padStart(2, "0"); // Get seconds and pad

          // Return formatted date and time as "dd-mm-yyyy hh:mm:ss"
          return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        },
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
    [filteredData, selectedIds] // Re-render when filteredData or selectedIds changes
  );









  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    gotoPage,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      empName: row.empName,
      leave_type: row.leave_type,
      start_date: row.start_date,
      end_date: row.end_date,
      reason: row.reason,
      status: row.status,
    });

    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    setModalType("update");
    setFormData({ ...formData });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (
      formData.employee === "" ||
      formData.leave_type === "" ||
      formData.start_date === "" ||
      formData.end_date === "" ||
      formData.reason === "" ||
      formData.status === "" ||
      formData.created_at === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const leavePayload = {
      id: formData.id,
      leave_type: formData.leave_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: formData.reason,
      status: formData.status,
    };
    try {
      await axios.post(`${SERVER_URL}att-lv-up/`, leavePayload);
      const updatedData = await axios.get(`${SERVER_URL}att-lv-cr/`);
      setData(updatedData.data);
      fetchLeave();
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleDelete = async (row) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ id: row.id });
  };

  const confirmDelete = async () => {
    await axios.post(`${SERVER_URL}att-lv-del/`, {
      id: formData.id,
    });
    const updatedData = await axios.get(`${SERVER_URL}att-lv-cr/`);
    setData(updatedData.data);
    fetchLeave();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    setFormData({
      employee: "",
      leave_type: "",
      start_date: "",
      end_date: "",
      reason: "",
      status: "Pending",
      created_at: new Date().toISOString().split("T")[0],
    });

    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addLeave = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.employee === "" ||
      formData.leave_type === "" ||
      formData.start_date === "" ||
      formData.end_date === "" ||
      formData.reason === "" ||
      formData.status === "" ||
      formData.created_at === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const leavePayload = {
      employee: formData.employee,
      leave_type: formData.leave_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: formData.reason,
      status: formData.status,
      created_at: formData.created_at,
    };
    try {
      await axios.post(`${SERVER_URL}att-lv-cr/`, leavePayload);
      const updatedData = await axios.get(`${SERVER_URL}att-lv-cr/`);
      setData(updatedData.data);
      fetchLeave();
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Leave?`
        }
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
          else if (modalType === "update") confirmUpdate();
          else if (modalType === "delete selected") confirmBulkDelete();
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
            : `Leave ${modalType}d successfully!`
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
        <div className="add-delete-conainer" >
          <button className="add-button" onClick={handleAdd}>
            <FaPlus className="add-icon" /> Add New Leave
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {/* Add Leave Form */}
      {showAddForm && !showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Add New Leave</h3>
          <label>Select Employee</label>
          <input
            list="employeesList"
            value={
              employees.find((emp) => emp.empId === formData.employee)
                ? `${employees.find((emp) => emp.empId === formData.employee)
                  .empId
                } ${employees.find((emp) => emp.empId === formData.employee)
                  .fName
                } ${employees.find((emp) => emp.empId === formData.employee)
                  .lName
                }`
                : formData.employee || "" // Display empId, fName, and lName if employee is found or allow typing
            }
            onChange={(e) => {
              const value = e.target.value;

              // If the input is a valid match for employee full name, find the employee
              const selectedEmployee = employees.find(
                (emp) => `${emp.empId} ${emp.fName} ${emp.lName}` === value
              );

              // Set the form data
              setFormData({
                ...formData,
                // If a valid employee is selected, store empId, otherwise keep the current input (for free typing)
                employee: selectedEmployee ? selectedEmployee.empId : value,
              });
            }}
            placeholder="Search or select an employee"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              // Display employee's full name in datalist options
              <option
                key={emp.empId}
                value={`${emp.empId} ${emp.fName} ${emp.lName}`}
              />
            ))}
          </datalist>

          <label>Leave Type</label>
          <select
            value={formData.leave_type}
            onChange={(e) =>
              setFormData({ ...formData, leave_type: e.target.value })
            }
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label>Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
          <label>End Date</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />
          <label>Reason</label>
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button className="submit-button" onClick={addLeave}>
            Add Leave
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowAddForm(false);
              setShowEditForm(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Edit Leave</h3>
          <label>Selected Employee</label>
          <input
            type="text"
            value={formData.empName}
            disabled
            onChange={(e) =>
              setFormData({ ...formData, empName: e.target.value })
            }
          />
          <label>Leave Type</label>
          <select
            value={formData.leave_type}
            onChange={(e) =>
              setFormData({ ...formData, leave_type: e.target.value })
            }
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label>Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
          <label>End Date</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />

          <label>Reason</label>
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            className="submit-button"
            onClick={() => handleUpdate(formData)}
          >
            Update Leave
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowAddForm(false);
              setShowEditForm(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="departments-table">
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
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

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageOptions.length}
        onPageChange={({ selected }) => gotoPage(selected)}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default LeaveTable;
