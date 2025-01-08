import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";

import { useDispatch, useSelector } from "react-redux";
import { setblocklistData, resetblocklistData } from "../../redux/blocklistSlice";

const BlockListTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]);

  const dispatch = useDispatch();
  const blicklistData = useSelector((state) => state.blocklist);

  const [formData, setFormData] = useState(
    blicklistData || {
    blockId: "",
    empId: "",
    blockDate: "",
    blockReason: "",
    allowAttendance: false,
    allowReason: "",
    status: "Blocked",
  });

  const handleReset = () => {
    dispatch(resetblocklistData());
    setFormData({
      blockId: "",
      empId: "",
      blockDate: "",
      blockReason: "",
      allowAttendance: false,
      allowReason: "",
      status: "Blocked",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    blockId: "",
    empId: "",
    blockDate: "",
    blockReason: "",
    allowAttendance: false,
    allowReason: "",
    status: "Blocked",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setblocklistData(updatedFormData));
      return updatedFormData;
    });
  };



  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchBlock = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}blocklist/`);
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
      const allIds = filteredData.map((row) => row.blockId);
      setSelectedIds(allIds);
      console.log(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowCheckboxChange = (event, rowId) => {
    const isChecked = event.target.checked;
    console.log(rowId);

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
      await axios.post(`${SERVER_URL}blocklist/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}blocklist/`);
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
            type="checkbox"
            id="delete-checkbox"
            checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
            onChange={handleSelectAllChange}
          />
        ),
        Cell: ({ row }) => (
          <input
            type="checkbox"
            id={`delete-checkbox`}
            checked={selectedIds.includes(row.original.blockId)}
            onChange={(event) => handleRowCheckboxChange(event, row.original.blockId)}
          />
        ),
        id: "selection",
      },
      { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
      { Header: "Employee ID", accessor: "employeeId" },
      {
        Header: "Employee Name",
        accessor: "fullName",
        Cell: ({ row }) => (
          <span className="bold-fonts">
            {row.original.fName} {row.original.lName}
          </span>
        ),
      },
      { Header: "Block Date", accessor: "blockDate" },
      { Header: "Block Reason", accessor: "blockReason" },
      {
        Header: "Allow Attendance",
        accessor: "allowAttendance",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      { Header: "Allow Reason", accessor: "allowReason" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status ${value === "Active" ? "approvedStatus" : "pendingStatus"
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
    [filteredData, selectedIds] // Dependencies
  );




  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    useTable(
      { columns, data: filteredData, initialState: { pageIndex: 0 } },
      usePagination,
      useRowSelect
    );

  const handleEdit = (row) => {
    setEditFormData({
      ...row,
      allowAttendance: row.allowAttendance || false,
      blockDate: row.blockDate ? row.blockDate.slice(0, 10) : "",
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (
      editFormData.empId === "" ||
      editFormData.blockDate === "" ||
      editFormData.blockReason === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updateBlock = {
      blockId: editFormData.blockId,
      empId: editFormData.empId,
      blockDate: editFormData.blockDate,
      blockReason: editFormData.blockReason,
      allowAttendance: editFormData.allowAttendance,
      allowReason: editFormData.allowReason,
      status: editFormData.status,
    };

    try {
      await axios.put(
        `${SERVER_URL}blocklist/${editFormData.blockId}/`,
        updateBlock
      );
      fetchBlock(); // Fetch the updated locations
      setShowEditForm(false); // Close the edit form
      setShowModal(false); // Close the confirmation modal
      setSuccessModal(true); // Show the success modal
      handleReset()
    } catch (error) {
    }
  };

  const handleDelete = async (blockId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData(blockId);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}blocklist/${formData.blockId}/`);
      fetchBlock();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addBlock = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.empId === "" ||
      formData.blockDate === "" ||
      formData.blockReason === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    try {
      await axios.post(`${SERVER_URL}blocklist/`, formData);
      const updatedData = await axios.get(`${SERVER_URL}blocklist/`);
      setData(updatedData.data);
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
      fetchBlock();
      handleReset()
    } catch (error) {
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
        <button className="add-button" onClick={handleAdd}>
          <FaPlus className="add-icon" /> Block New Employee
        </button>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Add Blocked Employee</h3>
          <label>Select Employee</label>
          <input
            list="employeesList"
            value={
              employees.find((emp) => emp.id === formData.empId)
                ? `${employees.find((emp) => emp.id === formData.empId).empId
                } ${employees.find((emp) => emp.id === formData.empId).fName
                } ${employees.find((emp) => emp.id === formData.empId).lName}`
                : formData.empId || "" // Display empId, fName, and lName if employee is found or allow typing
            }
            onChange={(e) => {
              const value = e.target.value;

              const selectedEmployee = employees.find(
                (emp) => `${emp.empId} ${emp.fName} ${emp.lName}` === value
              );

              setFormData({
                ...formData,
                empId: selectedEmployee ? selectedEmployee.id : value,
              });
            }}
            placeholder="Search or select an employee"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option
                key={emp.id}
                value={`${emp.empId} ${emp.fName} ${emp.lName}`}
              />
            ))}
          </datalist>
          <label>Date</label>

          <input
            type="date"
            name="blockDate"
            placeholder="Block Date"
            value={formData.blockDate}
            onChange={handleInputChange}
          />
          <label>Block Reason</label>

          <input
            type="text"
            name="blockReason"
            placeholder="Block Reason"
            value={formData.blockReason}
            onChange={handleInputChange}
          />
          <label>Allow Attendance</label>
          <select
            name="allowAttendance"
            value={formData.allowAttendance}
            onChange={handleInputChange}
          >
            <option value="">Allow Attendance?</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>

          {formData.allowAttendance && (
            <>
              <label htmlFor="allowReason">Allow Reason</label>
              <input
                type="text"
                name="allowReason"
                id="allowReason"
                placeholder="Allow Reason"
                value={formData.allowReason}
                onChange={handleInputChange}
              />
            </>
          )}
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Blocked">Blocked</option>
            <option value="Active">Active</option>
          </select>
          <button className="submit-button" onClick={addBlock}>Add Employee</button>
          <button className="cancel-button"
            onClick={handleReset}
          >
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Edit Blocked Employee</h3>
          <label>Selected Employee</label>
          <input
            list="employeesList"
            disabled
            value={
              employees.find((emp) => emp.id === editFormData.empId)
                ? `${employees.find((emp) => emp.id === editFormData.empId).empId
                } ${employees.find((emp) => emp.id === editFormData.empId).fName
                } ${employees.find((emp) => emp.id === editFormData.empId).lName}`
                : editFormData.empId || "" // Display empId, fName, and lName if employee is found or allow typing
            }
            onChange={(e) => {
              const value = e.target.value;

              // If the input is a valid match for employee full name, find the employee
              const selectedEmployee = employees.find(
                (emp) => `${emp.empId} ${emp.fName} ${emp.lName}` === value
              );

              // Set the form data
              setEditFormData({
                ...editFormData,
                // If a valid employee is selected, store id, otherwise keep the current input (for free typing)
                empId: selectedEmployee ? selectedEmployee.id : value,
              });
            }}
            placeholder="Search or select an employee"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              // Display employee's full name in datalist options
              <option
                key={emp.id}
                value={`${emp.empId} ${emp.fName} ${emp.lName}`}
              />
            ))}
          </datalist>
          <label>Date</label>

          <input
            type="date"
            placeholder="Block Date"
            value={editFormData.blockDate}
            onChange={(e) =>
              setEditFormData({ ...editFormData, blockDate: e.target.value })
            }
          />
          <label>Block Reason</label>

          <input
            type="text"
            placeholder="Block Reason"
            value={editFormData.blockReason}
            onChange={(e) =>
              setEditFormData({ ...editFormData, blockReason: e.target.value })
            }
          />
          <label>Allow Attendance</label>
          <select
            value={editFormData.allowAttendance}
            onChange={(e) =>
              setEditFormData({ ...editFormData, allowAttendance: e.target.value })
            }
          >
            <option value="">Allow Attendance?</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>

          {editFormData.allowAttendance && (
            <>
              <label htmlFor="allowReason">Allow Reason</label>
              <input
                type="text"
                id="allowReason"
                placeholder="Allow Reason"
                value={editFormData.allowReason}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, allowReason: e.target.value })
                }
              />
            </>
          )}
          <label>Status</label>
          <select
            value={editFormData.status}
            onChange={(e) =>
              setEditFormData({ ...editFormData, status: e.target.value })
            }
          >
            <option value="Blocked">Blocked</option>
            <option value="Active">Active</option>
          </select>
          <button
            className="submit-button"
            onClick={() => handleUpdate(editFormData)}
          >Update Employee
          </button>
          <button className="cancel-button" onClick={handleReset}>
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
    </div>
  );
};

export default BlockListTable;