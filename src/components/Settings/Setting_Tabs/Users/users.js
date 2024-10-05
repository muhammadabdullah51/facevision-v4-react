import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../../..//Settings/Setting_Tabs/leave.css";

const items = [
  "Dashboard",
  "Enrollment",
  "Department",
  "Designation",
  "Location",
  "Employee",
  "Resign",
  "Devices",
  "Attendance",
  "Leaves",
  "Shift Management",
  "Payroll",
  "Employee Profile",
  "Payroll Log",
  "Bonuses",
  "Reports",
  "Visitors",
  "Block Employee",
  "Settings",
  "Profile",
];

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItemId, setCurrentItemId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    profilePicture: "",
    accessibleItems: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item._id === id);
  setFormData({
    firstName: itemToEdit.firstName,
    lastName: itemToEdit.lastName,
    username: itemToEdit.username,
    email: itemToEdit.email,
    password: "", // Don't pre-fill password for security
    phoneNumber: itemToEdit.phoneNumber,
    profilePicture: itemToEdit.profilePicture,
    accessibleItems: itemToEdit.accessibleItems || [], // Ensure it's an array
  });

  // Set the selected items for the checkboxes
  setSelectedItems(itemToEdit.accessibleItems || []);

  setCurrentItemId(id);
  setFormMode("edit");
  setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/deleteUsers`, { id });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddNew = () => {
    setFormMode("add");
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      profilePicture: "",
      accessibleItems: [],
    });
    setShowForm(true);
  };

  const handleSaveItem = async () => {
    const userPayload = {
      _id: formMode === "edit" ? currentItemId : undefined,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      profilePicture: formData.profilePicture,
      accessibleItems: selectedItems,
    };
    try {
      if (formMode === "add") {
        await axios.post("http://localhost:5000/api/users", userPayload);
      } else if (formMode === "edit") {
        await axios.post("http://localhost:5000/api/upDateUsers", userPayload);
      }
      fetchUsers();
      resetForm();
      setSelectedItems([]);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      profilePicture: "",
      accessibleItems: [],
    });
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    (item.username ? item.username.toLowerCase() : "").includes(
      searchQuery.toLowerCase()
    )
  );

  return (
    <div className="table-container">
      <div className="leave-header">
        <form className="form">
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="input"
            required
            type="text"
          />
        </form>
        <button className="addLeave" onClick={handleAddNew}>
          <FontAwesomeIcon icon={faPlus} /> Add New User
        </button>
      </div>
      {showForm && (
        <div className="add-leave-form">
          <h3>{formMode === "add" ? "Add New User" : "Edit User"}</h3>
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Profile Picture URL"
            value={formData.profilePicture}
            onChange={(e) =>
              setFormData({ ...formData, profilePicture: e.target.value })
            }
          />
          <h4>Select Accessible Items:</h4>
          <div className="item-list-Selected">
            {items.map((item) => (
              <div className="items" key={item}>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    value={item}
                    checked={selectedItems.includes(item)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setSelectedItems((prevItems) =>
                        checked
                          ? [...prevItems, value]
                          : prevItems.filter((i) => i !== value)
                      );
                    }}
                  />
                  <span className="checkmark"></span>
                  {item}
                </label>
              </div>
            ))}
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
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                <td>{item.username}</td>
                <td>{`${item.firstName} ${item.lastName}`}</td>
                <td>{item.email}</td>
                <td className="accessible-items">
                  <td className="accessible-items">
                    {Array.isArray(item.accessibleItems)
                      ? item.accessibleItems.map((accessibleItem, index) => (
                          <span key={index}>{accessibleItem}</span>
                        ))
                      : "No accessible items"}
                  </td>
                </td>
                <td>
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(item._id)}
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

export default UsersTable;
