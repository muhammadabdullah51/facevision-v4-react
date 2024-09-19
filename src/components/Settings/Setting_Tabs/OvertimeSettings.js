import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./leave.css";

const OvertimeTable = () => {
  const [data, setData] = useState([
    { id: 1, payCode: "PC001", ratePerHour: "$30", updateDate: "2024-09-01" },
    { id: 2, payCode: "PC002", ratePerHour: "$35", updateDate: "2024-09-02" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentItemId, setCurrentItemId] = useState(null); // Store ID of item being edited
  const [payCode, setPayCode] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setPayCode(itemToEdit.payCode);
      setRatePerHour(itemToEdit.ratePerHour);
      setUpdateDate(itemToEdit.updateDate);
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
    setPayCode("");
    setRatePerHour("");
    setUpdateDate("");
    setShowForm(true);
  };

  const handleSaveItem = () => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    if (formMode === "add") {
      const newItem = {
        id: data.length + 1,
        payCode,
        ratePerHour,
        updateDate: currentDate,
      };
      setData([...data, newItem]);
    } else if (formMode === "edit") {
      const updatedData = data.map((item) =>
        item.id === currentItemId ? { ...item, payCode, ratePerHour, updateDate: currentDate } : item
      );
      setData(updatedData);
    }
    resetForm();
  };

  const resetForm = () => {
    setPayCode("");
    setRatePerHour("");
    setUpdateDate("");
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.payCode.toLowerCase().includes(searchQuery.toLowerCase())
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
          <FontAwesomeIcon icon={faPlus} /> Add New Overtime Formula
        </button>
      </div>

      {showForm && (
        <div className="add-leave-form">
          <h4>{formMode === "add" ? "Add New Overtime" : "Edit Overtime"}</h4>
          <input
            type="text"
            placeholder="Pay Code"
            value={payCode}
            onChange={(e) => setPayCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rate Per Hour"
            value={ratePerHour}
            onChange={(e) => setRatePerHour(e.target.value)}
          />
          <input
            type="date"
            placeholder="Update Date"
            value={updateDate}
            onChange={(e) => setUpdateDate(e.target.value)}
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
              <th>Formula ID</th>
              <th>Pay Code</th>
              <th>Rate Per Hour</th>
              <th>Update Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.payCode}</td>
                <td>{item.ratePerHour}</td>
                <td>{item.updateDate}</td>
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

export default OvertimeTable;
