import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../..//Settings/Setting_Tabs/leave.css";
import axios from 'axios';
const UsersTable = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentItemId, setCurrentItemId] = useState('');
    const [formData, setFormData] = useState({
        UserId: "",
        userName: "",
        email: "",
        password: ""
    });
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedItems(prevItems =>
            checked ? [...prevItems, value] : prevItems.filter(item => item !== value)
        );
    };
    const items = [
        "Dashboard", "Enrollment", "Department", "Designation", "Location",
        "Employee", "Resign", "Devices", "Attendance", "Leaves",
        "Shift Management", "Payroll", "Employee Profile", "Payroll Log",
        "Bonuses", "Reports", "Visitors", "Block Employee", "Settings", "Profile"
    ];
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    const handleEdit = (id) => {
        const itemToEdit = data.find((item) => item._id === id);
        setFormData({
            UserId: itemToEdit.id,
            userName: itemToEdit.name,
            email: itemToEdit.email,
            password: itemToEdit.password,
        });
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
            console.error('Error deleting user:', error);
        }
    };
    const handleAddNew = () => {
        setFormMode("add");
        setFormData({
            UserId: (data.length + 1).toString(),
            userName: "",
            email: "",
            password: ""
        });
        setShowForm(true);
    };
    const handleSaveItem = async () => {
        const userPayload = {
            _id: formMode === "edit" ? currentItemId : undefined,
            id: parseInt(formData.UserId, 10),
            name: formData.userName,
            email: formData.email,
            password: formData.password,
            accessibleItems: selectedItems
        };
        try {
            if (formMode === "add") {
                await axios.post('http://localhost:5000/api/users', userPayload);
            } else if (formMode === "edit") {
                await axios.post('http://localhost:5000/api/upDateUsers', userPayload);
            }
            fetchUsers();
            resetForm();
            setSelectedItems([]);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };
    const resetForm = () => {
        setFormData({
            UserId: "",
            userName: "",
            email: "",
            password: ""
        });
        setCurrentItemId(null);
        setFormMode("add");
        setShowForm(false);
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const filteredData = data.filter((item) =>
        (item.name ? item.name.toLowerCase() : "").includes(searchQuery.toLowerCase())
    );
    return (
        <div className="table-container">
            <div className="leave-header">
                <form className="form">
                    <button>
                        <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="search">
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
                        placeholder="Search users..."
                        className="input"
                        required
                        type="text"
                    />
                    <button className="reset" type="reset">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
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
                        placeholder="User ID"
                        value={formData.UserId}
                        onChange={(e) => setFormData({ ...formData, UserId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="User Name"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <h4>Select Accessible Items:</h4>
                    <div className="item-list-Selected">
                        {items.map(item => (
                            <div className="items" key={item}>
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        value={item}
                                        checked={selectedItems.includes(item)}
                                        onChange={handleCheckboxChange}
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
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Access</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item._id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td className="accessible-items">
                                    <td className="accessible-items">
                                        {Array.isArray(item.accessibleItems) ? (
                                            item.accessibleItems.map((accessibleItem, index) => (
                                                <span key={index}>{accessibleItem}</span>
                                            ))
                                        ) : (
                                            'No accessible items'
                                        )}
                                    </td>
                                </td>
                                <td>
                                    <button className="action-button edit" onClick={() => handleEdit(item._id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="action-button delete" onClick={() => handleDelete(item._id)}>
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