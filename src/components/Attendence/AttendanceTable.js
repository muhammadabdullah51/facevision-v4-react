import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import ReactPaginate from "react-paginate";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./attendence.css";
import { SERVER_URL } from "../../config";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";

import { useDispatch, useSelector } from "react-redux";
import { setAttendanceData, resetAttendanceData } from "../../redux/attendanceSlice";

const AttendanceTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);

  const dispatch = useDispatch();
  const savedFormState = useSelector((state) => {
    // console.log('Redux state:', state.attendance.formStates.attendance);
    return state.attendance.formStates.attendance || {};
  });
  // console.log('savedFormState', savedFormState);

  const [formData, setFormData] = useState(
    savedFormState || {
      allAttendanceId: null,
      empId: "",
      employee: "",
      time_in: "",
      time_out: "",
      date: "",
      attendance_marked: false,
      status: "Absent",
      location: "",
    });
  const [editFormData, setEditFormData] = useState({
    allAttendanceId: null,
    empId: "",
    employee: "",
    time_in: "",
    time_out: "",
    date: "",
    attendance_marked: false,
    status: "Absent",
    location: "",
  });

  useEffect(() => {
    dispatch(setAttendanceData({ formName: "attendance", data: formData }));
  }, [formData, dispatch]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchAtt = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}all-attendance/`);
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
  const fetchloc = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-loc/`);
      const location = response.data.context;
      setLocations(location);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchAtt();
    fetchEmployees();
    fetchloc();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchAtt, successModal]);






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
      const allIds = filteredData.map((row) => row.allAttendanceId);
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
      const response = await axios.post(`${SERVER_URL}allatt/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}all-attendance/`);
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
            checked={selectedIds.includes(row.original.allAttendanceId)} // Use an appropriate unique field for row identification (e.g., allAttendanceId)
            onChange={(event) => handleRowCheckboxChange(event, row.original.allAttendanceId)} // Row selection handler
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
        Header: "Employee ID",
        accessor: "employeeId",
      },
      {
        Header: "Employee Name",
        Cell: ({ row }) => (
          <span className="bold-fonts">
            {row.original.emp_fName} {row.original.emp_lName}
          </span>
        ),
      },
      {
        Header: "Time In",
        accessor: "time_in",
      },
      {
        Header: "Time Out",
        accessor: "time_out",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Attendance Marked",
        accessor: "attendance_marked",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status ${value === "Present"
                ? "presentStatus"
                : value === "Late"
                  ? "lateStatus"
                  : value === "Absent"
                    ? "absentStatus"
                    : "none"
              }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Location",
        accessor: "locName",
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
    [filteredData, selectedIds] // Ensure the columns are updated when the filteredData or selectedIds change
  );


  // Set up the table
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
    setEditFormData({
      allAttendanceId: row.allAttendanceId,
      empId: row.empId,
      time_in: row.time_in,
      time_out: row.time_out,
      date: row.date,
      attendance_marked: row.attendance_marked,
      status: row.status,
      location: row.location,
      emp_fName: row.emp_fName,
      emp_lName: row.emp_lName,
      employeeId: row.employeeId
    });

    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    setModalType("update");
    setFormData({ ...editFormData });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (!editFormData.empId ||
      !editFormData.date ||
      // !editFormData.time_in ||
      // !editFormData.time_out ||
      !editFormData.date ||
      !editFormData.attendance_marked ||
      !editFormData.location ||
      !editFormData.status) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const attPayload = {
      allAttendanceId: editFormData.allAttendanceId,
      empId: editFormData.empId,
      time_in: formatTime(editFormData.time_in) || "",
      time_out: formatTime(editFormData.time_out),
      date: editFormData.date,
      attendance_marked: editFormData.attendance_marked,
      status: editFormData.status,
      location: editFormData.location,
    };
    try {
      const res = await axios.post(`${SERVER_URL}all-attendance/`, attPayload);
      const updatedData = await axios.get(`${SERVER_URL}all-attendance/`);
      setData(updatedData.data);
      fetchAtt();
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
    setFormData({
      empId: "",
      time_in: "",
      time_out: "",
      date: "",
      attendance_marked: "by Admin",
      status: "",
      location: "",
    });
    setEditFormData({
      empId: "",
      time_in: "",
      time_out: "",
      date: "",
      attendance_marked: "by Admin",
      status: "",
      location: "",
    });
  };

  const handleDelete = async (row) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ allAttendanceId: row.allAttendanceId });
  };

  const confirmDelete = async () => {
    const response = await axios.post(`${SERVER_URL}del-att/`, {
      allAttendanceId: formData.allAttendanceId,
    });
    const updatedData = await axios.get(`${SERVER_URL}all-attendance/`);
    setData(updatedData.data);
    fetchAtt();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    // setFormData({
    //   empId: "",
    //   time_in: "",
    //   time_out: "",
    //   date: "",
    //   attendance_marked: "by Admin",
    //   status: "",
    //   location: "",
    // });

    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addAtt = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      !formData.empId ||
      // !formData.time_in ||
      // !formData.time_out ||
      !formData.date ||
      !formData.status
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const payload = {
      empId: formData.empId,
      time_in: formatTime(formData.time_in),
      time_out: formatTime(formData.time_out),
      date: formData.date,
      attendance_marked: "by Admin",
      status: formData.status,
      location: formData.location,
    };
    try {
      await axios.post(`${SERVER_URL}manual-att/`, payload);
      const updatedData = await axios.get(`${SERVER_URL}all-attendance/`);
      setData(updatedData.data);
      fetchAtt();
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
    setFormData({
      empId: "",
      time_in: "",
      time_out: "",
      date: "",
      attendance_marked: "by Admin",
      status: "",
      location: "",
    });
    setEditFormData({
      empId: "",
      time_in: "",
      time_out: "",
      date: "",
      attendance_marked: "by Admin",
      status: "",
      location: "",
    });
  };

  const formatTime = (time) => {
    // If time already includes seconds, return as is.
    if (time.split(':').length === 3) return time;

    // Otherwise, append ":00" for seconds.
    return `${time}:00`;
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Manual Attendance?`
        }
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
          else if (modalType === "delete selected") confirmBulkDelete();
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
        message={
          modalType === "delete selected"
            ? "Selected items deleted successfully!"
            : `Attendance ${modalType}d successfully!`
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
            <FaPlus className="add-icon" /> Add Manual Attendance
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>


      {showAddForm && !showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Add Manual Attendance</h3>
          <label>Select Employee</label>
          <input
            type="text"
            list="employeesList" // Link to the datalist by id
            placeholder="Search or select an employee"
            value={
              employees.find((emp) => emp.empId === formData.empId)
                ? `${formData.empId} ${employees.find((emp) => emp.empId === formData.empId).fName
                } ${employees.find((emp) => emp.empId === formData.empId).lName
                }`
                : formData.empId || "" // Display empId, fName, and lName of the selected employee or user input
            }
            onChange={(e) => {
              const value = e.target.value;

              // Split the value to extract empId if input contains more than empId
              const selectedEmpId = value.split(" ")[0]; // Take the first part as empId
              const selectedEmployee = employees.find(
                (emp) => emp.empId === selectedEmpId
              );

              setFormData({
                ...formData,
                empId: selectedEmployee ? selectedEmployee.empId : value, // Update empId if matched, otherwise store raw input
              });
            }}
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option
                key={emp.empId}
                value={`${emp.empId} ${emp.fName} ${emp.lName}`} // Format: empId fName lName
              />
            ))}
          </datalist>

          <div className="form-time">
            <div>
              <label>Time In</label>
              <input
                type="time"
                placeholder="Time In"
                value={formData.time_in}
                onChange={(e) =>
                  setFormData({ ...formData, time_in: e.target.value })
                }
              />
            </div>
            <div>
              <label>Time Out</label>
              <input
                type="time"
                placeholder="Time Out"
                value={formData.time_out}
                onChange={(e) =>
                  setFormData({ ...formData, time_out: e.target.value })
                }
              />
            </div>
          </div>

          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <label>Select Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option>Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>

          <label>Select Location</label>
          <select
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.locId} value={loc.locId}>
                {loc.name}
              </option>
            ))}
          </select>
          <button className="submit-button" onClick={addAtt}>
            Add Attendance
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowAddForm(false);
              setShowEditForm(false);
              setFormData({
                empId: "",
                time_in: "",
                time_out: "",
                date: "",
                attendance_marked: "by Admin",
                status: "",
                location: "",
              });
              setEditFormData({
                empId: "",
                time_in: "",
                time_out: "",
                date: "",
                attendance_marked: "by Admin",
                status: "",
                location: "",
              });
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Edit Manual Attendance</h3>
          <label>Selected Employee</label>


          <datalist id="employeesList">
            {employees.map((emp) => (
              <option
                key={emp.empId}
                value={`${emp.empId} ${emp.fName} ${emp.lName}`} // Format: empId fName lName
              />
            ))}
          </datalist>

          <input
            type="text"
            disabled
            value={editFormData.employeeId}
          />
          <input
            type="text"
            disabled
            value={editFormData.emp_fName}
          />
          <input
            type="text"
            disabled
            value={editFormData.emp_lName}
          />


          <div className="form-time">
            <div>
              <label>Time In</label>
              <input
                type="time"
                placeholder="Time In"
                value={editFormData.time_in}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, time_in: e.target.value })
                }
              />
            </div>
            <div>
              <label>Time Out</label>
              <input
                type="time"
                placeholder="Time Out"
                value={editFormData.time_out}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, time_out: e.target.value })
                }
              />
            </div>
          </div>

          <label>Date</label>
          <input
            type="date"
            value={editFormData.date}
            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
          />
          <label>Mark Attandance</label>
          <select
            disabled
            value={editFormData.attendance_marked}
            onChange={(e) =>
              setEditFormData({ ...editFormData, attendance_marked: e.target.value })
            }
          >
            <option value="by Admin">{editFormData.attendance_marked}</option>
          </select>

          <label>Select Status</label>
          <select
            value={editFormData.status}
            onChange={(e) =>
              setEditFormData({ ...editFormData, status: e.target.value })
            }
          >
            <option>Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>

          <label>Select Location</label>
          <select
            value={editFormData.location}
            onChange={(e) =>
              setEditFormData({ ...editFormData, location: e.target.value })
            }
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.locId} value={loc.locId}>
                {loc.name}
              </option>
            ))}
          </select>

          <button
            className="submit-button"
            onClick={() => handleUpdate(editFormData)}
          >
            Update Attendance
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowAddForm(false);
              setShowEditForm(false);
              setFormData({
                empId: "",
                time_in: "",
                time_out: "",
                date: "",
                attendance_marked: "by Admin",
                status: "",
                location: "",
              });
              setEditFormData({
                empId: "",
                time_in: "",
                time_out: "",
                date: "",
                attendance_marked: "by Admin",
                status: "",
                location: "",
              });

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

      <div className="pagination">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageOptions.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => gotoPage(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default AttendanceTable;
