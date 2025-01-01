import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../../Dashboard/dashboard.css";

import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../../config";

const WorkingHours = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [currentItemId, setCurrentItemId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        id: "",
        empId: "",
        first_checkin: "",
        last_checkout: "",
        calcHours: '',
        date: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [successModal, setSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const [warningModal, setWarningModal] = useState(false);
    const [resMsg, setResMsg] = useState("");

    const fetchWH = useCallback(async () => {
        try {
            const response = await axios.get(`${SERVER_URL}working-hours/`);
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching employee bonuses:", error);
        }
    }, [setData]);
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}pr-emp/`);
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };



    useEffect(() => {
        fetchWH();
        fetchEmployees();
        let timer;
        if (successModal) {
            timer = setTimeout(() => {
                setSuccessModal(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [fetchWH, successModal]);

    const handleDelete = async (id) => {
        setModalType("delete");
        setShowModal(true);
        setFormData({ ...formData, id: id });
    };
    const confirmDelete = async (id) => {
        try {
            await axios.delete(`${SERVER_URL}working-hours/delete/${formData.id}/`);
            await fetchWH(); // Refresh data after deletion
            setShowModal(false);
            setSuccessModal(true);
        } catch (error) {
        }
    };

    const handleAddNew = () => {
        setFormData({
            empId: "",
            first_checkin: "",
            last_checkout: "",
            calcHours: '',
            date: "",
        });
        setShowAddForm(true);
        setShowEditForm(false);
    };
    const addAssign = () => {
        setModalType("create");
        setShowModal(true);
    };

    const confirmAdd = async () => {
        if (!formData.empId || !formData.first_checkin || !formData.last_checkout || !formData.calcHours || !formData.date) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        if (formData.calcHours < 1) {
            setResMsg("Working hours should be greater than 1");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        console.log(formData);
        await axios.post(`${SERVER_URL}working-hours/create/`, formData);
        setShowModal(false);
        setSuccessModal(true);
        setShowAddForm(false);
        fetchWH();
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            empId: item.empId,
            first_checkin: item.first_checkin,
            last_checkout: item.last_checkout,
            calcHours: item.calcHours,
            date: item.date,
        });
        setShowAddForm(false);
        setShowEditForm(true);
    };
    const updateAssign = (row) => {
        setModalType("update");
        setFormData({
            id: row.id,
            empId: row.empId,
            first_checkin: row.first_checkin,
            last_checkout: row.last_checkout,
            calcHours: row.calcHours,
            date: row.date,
        });
        setShowModal(true);
    };
    const confirmUpdate = async () => {
        if (!formData.empId || !formData.first_checkin || !formData.last_checkout || !formData.date || !formData.calcHours) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        if (formData.calcHours < 1) {
            setResMsg("Working hours should be greater than 1");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        await axios.put(`${SERVER_URL}working-hours/update/${formData.id}/`, formData);
        setShowModal(false);
        setSuccessModal(true);
        setShowEditForm(false);
        fetchWH();
    };


    const resetForm = () => {
        setFormData({
            id: "",
            empId: "",
            first_checkin: "",
            last_checkout: "",
            calcHours: '',
            date: "",
        });
        setCurrentItemId(null);
        setFormMode("add");
        setShowForm(false);
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const filteredData = data.filter((item) =>
        item.empId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.first_checkin.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_checkout.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.calcHours.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleCancel = () => {
        setShowAddForm(false);
        setShowEditForm(false);
    };

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);

        if (isChecked) {
            const allIds = filteredData.map((row) => row.id);
            setSelectedIds(allIds);
            console.log(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleRowCheckboxChange = (event, rowId) => {
        const isChecked = event.target.checked;

        setSelectedIds((prevSelectedIds) => {
            if (isChecked) {
                return [...prevSelectedIds, rowId];
            } else {
                const updatedIds = prevSelectedIds.filter((id) => id !== rowId);
                if (updatedIds.length !== filteredData.length) {
                    setSelectAll(false);
                }
                return updatedIds;
            }
        });
        console.log(selectedIds);
    };
    useEffect(() => {
        if (selectedIds.length === filteredData.length && filteredData.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedIds, filteredData]);


    const handleBulkDelete = () => {
        if (selectedIds.length > 0) {
            setModalType("delete selected");
            setShowModal(true);
        } else {
            setResMsg("No rows selected for deletion.");
            setShowModal(false);
            setWarningModal(true);
        }
    };


    const confirmBulkDelete = async () => {
        try {
            const payload = { ids: selectedIds };
            const response = await axios.post(`${SERVER_URL}empwh/del/data`, payload);
            const updatedData = await axios.get(`${SERVER_URL}working-hours/`);
            setData(updatedData.data);
            setShowModal(false);
            setSelectedIds([]);
            setSuccessModal(true);
        } catch (error) {
            console.error("Error deleting rows:", error);
        } finally {
            setShowModal(false);
        }
    };

    return (
        <div className="department-table">
            <ConirmationModal
                isOpen={showModal}
                message={
                    modalType === "create"
                        ? `Are you sure you want to add Working Hours?`
                        : modalType === "update"
                            ? "Are you sure you want to update Working Hours?"
                            : modalType === "delete selected"
                                ? "Are you sure you want to delete selected items?"
                                : `Are you sure you want to delete Working Hours?`
                }
                onConfirm={() => {
                    if (modalType === "create") confirmAdd();
                    else if (modalType === "delete selected") confirmBulkDelete();
                    else if (modalType === "update") confirmUpdate();
                    else confirmDelete();
                }}
                onCancel={() => setShowModal(false)}
                animationData={
                    modalType === "create"
                        ? addAnimation
                        : modalType === "update"
                            ? updateAnimation
                            : deleteAnimation
                }
            />
            <ConirmationModal
                isOpen={successModal}
                message={
                    modalType === "delete selected"
                        ? "Selected items deleted successfully!"
                        : `Working Hours ${modalType}d successfully!`
                }
                onConfirm={() => setSuccessModal(false)}
                onCancel={() => setSuccessModal(false)}
                animationData={successAnimation}
                successModal={successModal}
            />
            <ConirmationModal
                isOpen={warningModal}
                message={resMsg}
                onConfirm={() => setWarningModal(false)}
                onCancel={() => setWarningModal(false)}
                animationData={warningAnimation}
                warningModal={warningModal}
            />
            <div className="table-header" >
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
                    <button className="reset" type="reset"
                        onClick={() => setSearchQuery("")}>
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

                <div className="add-delete-conainer">
                    <button className="add-button" onClick={handleAddNew}>
                        <FaPlus /> Add New Working Hours
                    </button>
                    <button className="add-button submit-button" onClick={handleBulkDelete}>
                        <FaTrash className="add-icon" /> Delete Bulk
                    </button>
                </div>

            </div>
            {showAddForm && !showEditForm && (
                <div className="add-leave-form">
                    <h3>Add New Working Hours</h3>
                    <label>Select Employee</label>

                    <input
                        type="text"
                        list="employeesList" // Link to the datalist by id
                        placeholder="Search or select an employee"
                        value={
                            employees.find((emp) => emp.empId === formData.empId)
                                ? `${employees.find((emp) => emp.empId === formData.empId).empId
                                } ${employees.find((emp) => emp.empId === formData.empId).fName
                                } ${employees.find((emp) => emp.empId === formData.empId).lName
                                }`
                                : formData.empId || "" // Display empId, fName, and lName of the selected employee or user input
                        }
                        onChange={(e) => {
                            const value = e.target.value;

                            // Find the employee based on empId, fName, or lName
                            const selectedEmployee = employees.find(
                                (emp) =>
                                    `${emp.empId} ${emp.fName} ${emp.lName}` === value ||
                                    emp.empId === value ||
                                    emp.fName === value ||
                                    emp.lName === value
                            );

                            setFormData({
                                ...formData,
                                empId: selectedEmployee ? selectedEmployee.empId : value, // Update empId if matched, otherwise store raw input
                            });
                        }}
                    />

                    <datalist id="employeesList">
                        {employees.map((emp) => (
                            <option
                                key={emp.id}
                                value={`${emp.empId} ${emp.fName} ${emp.lName}`} // Format: empId fName lName
                            />
                        ))}
                    </datalist>

                    <div className="form-time">
                        <div>
                            <label>First Checkin</label> <br />
                            <input
                                type="time"
                                value={formData.first_checkin}
                                onChange={(e) => setFormData({ ...formData, first_checkin: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Last Checkout</label> <br />
                            <input
                                type="time"
                                value={formData.last_checkout}
                                onChange={(e) => setFormData({ ...formData, last_checkout: e.target.value })}
                            />
                        </div>
                    </div>
                    <label>Working Hours</label>
                    <input
                        type="number"
                        placeholder="Working Hours"
                        value={formData.calcHours}
                        onChange={(e) => setFormData({ ...formData, calcHours: e.target.value })}
                    />

                    <label>Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <button className="submit-button" onClick={addAssign}>
                        Add Working Hours
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            )}
            {showEditForm && (
                <div className="add-leave-form">
                    <h3>Edit Working Hours</h3>

                    <input
                        type="text"
                        list="employeesList" // Link to the datalist by id
                        disabled
                        placeholder="Search or select an employee"
                        value={
                            employees.find((emp) => emp.empId === formData.empId)
                                ? `${employees.find((emp) => emp.empId === formData.empId).empId
                                } ${employees.find((emp) => emp.empId === formData.empId).fName
                                } ${employees.find((emp) => emp.empId === formData.empId).lName
                                }`
                                : formData.empId || "" // Display empId, fName, and lName of the selected employee or user input
                        }
                        onChange={(e) => {
                            const value = e.target.value;

                            // Find the employee based on empId, fName, or lName
                            const selectedEmployee = employees.find(
                                (emp) =>
                                    `${emp.empId} ${emp.fName} ${emp.lName}` === value ||
                                    emp.empId === value ||
                                    emp.fName === value ||
                                    emp.lName === value
                            );

                            setFormData({
                                ...formData,
                                empId: selectedEmployee ? selectedEmployee.empId : value, // Update empId if matched, otherwise store raw input
                            });
                        }}
                    />

                    <datalist id="employeesList">
                        {employees.map((emp) => (
                            <option
                                key={emp.id}
                                value={`${emp.empId} ${emp.fName} ${emp.lName}`} // Format: empId fName lName
                            />
                        ))}
                    </datalist>


                    <div className="form-time">
                        <div>
                            <label>First Checkin</label> <br />
                            <input
                                type="time"
                                value={formData.first_checkin}
                                onChange={(e) => setFormData({ ...formData, first_checkin: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Last Checkout</label> <br />
                            <input
                                type="time"
                                value={formData.last_checkout}
                                onChange={(e) => setFormData({ ...formData, last_checkout: e.target.value })}
                            />
                        </div>
                    </div>
                    <label>Working Hours</label>
                    <input
                        type="number"
                        placeholder="Working Hours"
                        value={formData.calcHours}
                        onChange={(e) => setFormData({ ...formData, calcHours: e.target.value })}
                    />

                    <label>Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <button
                        className="submit-button"
                        onClick={() => updateAssign(formData)}
                    >
                        Update Working Hours
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
                            <th>
                                <input
                                    id="delete-checkbox"
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>First Checkin</th>
                            <th>Last Checkout</th>
                            <th>Working Hours</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((bonus) => (
                            <tr key={bonus.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="delete-checkbox"
                                        checked={selectedIds.includes(bonus.id)}
                                        onChange={(event) => handleRowCheckboxChange(event, bonus.id)}
                                    />
                                </td>
                                <td>{bonus.empId}</td>
                                <td className="bold-fonts">{bonus.empName}</td>
                                <td className="bold-fonts">{bonus.first_checkin}</td>
                                <td className="bold-fonts">{bonus.last_checkout}</td>
                                <td>{bonus.calcHours}</td>
                                <td>{bonus.date}</td>
                                <td>
                                    <button
                                        // className="edit-button"
                                        onClick={() => handleEdit(bonus)}
                                        style={{ background: "none", border: "none" }}
                                    >
                                        <FaEdit className="table-edit" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bonus.id)}
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

export default WorkingHours;
