import React, { useState, useEffect, useCallback } from "react";
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


import { useDispatch, useSelector } from "react-redux";
import { setAssignAppraisalsData, resetAssignAppraisalsData } from "../../../redux/assignAppraisalsSlice";


const AssignAppraisal = () => {
    const [data, setData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [appraisal, setAppraisal] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch = useDispatch();
    const assignAppraisalData = useSelector((state) => state.assignAppraisals);

    const [formData, setFormData] = useState(
        assignAppraisalData || {
            id: "",
            appr_id: "",
            empId: "",
            assign_date: "",
            status: "",
            desc: "",
        });

    const handleReset = () => {
        dispatch(resetAssignAppraisalsData());
        setFormData({
            id: "",
            appr_id: "",
            empId: "",
            assign_date: "",
            status: "",
            desc: "",
        });
        setShowAddForm(false);
        setShowEditForm(false);
    };

    const [editFormData, setEditFormData] = useState({
        id: "",
        appr_id: "",
        empId: "",
        assign_date: "",
        status: "",
        desc: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => {
            const updatedFormData = { ...prevState, [name]: value };
            dispatch(setAssignAppraisalsData(updatedFormData));

            return updatedFormData;
        });
    };

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [successModal, setSuccessModal] = useState(false);

    const [warningModal, setWarningModal] = useState(false);
    const [resMsg, setResMsg] = useState("");

    const fetchEmployeesExtraFund = useCallback(async () => {
        try {
            const response = await axios.get(`${SERVER_URL}pyr-asg-appr/`);
            setData(response.data);
        } catch (error) {
        }
    }, [setData]);
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}pr-emp/`);
            setEmployees(response.data);
        } catch (error) {
        }
    };

    const fetchAppraisals = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}pyr-appr/`);
            setAppraisal(response.data);

        } catch (error) {
        }
    };

    useEffect(() => {
        fetchEmployeesExtraFund();
        fetchEmployees();
        fetchAppraisals();
        let timer;
        if (successModal) {
            timer = setTimeout(() => {
                setSuccessModal(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [fetchEmployeesExtraFund, successModal]);

    const handleDelete = async (id) => {
        setModalType("delete");
        setShowModal(true);
        setFormData({ ...formData, id: id });
    };
    const confirmDelete = async () => {
        try {
            await axios.delete(`${SERVER_URL}pyr-asg-appr/${formData.id}/`);
            await fetchEmployeesExtraFund(); // Refresh data after deletion
            setShowModal(false);
            setSuccessModal(true);
        } catch (error) {
        }
    };

    const handleAddNew = () => {
        setShowAddForm(true);
        setShowEditForm(false);
    };
    const addAssign = () => {
        setModalType("create");
        setShowModal(true);
    };

    const confirmAdd = async () => {
        if (
            !formData.empId ||
            !formData.appr_id ||
            !formData.assign_date ||
            !formData.status ||
            !formData.desc
        ) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        await axios.post(`${SERVER_URL}pyr-asg-appr/`, formData);
        setShowModal(false);
        setSuccessModal(true);
        setShowAddForm(false);
        fetchEmployeesExtraFund();
        handleReset();
    };

    const handleEdit = (item) => {
        setEditFormData({
            id: item.id,
            appr_id: Number(item.appr_id),
            empId: item.empIdVal,
            assign_date: item.assign_date,
            status: item.status,
            desc: item.desc,
        });
        console.log(editFormData)
        setShowAddForm(false);
        setShowEditForm(true);
    };
    const updateAssign = (row) => {
        setModalType("update");
        setEditFormData({ ...editFormData });
        setShowModal(true);
    };
    const confirmUpdate = async () => {
        if (
            !editFormData.empId ||
            !editFormData.appr_id ||
            !editFormData.assign_date ||
            !editFormData.status ||
            !editFormData.desc
        ) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        console.log(editFormData);

        await axios.put(`${SERVER_URL}pyr-asg-appr/${editFormData.id}/`, editFormData);
        setShowModal(false);
        setSuccessModal(true);
        setShowEditForm(false);
        fetchEmployeesExtraFund();
        handleReset();
    };




    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const filteredData = data.filter((item) =>
        item.empIdVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.appraisalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assign_date?.toString().includes(searchQuery) ||
        item.appr_id?.toString().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())

    );


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
            await axios.post(`${SERVER_URL}asgnbonus/del/data`, payload);
            const updatedData = await axios.get(`${SERVER_URL}pyr-asg-bns/`);
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
                        ? `Are you sure you want to confirm Assign Appraisals?`
                        : modalType === "update"
                            ? "Are you sure you want to update Assigned Appraisals?"
                            : modalType === "delete selected"
                                ? "Are you sure you want to delete selected items?"
                                : `Are you sure you want to delete Assigned Appraisals?`
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
                        : `Assign Appraisals ${modalType}d successfully!`
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
                        <FaPlus /> Assign New Appraisals
                    </button>
                    <button className="add-button submit-button" onClick={handleBulkDelete}>
                        <FaTrash className="add-icon" /> Delete Bulk
                    </button>
                </div>
            </div>
            {showAddForm && !showEditForm && (
                <div className="add-leave-form">
                    <h3>Assign Appraisals to Employee</h3>
                    <label>Select Employee</label>
                    <input
                        list="employeesList"
                        value={
                            employees.find((emp) => emp.empId === formData.empId)
                                ? `${employees.find((emp) => emp.empId === formData.empId).empId
                                } ${employees.find((emp) => emp.empId === formData.empId).fName
                                } ${employees.find((emp) => emp.empId === formData.empId).lName
                                }`
                                : formData.empId || "" // Display empId, fName, and lName of selected employee or inputted empId
                        }
                        onChange={(e) => {
                            const value = e.target.value;
                            const selectedEmployee = employees.find(
                                (emp) =>
                                    `${emp.empId} ${emp.fName} ${emp.lName}` === value ||
                                    emp.empId === value
                            );

                            setFormData({
                                ...formData,
                                empId: selectedEmployee ? selectedEmployee.empId : value, // Store empId or raw input
                            });
                        }}
                        placeholder="Search or select an employee"
                    />

                    <datalist id="employeesList">
                        {employees.map((emp) => (
                            <option
                                key={emp.empId}
                                value={`${emp.empId} ${emp.fName} ${emp.lName}`}
                            >
                                {emp.empId} {emp.fName} {emp.lName}
                            </option>
                        ))}
                    </datalist>
                    <label>Select Appraisals</label>
                    <select
                        name="appr_id"
                        value={formData.appr_id}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Appraisals</option>
                        {appraisal.map((bonus) => (
                            <option key={bonus.id} value={bonus.id}>
                                {bonus.name}
                            </option>
                        ))}
                    </select>
                    <label>Assign Date</label>
                    <input
                        type="date"
                        name="assign_date"
                        value={formData.assign_date}
                        onChange={handleInputChange}
                    />
                    <label>Select Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <label>Description</label>
                    <textarea
                        placeholder="Description"
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                    />
                    <button className="submit-button" onClick={addAssign}>
                        Assign Appraisals
                    </button>
                    <button className="cancel-button" onClick={handleReset}>
                        Cancel
                    </button>
                </div>
            )}
            {showEditForm && (
                <div className="add-leave-form">
                    <h3>Update Assigned Appraisals</h3>
                    <label>Selected Employee</label>
                    <input
                        list="employeesList"
                        disabled
                        value={
                            employees.find((emp) => emp.empId === editFormData.empId)
                                ? `${employees.find((emp) => emp.empId === editFormData.empId).empId
                                } ${employees.find((emp) => emp.empId === editFormData.empId).fName
                                } ${employees.find((emp) => emp.empId === editFormData.empId).lName
                                }`
                                : editFormData.empId || "" // Display empId, fName, and lName of selected employee or inputted empId
                        }
                        onChange={(e) => {
                            const value = e.target.value;
                            const selectedEmployee = employees.find(
                                (emp) =>
                                    `${emp.empId} ${emp.fName} ${emp.lName}` === value ||
                                    emp.empId === value
                            );

                            setEditFormData({
                                ...editFormData,
                                empId: selectedEmployee ? selectedEmployee.empId : value, // Store empId or raw input
                            });
                        }}
                        placeholder="Search or select an employee"
                    />

                    <datalist id="employeesList">
                        {employees.map((emp) => (
                            <option
                                key={emp.empId}
                                value={`${emp.empId} ${emp.fName} ${emp.lName}`}
                            >
                                {emp.empId} {emp.fName} {emp.lName}
                            </option>
                        ))}
                    </datalist>


                    <label>Select Appraisals</label>
                    <select
                        // disabled
                        name="appr_id"
                        value={editFormData.appr_id}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, appr_id: e.target.value })
                        }
                    >
                        <option value="">Select Appraisals</option>
                        {appraisal.map((bonus) => (
                            <option key={bonus.id} value={bonus.id}>
                                {bonus.name}
                            </option>
                        ))}
                    </select>
                    <label>Assign Date</label>
                    <input
                        type="date"
                        name="assign_date"
                        value={editFormData.assign_date}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, assign_date: e.target.value })
                        }
                    />
                    <label>Select Status</label>

                    <select
                        value={editFormData.status}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, status: e.target.value })
                        }
                    >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <label>Description</label>
                    <textarea
                        placeholder="Description"
                        name="desc"
                        value={editFormData.desc}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, desc: e.target.value })
                        }
                    />
                    <button
                        className="submit-button"
                        onClick={() => updateAssign(editFormData)}
                    >
                        Update Assigned Appraisals
                    </button>
                    <button className="cancel-button" onClick={handleReset}>
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
                            <th>Appraisal ID</th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Appraisal Name</th>
                            <th>Amount</th>
                            <th>Assign Date</th>
                            <th>Status</th>
                            <th>Description</th>
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
                                <td>{bonus.appr_id}</td>
                                <td>{bonus.empIdVal}</td>
                                <td className="bold-fonts">{bonus.empName}</td>
                                <td className="bold-fonts">{bonus.appraisalName}</td>
                                <td>{bonus.appraisalAmount}</td>
                                <td>{bonus.assign_date}</td>
                                <td>
                                    <span
                                        className={`status ${bonus.status === "Pending"
                                            ? "lateStatus"
                                            : bonus.status === "Rejected"
                                                ? "absentStatus"
                                                : "presentStatus"
                                            }`}
                                    >
                                        {bonus.status}
                                    </span>
                                </td>
                                <td>{bonus.desc}</td>
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

export default AssignAppraisal;
