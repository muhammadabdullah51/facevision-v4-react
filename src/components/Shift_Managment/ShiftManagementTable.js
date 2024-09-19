import React, { useState, useMemo, useCallback } from "react";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import './shift_managment.css'

const ShiftManagementTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    ShiftId: null,
    shiftName: "",
    startTime: "",
    entryStartTime: "",
    entryEndTime: "",
    endTime: "",
    exitStartTime: "",
    exitEndTime: "",
  });

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "ID",
        accessor: "ShiftId",
      },
      {
        Header: "Shift Name",
        accessor: "shiftName",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Start Time",
        accessor: "startTime",
      },
      {
        Header: "End Time",
        accessor: "endTime",
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
      ShiftId: row.ShiftId,
      shiftName: row.shiftName,
      startTime: row.startTime,
      entryStartTime: row.entryStartTime,
      entryEndTime: row.entryEndTime,
      endTime: row.endTime,
      exitStartTime: row.exitStartTime,
      exitEndTime: row.exitEndTime,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleDelete = (row) => {
    setData((prevData) => prevData.filter((item) => item.ShiftId !== row.ShiftId));
  };

  const handleAdd = () => {
    setFormData({
      ShiftId: null,
      shiftName: "",
      startTime: "",
      entryStartTime: "",
      entryEndTime: "",
      endTime: "",
      exitStartTime: "",
      exitEndTime: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addLeave = () => {
    // Add leave to the table
    setData((prevData) => [...prevData, { ...formData, ShiftId: Date.now() }]);

    // Reset form data
    setFormData({
      ShiftId: null,
      shiftName: "",
      startTime: "",
      entryStartTime: "",
      entryEndTime: "",
      endTime: "",
      exitStartTime: "",
      exitEndTime: "",
    });

    // Hide form
    setShowAddForm(false);
  };

  const handleUpdate = () => {
    // Update the leave data
    setData((prevData) =>
      prevData.map((item) => (item.ShiftId === formData.ShiftId ? { ...formData } : item))
    );

    // Optionally reset form data
    setFormData({
      ShiftId: null,
      shiftName: "",
      startTime: "",
      entryStartTime: "",
      entryEndTime: "",
      endTime: "",
      exitStartTime: "",
      exitEndTime: "",
    });

    // Hide the edit form
    setShowEditForm(false);
  };

  return (
    <div className="leave-table">
      <div className="table-header">
        <button className="add-button" onClick={handleAdd}>
          <FaPlus className="add-icon" /> Add Shift
        </button>
      </div>

      {/* Add Leave Form */}
      {showAddForm && (
        <div className="add-department-form">
          <h3>Add New Shift</h3>
          <input
            type="text"
            placeholder="Shift ID"
            value={formData.ShiftId}
            onChange={(e) =>
              setFormData({ ...formData, ShiftId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Shift Name"
            value={formData.shiftName}
            onChange={(e) =>
              setFormData({ ...formData, shiftName: e.target.value })
            }
          />

            <h5>Entry Time Configuration</h5>
          <div className="form-time">
            <div>
            <label>Start Time</label>
            <input
              type="time"
              placeholder="Start Time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />
            </div>
            <div>
            <label>Entry Start Time</label>
            <input
              type="time"
              placeholder="Entry Start Time"
              value={formData.entryStartTime}
              onChange={(e) =>
                setFormData({ ...formData, entryStartTime: e.target.value })
              }
            />
            </div>
            <div>
            <label>Entry End Time</label>
            <input
              type="time"
              placeholder="Entry End Time"
              value={formData.entryEndTime}
              onChange={(e) =>
                setFormData({ ...formData, entryEndTime: e.target.value })
              }
            />
            </div>
          </div>

            <h5>Exit Time Configuration</h5>
          <div className="form-time">
            <div>
            <label>Start Time</label>
            <input
              type="time"
              placeholder="Exit Time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
            />
            </div>
            <div>
            <label>Entry Start Time</label>
            <input
              type="time"
              placeholder="Exit Start Time"
              value={formData.exitStartTime}
              onChange={(e) =>
                setFormData({ ...formData, exitStartTime: e.target.value })
              }
            />
            </div>
            <div>
            <label>Entry End Time</label>
            <input
              type="time"
              placeholder="Exit End Time"
              value={formData.exitEndTime}
              onChange={(e) =>
                setFormData({ ...formData, exitEndTime: e.target.value })
              }
            />
            </div>
          </div>

          <button className="submit-button" onClick={addLeave}>
            Add Shift
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
        <div className="add-department-form">
        <h3>Add New Shift</h3>
        <input
          type="text"
          placeholder="Shift ID"
          value={formData.ShiftId}
          onChange={(e) =>
            setFormData({ ...formData, ShiftId: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Shift Name"
          value={formData.shiftName}
          onChange={(e) =>
            setFormData({ ...formData, shiftName: e.target.value })
          }
        />

          <h5>Entry Time Configuration</h5>
        <div className="form-time">
          <div>
          <label>Start Time</label>
          <input
            type="time"
            placeholder="Start Time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          />
          </div>
          <div>
          <label>Entry Start Time</label>
          <input
            type="time"
            placeholder="Entry Start Time"
            value={formData.entryStartTime}
            onChange={(e) =>
              setFormData({ ...formData, entryStartTime: e.target.value })
            }
          />
          </div>
          <div>
          <label>Entry End Time</label>
          <input
            type="time"
            placeholder="Entry End Time"
            value={formData.entryEndTime}
            onChange={(e) =>
              setFormData({ ...formData, entryEndTime: e.target.value })
            }
          />
          </div>
        </div>

          <h5>Exit Time Configuration</h5>
        <div className="form-time">
          <div>
          <label>Start Time</label>
          <input
            type="time"
            placeholder="Exit Time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
          />
          </div>
          <div>
          <label>Entry Start Time</label>
          <input
            type="time"
            placeholder="Exit Start Time"
            value={formData.exitStartTime}
            onChange={(e) =>
              setFormData({ ...formData, exitStartTime: e.target.value })
            }
          />
          </div>
          <div>
          <label>Entry End Time</label>
          <input
            type="time"
            placeholder="Exit End Time"
            value={formData.exitEndTime}
            onChange={(e) =>
              setFormData({ ...formData, exitEndTime: e.target.value })
            }
          />
          </div>
        </div>
          <button className="submit-button" onClick={handleUpdate}>
            Update Shift
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

export default ShiftManagementTable;
