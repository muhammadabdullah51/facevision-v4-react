import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import axios from "axios";
import "../../..//Settings/Setting_Tabs/leave.css";

import ConirmationModal from "../../../Modal/conirmationModal";
import addAnimation from "../../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../../assets/Lottie/successAnim.json";

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
  "Advance Salary",
  "Appraisal",
  "Loan",
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [searchQuery, setSearchQuery] = useState("");

  

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [setData]);

  useEffect(() => {
    fetchUsers();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchUsers, successModal]);

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: id });
  };
  const confirmDelete = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/deleteUsers`, {
        id: formData._id,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddNew = () => {
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
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addUser = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.username === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.phoneNumber === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/users", formData);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      console.log(error);
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
    setSelectedItems(itemToEdit.accessibleItems || []);
    setCurrentItemId(id);
    setShowAddForm(false);
    setShowEditForm(true);
  };


  const updateUser = (row) => {
    setModalType("update");
    setFormData({
      _id: row._id,
      firstName: row.firstName,
      lastName: row.lastName,
      username: row.username,
      email: row.email,
      password: "", // Don't pre-fill password for security
      phoneNumber: row.phoneNumber,
      profilePicture: row.profilePicture,
      accessibleItems: row.accessibleItems || [], // Ensure it's an array
    });
    setShowModal(true);
  }
  const confirmUpdate = async() => {
    // await axios.post

  }

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
      } else if (formMode === "edit") {
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
    handleCancel();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    (item.username ? item.username.toLowerCase() : "").includes(
      searchQuery.toLowerCase()
    )
  );

  // const renderTabs = (accessibleItems) => {
  //   return items
  //     .filter((tab) => accessibleItems.includes(tab)) // Only show tabs user has access to
  //     .map((tab) => <li key={tab}>{tab}</li>); // Render as list items (can adjust this part to your UI)
  // };

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
          <FaPlus /> Add New User
        </button>
      </div>
      {showAddForm && !showEditForm && (
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
          <button className="submit-button" onClick={addUser}>
            Add User
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Edit User</h3>
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
          <button
            className="submit-button"
            onClick={() => updateUser(formData)}
          >
            Update User
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
                  {Array.isArray(item.accessibleItems)
                    ? item.accessibleItems.map((accessibleItem, index) => (
                        <span key={index}>{accessibleItem}</span>
                      ))
                    : "No accessible items"}
                </td>

                <td>
                  <button
                    onClick={() => handleEdit(item._id)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
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
      {/* <div className="tabs-container">
        <h3>Accessible Tabs</h3>
        <ul>{renderTabs(formData.accessibleItems)}</ul>
      </div> */}
    </div>
  );
};

export default UsersTable;
