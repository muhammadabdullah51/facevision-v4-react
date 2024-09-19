import React, { useState, useMemo, useCallback } from "react";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import './leaves.css'

const LeaveTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleDelete = (row) => {
    setData((prevData) => prevData.filter((item) => item.id !== row.id));
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

  const addLeave = () => {
    // Add leave to the table
    setData((prevData) => [...prevData, { ...formData, id: Date.now() }]);

    // Reset form data
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

    // Hide form
    setShowAddForm(false);
  };

  const handleUpdate = () => {
    // Update the leave data
    setData((prevData) =>
      prevData.map((item) => (item.id === formData.id ? { ...formData } : item))
    );

    // Optionally reset form data
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

    // Hide the edit form
    setShowEditForm(false);
  };

  return (
    <div className="leave-table">
      <div className="table-header">
        <form className="form">
          <button>
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
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
            required
            type="text"
          />
          <button className="reset" type="reset">
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
              ></path>
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
