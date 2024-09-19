import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./leave.css";

const LeaveTable = () => {
  const [data, setData] = useState([
    { id: 1, leaveCode: "LC001", ratePerHour: "$20" },
    { id: 2, leaveCode: "LC002", ratePerHour: "$25" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); 
  const [currentItemId, setCurrentItemId] = useState(null); 
  const [leaveCode, setLeaveCode] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setLeaveCode(itemToEdit.leaveCode);
      setRatePerHour(itemToEdit.ratePerHour);
      setCurrentItemId(id);
      setFormMode("edit");
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleAddNew = () => {
    setFormMode("add");
    setLeaveCode("");
    setRatePerHour("");
    setShowForm(true);
  };

  const handleSaveItem = () => {
    if (formMode === "add") {
      const newItem = {
        id: data.length + 1,
        leaveCode,
        ratePerHour,
      };
      setData([...data, newItem]);
    } else if (formMode === "edit") {
      const updatedData = data.map((item) =>
        item.id === currentItemId ? { ...item, leaveCode, ratePerHour } : item
      );
      setData(updatedData);
    }
    resetForm();
  };

  const resetForm = () => {
    setLeaveCode("");
    setRatePerHour("");
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.leaveCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-container">
      <div className="leave-header">
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
            onChange={handleSearchChange}
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
        <button className="addLeave" onClick={handleAddNew}>
          <FontAwesomeIcon icon={faPlus} /> Add New Formula
        </button>
      </div>

      {showForm && (
        <div className="add-leave-form">
          <h4>{formMode === "add" ? "Add New Leave" : "Edit Leave"}</h4>
          <input
            type="text"
            placeholder="Leave Code"
            value={leaveCode}
            onChange={(e) => setLeaveCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rate Per Hour"
            value={ratePerHour}
            onChange={(e) => setRatePerHour(e.target.value)}
          />
          <button className="submit-button" onClick={handleSaveItem}>
            {formMode === "add" ? "Add" : "Update"}
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}

      <div className="leave-table-outer">
        <table className="leave-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Leave Code</th>
              <th>Cut Rate Per Hour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.leaveCode}</td>
                <td>{item.ratePerHour}</td>
                <td>
                  <button className="action-button edit" onClick={() => handleEdit(item.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;
