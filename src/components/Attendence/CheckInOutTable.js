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

const CheckInOutTable = ({ dash }) => {
  const [data, setData] = useState([])

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    fName: "",
    lName: "",
    time: "",
    date: "",
    status: "",
    ip: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchAtt = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}att-chkinout/`);
      setData(response.data);
      console.log(data);
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
    fetchAtt();
    fetchEmployees();
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
      const response = await axios.post(`${SERVER_URL}chkinout/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}att-chkinout/`);
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
        Header: "Employee ID",
        accessor: "empId",
      },
      {
        Header: "Employee Name",
        Cell: ({ row }) => (
          <span className="bold-fonts">
            {row.original.lName} {row.original.fName}
          </span>
        ),
      },
      {
        Header: "Time",
        accessor: "time",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status ${value === "checkin"
              ? "presentStatus"
              : value === "checkout"
                ? "lateStatus"
                : "none"
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
    [filteredData, selectedIds] // Update columns when filteredData or selectedIds changes
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
      id: row.id,
      empId: row.empId,
      fName: row.fName,
      lName: row.lName,
      time: row.time,
      date: row.date,
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
      !formData.empId ||
      !formData.time ||
      !formData.fName ||
      !formData.lName ||
      !formData.date ||
      !formData.status
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const attPayload = {
      id: formData.id,
      empId: formData.empId,
      fName: formData.lName,
      lName: formData.fName,
      time: formatTime(formData.time),
      date: formData.date,
      status: formData.status,
    };
    console.log(attPayload);
    try {
      const res = await axios.put(
        `${SERVER_URL}att-chkinout/${formData.id}/`,
        attPayload
      );
      const updatedData = await axios.get(`${SERVER_URL}att-chkinout/`);
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
    setFormData({ id: row.id });
  };

  const confirmDelete = async () => {
    const response = await axios.delete(`${SERVER_URL}att-chkinout/${formData.id}/`);
    const updatedData = await axios.get(`${SERVER_URL}att-chkinout/`);
    setData(updatedData.data);
    fetchAtt();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    setFormData({
      empId: "",
      fName: "",
      lName: "",
      time: "",
      date: "",
      status: "",
      ip: "",

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
      !formData.time ||
      !formData.fName ||
      !formData.lName ||
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
      fName: formData.lName,
      lName: formData.fName,
      time: formatTime(formData.time),
      date: formData.date,
      status: formData.status,
      ip: 'byAdmin',
    };
    try {
      await axios.post(`${SERVER_URL}att-chkinout/`, payload);
      const updatedData = await axios.get(`${SERVER_URL}att-chkinout/`);
      setData(updatedData.data);
      fetchAtt();
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };
  const formatTime = (time) => {
    // If time already includes seconds, return as is.
    if (time.split(':').length === 3) return time;

    // Otherwise, append ":00" for seconds.
    return `${time}:00`;
  };

  return (
    <div className="department-table">
      {!dash && (
        <>

          <ConirmationModal
            isOpen={showModal}
            message={
              modalType === "delete selected"
                ? "Are you sure you want to delete selected items?"
                : `Are you sure you want to ${modalType} this Manual Check In / Out?`
            }
            onConfirm={() => {
              if (modalType === "create") confirmAdd();
              else if (modalType === "delete selected") confirmBulkDelete();
              else if (modalType === "update") confirmUpdate();
              // if (modalType === "update") confirmUpdate();
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
                : `Check In / Out ${modalType}d successfully!`
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
              <FaPlus className="add-icon" /> Add Manual Check In / Out
            </button>
            <button className="add-button submit-button" onClick={handleBulkDelete}>
              <FaTrash className="add-icon" /> Delete Bulk
            </button>
        </div>
          </div>
        </>
      )}
      {showAddForm && !showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Add Manual Check In / Out</h3>
          <label>Select Employee</label>
          <input
            list="employeesList"
            value={formData.empId} // Display the selected or entered empId
            onChange={(e) => {
              const selectedEmpId = e.target.value; // Capture the entered/selected empId
              const selectedEmployee = employees.find(
                (emp) => emp.empId === selectedEmpId
              ); // Find the corresponding employee

              setFormData({
                ...formData,
                empId: selectedEmpId, // Update empId in formData
                fName: selectedEmployee ? selectedEmployee.fName : "", // Auto-fill fName
                lName: selectedEmployee ? selectedEmployee.lName : "", // Auto-fill lName
              });
            }}
            placeholder="Enter or select Employee ID"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option key={emp.empId} value={emp.empId}>
                {emp.empId} {emp.fName} {emp.lName}
              </option>
            ))}
          </datalist>

          <label>First Name</label>
          <input
            type="text"
            value={formData.fName} // Display the auto-filled first name
            disabled // Make it read-only to prevent user edits
          />

          <label>Last Name</label>
          <input
            type="text"
            value={formData.lName} // Display the auto-filled last name
            disabled // Make it read-only to prevent user edits
          />

          <div>
            <label>Time</label>
            <input
              type="time"
              placeholder="Time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
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
            <option value="checkin">Checkin</option>
            <option value="checkout">Checkout</option>
          </select>

          <label>Marked By</label>
          <select
            disabled
            value={formData.ip}
            onChange={(e) =>
              setFormData({ ...formData, ip: e.target.value })
            }
          >

            <option value="byAdmin">By Admin</option>
          </select>
          <button className="submit-button" onClick={addAtt}>
            Add Manual Check In / Out
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
          <h3>Edit Manual Check In / Out</h3>
          <label>Selected Employee</label>
          <input
            disabled
            list="employeesList"
            value={formData.empId} // Display the selected or entered empId
            onChange={(e) => {
              const selectedEmpId = e.target.value; // Capture the entered/selected empId
              const selectedEmployee = employees.find(
                (emp) => emp.empId === selectedEmpId
              ); // Find the corresponding employee

              setFormData({
                ...formData,
                empId: selectedEmpId, // Update empId in formData
                fName: selectedEmployee ? selectedEmployee.fName : "", // Auto-fill fName
                lName: selectedEmployee ? selectedEmployee.lName : "", // Auto-fill lName
              });
            }}
            placeholder="Enter or select Employee ID"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option key={emp.empId} value={emp.empId}>
                {emp.empId} {emp.fName} {emp.lName}
              </option>
            ))}
          </datalist>

          <label>First Name</label>
          <input
            type="text"
            value={formData.fName} // Display the auto-filled first name
            disabled // Make it read-only to prevent user edits
          />

          <label>Last Name</label>
          <input
            type="text"
            value={formData.lName} // Display the auto-filled last name
            disabled // Make it read-only to prevent user edits
          />

          <div>
            <label>Time</label>
            <input
              type="time"
              placeholder="Time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
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
            <option value="checkin">Checkin</option>
            <option value="checkout">Checkout</option>
          </select>
          <button
            className="submit-button"
            onClick={() => handleUpdate(formData)}
          >
            Update Manual Check In / Out
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

      {!dash && (

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
      )}
    </div>
  );
};

export default CheckInOutTable;
