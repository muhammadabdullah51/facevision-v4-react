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

const AttendanceTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
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

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Employee ID",
        accessor: "employeeId", // Keeps the original field name
      },
      {
        Header: "Employee Name",
        // Combines first name and last name
        Cell: ({ row }) => (
          <span className="bold-fonts">
            {row.original.emp_fName} {row.original.emp_lName}
          </span>
        ),
      },
      {
        Header: "Time In",
        accessor: "time_in", // Keeps the original field name
      },
      {
        Header: "Time Out",
        accessor: "time_out", // Keeps the original field name
      },
      {
        Header: "Date",
        accessor: "date", // Keeps the original field name
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
            className={`status ${
              value === "Present"
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
    []
  );

  // Filter data based on search query
  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [data, searchQuery]
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
    setFormData({
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
    setFormData({ ...formData });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (!formData.empId || 
      !formData.date || 
      // !formData.time_in ||
      // !formData.time_out ||
      !formData.date ||
      !formData.attendance_marked ||
      !formData.location ||
      !formData.status) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const attPayload = {
      allAttendanceId: formData.allAttendanceId,
      empId: formData.empId,
      time_in: formData.time_in || "",
      time_out: formData.time_out,
      date: formData.date,
      attendance_marked: formData.attendance_marked,
      status: formData.status,
      location: formData.location,
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
    setFormData({
      empId: "",
      time_in: "",
      time_out: "",
      date: "",
      attendance_marked: "by Admin",
      status: "",
      location: "",
    });

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
      time_in: formData.time_in,
      time_out: formData.time_out,
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
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this Manual Attendance?`}
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
        message={`Attendance ${modalType}d successfully!`}
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
          <FaPlus className="add-icon" /> Add Manual Attendance
        </button>
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
                ? `${formData.empId} ${
                    employees.find((emp) => emp.empId === formData.empId).fName
                  } ${
                    employees.find((emp) => emp.empId === formData.empId).lName
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
          value={formData.employeeId}
          />
          <input 
          type="text"
          disabled
          value={formData.emp_fName}
          />
          <input 
          type="text"
          disabled
          value={formData.emp_lName}
          />

          

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
          <label>Mark Attandance</label>
          <select
            disabled
            value={formData.attendance_marked}
            onChange={(e) =>
              setFormData({ ...formData, attendance_marked: e.target.value })
            }
          >
            <option value="by Admin">{formData.attendance_marked}</option>
          </select>

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

          <button
            className="submit-button"
            onClick={() => handleUpdate(formData)}
          >
            Update Attendance
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
