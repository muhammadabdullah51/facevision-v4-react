import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../Settings/Setting_Tabs/leave.css";
import axios from "axios";

const BlockEmployeeTable = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [status, setStatus] = useState("Blocked");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBlock();
  }, []);

  const fetchBlock = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fetchBlock");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json(); // Parse the JSON data
      console.log(data);
      setData(data); // Set the parsed data to state
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
    // Call fetchDepartments when component mounts
  };

  const handleEdit = (data) => {
    setEmployeeName(data.employeeName);
    setDepartment(data.department);
    setContactNumber(data.contactNumber);
    setStatus(data.status);
    setCurrentItemId(data._id);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post('http://localhost:5000/api/deleteBlock', { id })
      const updatedData = await axios.get('http://localhost:5000/api/fetchBlock');
      setData(updatedData.data)
      console.log(`Blocked deleted ID: ${id}`);
    } catch (error) {
      console.log(error)
    }
    
  // try {
  //   console.log("Attempting to delete block with ID:", id); // Log the ID before sending the request

  //   const deleteResponse = await axios.post('http://localhost:5000/api/deleteBlock', { id });

  //   console.log("Delete response:", deleteResponse.data.message);

  //   const updatedData = await axios.get('http://localhost:5000/api/FetchBlock');
  //   setData(updatedData.data);
  //   console.log('Block list updated:', updatedData.data);
  // } catch (error) {
  //   console.error('Error deleting block:', error.response ? error.response.data : error);
  // }
};


  const handleAddNew = () => {
    setFormMode("add");

    setShowForm(true);
  };

  const handleSaveItem = async () => {
    if (formMode === "add") {
      const payload = {
        id: (data.length + 1).toString(),
        employeeName,
        department,
        contactNumber,
        status,
      };
      try {
        await axios.post("http://localhost:5000/api/addBlock", payload);
        console.log(payload);
        const updatedData = await axios.get(
          "http://localhost:5000/api/fetchBlock"
        );
        setData(updatedData.data);
      } catch (error) {
        console.log(error);
      }
      resetForm();
    } else if (formMode === "edit") {
      const payload = {
        _id: currentItemId,
        id: (data.length + 1).toString(),
        employeeName,
        department,
        contactNumber,
        status,
      };
      try {
        await axios.post("http://localhost:5000/api/updateBlock", payload);
        console.log(payload);
        const updatedData = await axios.get(
          "http://localhost:5000/api/fetchBlock"
        );
        setData(updatedData.data);
        resetForm()
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setEmployeeName("");
    setDepartment("");
    setContactNumber("");
    setStatus("Blocked");
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
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
          <FontAwesomeIcon icon={faPlus} /> Block New Employee
        </button>
      </div>

      {showForm && (
        <div className="add-leave-form">
          <h4>{formMode === "add" ? "Add New Employee" : "Edit Employee"}</h4>
          <input
            type="text"
            placeholder="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Blocked">Blocked</option>
            <option value="Active">Active</option>
          </select>
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
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Contact Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.employeeName}</td>
                <td>{item.department}</td>
                <td>{item.contactNumber}</td>
                <td><span className={`status ${item.status === "Active" ? "activeStatus" : "inactiveStatus"}`}>{item.status}</span></td>
                <td>
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(item)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(item._id)}
                  >
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

export default BlockEmployeeTable;
