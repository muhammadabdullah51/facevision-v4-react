import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../Settings/Setting_Tabs/leave.css";

const ShiftsTable = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentItemId, setCurrentItemId] = useState(null); // Store ID of item being edited
  const [formData, setFormData] = useState({
    ShiftId: "",
    shiftName: "",
    startTime: "",
    endTime: "",
    entryStartTime: "",
    entryEndTime: "",
    exitStartTime: "",
    exitEndTime: "",
  });
  // useEffect(() => {
  //   fetchShift();
  // }, []);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // const fetchShift = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/fetchShift");
      
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data');
  //     }
  
  //     const data = await response.json(); // Parse the JSON data
  //     console.log(data);
  //     setData(data); // Set the parsed data to state
  //   } catch (error) {
  //     console.error("Error fetching shift data:", error);
  //   }
  // // Call fetchDepartments when component mounts
  // }

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setFormData({
        ShiftId: itemToEdit.id,
        shiftName: itemToEdit.name,
        startTime: itemToEdit.startTime,
        endTime: itemToEdit.endTime,
        entryStartTime: itemToEdit.entryStartTime,
        entryEndTime: itemToEdit.entryEndTime,
        exitStartTime: itemToEdit.exitStartTime,
        exitEndTime: itemToEdit.exitEndTime,
      });
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
    setFormData({
      ShiftId: (data.length + 1).toString(),
      shiftName: "",
      startTime: "",
      endTime: "",
      entryStartTime: "",
      entryEndTime: "",
      exitStartTime: "",
      exitEndTime: "",
    });
    setShowForm(true);
  };

  const handleSaveItem = () => {
    if (formMode === "add") {
      const newItem = {
        ShiftId: parseInt(formData.ShiftId, 10),
        shiftName: formData.shiftName,
        startTime: formData.startTime,
        endTime: formData.endTime,
        entryStartTime: formData.entryStartTime,
        entryEndTime: formData.entryEndTime,
        exitStartTime: formData.exitStartTime,
        exitEndTime: formData.exitEndTime,
      };
      setData([...data, newItem]);
    } else if (formMode === "edit") {
      const updatedData = data.map((item) =>
        item.id === currentItemId ? { ...item, ...formData } : item
      );
      setData(updatedData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      ShiftId: "",
      shiftName: "",
      startTime: "",
      endTime: "",
      entryStartTime: "",
      entryEndTime: "",
      exitStartTime: "",
      exitEndTime: "",
    });
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-container">
      <div className="leave-header">
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
        <button className="addLeave" onClick={handleAddNew}>
          <FontAwesomeIcon icon={faPlus} /> Add New Shift
        </button>
      </div>

      {showForm && (
        <div className="add-leave-form">
          <h3>{formMode === "add" ? "Add New Shift" : "Edit Shift"}</h3>
          <input
            type="text"
            placeholder="Shift ID"
            value={formData.ShiftId}
            onChange={(e) =>
              setFormData({ ...formData, ShiftId: e.target.value })
            }
            readOnly={formMode === "edit"}
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
              <label>End Time</label>
              <input
                type="time"
                placeholder="End Time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
            <div>
              <label>Exit Start Time</label>
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
              <label>Exit End Time</label>
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
              <th>Shift ID</th>
              <th>Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
                <td>
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(item.id)}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ background: "none", border: "none" }}
                    />
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ background: "none", border: "none" }}
                    />
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

export default ShiftsTable;
