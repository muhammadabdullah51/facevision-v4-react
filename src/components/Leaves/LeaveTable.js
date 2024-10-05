import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import './leaves.css'
import axios from "axios";

const LeaveTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    id: null,
    employeeId: "",
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "Pending",
    createdAt: "",
  });


  useEffect(() => {
    fetchLeave();
}, []);

const fetchLeave = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/fetchLeave');
        setData(response.data);
    } catch (error) {
        console.error('Error fetching resignation data:', error);
    }
};

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
        accessor: "employeeId",
      },
      {
        Header: "Employee Name",
        accessor: "employeeName",
        Cell: ({ value }) => (
          <span className='bold-fonts'>{value}</span>
        ),
      },
      {
        Header: "Leave Type",
        accessor: "leaveType",
      },
      {
        Header: "Start Date",
        accessor: "startDate",
      },
      {
        Header: "End Date",
        accessor: "endDate",
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
            className={`status ${value === "Approved" ? "approvedStatus" : "pendingStatus"
              }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Created At",
        accessor: "createdAt",
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
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      leaveType: row.leaveType,
      startDate: row.startDate,
      endDate: row.endDate,
      reason: row.reason,
      status: row.status,
      createdAt: row.createdAt,
    });

    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleDelete = async (row) => {
    const id= row._id
    await axios.post('http://localhost:5000/api/deleteLeave', {id})
    const updatedData = await axios.get('http://localhost:5000/api/fetchLeave');
      setData(updatedData.data);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      employeeId: "",
      employeeName: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      status: "Pending",
      createdAt: new Date().toISOString().split('T')[0],
    });

    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addLeave = async() => {
    const leavePayload = {
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: formData.status,
      createdAt: formData.createdAt
    }
    try {
      axios.post(`http://localhost:5000/api/addLeave`, leavePayload)
      const updatedData = await axios.get('http://localhost:5000/api/fetchLeave');
      setData(updatedData.data);
      fetchLeave()
    } catch (error) {
      console.log(error)
    }
    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    const leavePayload = {
      _id: formData._id,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: formData.status,
      createdAt: formData.createdAt,
    }
    console.log(leavePayload)
    try {
      await axios.post('http://localhost:5000/api/updateLeave', leavePayload)
      const updatedData = await axios.get('http://localhost:5000/api/fetchLeave');
      setData(updatedData.data);

    } catch (error) {
      console.log(error)
    }
    setShowEditForm(false);
  };

  return (
    <div className="leave-table">
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
      {showAddForm && (
        <div className="add-device-form">
          <h3>Add New Leave</h3>
          <input
            type="text"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={formData.employeeName}
            onChange={(e) =>
              setFormData({ ...formData, employeeName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Leave Type"
            value={formData.leaveType}
            onChange={(e) =>
              setFormData({ ...formData, leaveType: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="End Date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
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
          <div className="status-toggle">
            <label>Status: </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.status === "Approved"}
                onChange={handleStatusToggle}
              />
              <span className="slider round"></span>
            </label>
            {formData.status}
          </div>
          <button className="submit-button" onClick={addLeave}>
            Add Leave
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Edit Leave Form */}
      {showEditForm && (
        <div className="add-device-form">
          <h3>Edit Leave</h3>
          <input
            type="text"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={formData.employeeName}
            onChange={(e) =>
              setFormData({ ...formData, employeeName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Leave Type"
            value={formData.leaveType}
            onChange={(e) =>
              setFormData({ ...formData, leaveType: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="End Date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
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
          <div className="status-toggle">
            <label>Status: </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.status === "Approved"}
                onChange={handleStatusToggle}
              />
              <span className="slider round"></span>
            </label>
            {formData.status}
          </div>
          <button className="submit-button" onClick={handleUpdate}>
            Update Leave
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
