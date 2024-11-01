import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import "./leave.css";

const LeaveTable = () => {
  // Updated state field names
  const [data, setData] = useState([
    { leaveFormulaId: 1, cutCode: "LC001", cutRate: "$20" },
    { leaveFormulaId: 2, cutCode: "LC002", cutRate: "$25" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [cutCode, setCutCode] = useState("");
  const [cutRate, setCutRate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle edit with updated field names
  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.leaveFormulaId === id);
    if (itemToEdit) {
      setCutCode(itemToEdit.cutCode);
      setCutRate(itemToEdit.cutRate);
      setCurrentItemId(id);
      setFormMode("edit");
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.leaveFormulaId !== id));
  };

  const handleAddNew = () => {
    setFormMode("add");
    setCutCode("");
    setCutRate("");
    setShowForm(true);
  };

  const handleSaveItem = () => {
    if (formMode === "add") {
      const newItem = {
        leaveFormulaId: data.length + 1,
        cutCode,
        cutRate,
      };
      setData([...data, newItem]);
    } else if (formMode === "edit") {
      const updatedData = data.map((item) =>
        item.leaveFormulaId === currentItemId
          ? { ...item, cutCode, cutRate }
          : item
      );
      setData(updatedData);
    }
    resetForm();
  };

  const resetForm = () => {
    setCutCode("");
    setCutRate("");
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Update search to use `cutCode`
  const filteredData = data.filter((item) =>
    item.cutCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="department-table">
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
        <button className="add-button" onClick={handleAddNew}>
          <FaPlus /> Add New Formula
        </button>
      </div>

      {showForm && (
        <div className="add-leave-form">
          <h4>{formMode === "add" ? "Add New Leave" : "Edit Leave"}</h4>
          <input
            type="text"
            placeholder="Leave Code"
            value={cutCode}
            onChange={(e) => setCutCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cut Rate Per Hour"
            value={cutRate}
            onChange={(e) => setCutRate(e.target.value)}
          />
          <button className="submit-button" onClick={handleSaveItem}>
            {formMode === "add" ? "Add" : "Update"}
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}

      <div className="departments-table">
        <table className="table">
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
              <tr key={item.leaveFormulaId}>
                <td>{item.leaveFormulaId}</td>
                <td>{item.cutCode}</td>
                <td>{item.cutRate}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item.leaveFormulaId)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.leaveFormulaId)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaTrash className="table-delete" />
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
