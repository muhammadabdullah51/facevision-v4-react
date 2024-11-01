import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./leaves.css";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json"
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";

const LeaveTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const leaveTypes = ["Sick Leave", "Vacation", "Personal Leave"];
  const statuses = ["Pending", "Approved", "Rejected", "Cancelled"];

  const [formData, setFormData] = useState({
    _id: "",
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
  const [loading, setLoading] = useState(false);

  const fetchLeave = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchLeave");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching resignation data:", error);
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

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Employee ID",
        accessor: "id",
      },
      {
        Header: "Employee Name",
        accessor: "employee",
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
            className={`status ${
              value === "Approved" ? "approvedStatus" : "pendingStatus"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Created At",
        accessor: "created_at",
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
      _id: row._id,
      id: row.id,
      employee: row.employee,
      leave_type: row.leave_type,
      start_date: row.start_date,
      end_date: row.end_date,
      reason: row.reason,
      status: row.status,
      created_at: row.created_at,
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
    const leavePayload = {
      _id: formData._id,
      id: formData.id,
      employee: formData.employee,
      leave_type: formData.leave_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: formData.reason,
      status: formData.status,
      created_at: formData.created_at,
    };
    console.log(leavePayload);
    try {
      await axios.post("http://localhost:5000/api/updateLeave", leavePayload);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchLeave"
      );
      setData(updatedData.data);
      fetchLeave();
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: id });
  };

  const confirmDelete = async () => {
    const id = formData._id;
    await axios.post("http://localhost:5000/api/deleteLeave", { id });
    const updatedData = await axios.get("http://localhost:5000/api/fetchLeave");
    setData(updatedData.data);
    fetchLeave();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
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
    const leavePayload = {
      id: formData.id,
      employee: formData.employee,
      leave_type: formData.leave_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: formData.reason,
      status: formData.status,
      created_at: formData.created_at,
    };
    try {
      axios.post(`http://localhost:5000/api/addLeave`, leavePayload);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchLeave"
      );
      setData(updatedData.data);
      fetchLeave();
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this Leave?`}
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
        message={`Leave ${modalType}d successfully!`}
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
          <FaPlus className="add-icon" /> Add New Leave
        </button>
      </div>

      {/* Add Leave Form */}
      {(showAddForm || showEditForm) && (
        <div className="add-department-form add-leave-form">
          <h3>{showAddForm ? "Add New Leave" : "Edit Leave"}</h3>
          <select
            value={formData.employee}
            onChange={(e) => {
              const selectedEmployee = employees.find(
                (emp) => `${emp.fName} ${emp.lName}` === e.target.value
              );
              setFormData({
                ...formData,
                employee: e.target.value,
                id: selectedEmployee ? selectedEmployee.empId : null,
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
          <select
            value={formData.leave_type}
            onChange={(e) =>
              setFormData({ ...formData, leave_type: e.target.value })
            }
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
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
            onClick={showAddForm ? addLeave : handleUpdate}
          >
            {showAddForm ? "Add Leave" : "Update Leave"}
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
