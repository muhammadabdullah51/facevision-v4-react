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
import { setLoanData, resetLoanData } from "../../../redux/loanSlice";


const AssignLoan = () => {
    const [data, setData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const dispatch = useDispatch();
    const loanData = useSelector((state) => state.loan);
    const [formData, setFormData] = useState(
        loanData || {
            id: "",
            empId: "",
            returnInMonths: "",
            paidAmount: "",
            pendingAmount: "",
            nextPayable: "",
            reason: "",
            assign_date: "",
            applied_on: "",
            status: "Pending",
            loanId: "",
            name: ""
        });

    const handleReset = () => {
        dispatch(resetLoanData());
        setFormData({
            id: "",
            empId: "",
            returnInMonths: "",
            paidAmount: "",
            pendingAmount: "",
            nextPayable: "",
            reason: "",
            assign_date: "",
            applied_on: "",
            status: "Pending",
            loanId: "",
            name: ""
        });
        setShowAddForm(false);
        setShowEditForm(false);
    };

    const [editFormData, setEditFormData] = useState({
        id: "",
        empId: "",
        returnInMonths: "",
        paidAmount: "",
        pendingAmount: "",
        nextPayable: "",
        reason: "",
        assign_date: "",
        applied_on: "",
        status: "Pending",
        loanId: "",
        name: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => {
            const updatedFormData = { ...prevState, [name]: value };
            dispatch(setLoanData(updatedFormData));
            return updatedFormData;
        });
    };


    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [successModal, setSuccessModal] = useState(false);

    const [warningModal, setWarningModal] = useState(false);
    const [resMsg, setResMsg] = useState("");

    const fetchLoan = useCallback(async () => {
        try {
            const response = await axios.get(`${SERVER_URL}pyr-loan/`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching Loan data:", error);
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

    // Fetch the data when the component mounts
    useEffect(() => {
        fetchLoan();
        fetchEmployees();
        let timer;
        if (successModal) {
            timer = setTimeout(() => {
                setSuccessModal(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [fetchLoan, successModal]);

    const [searchQuery, setSearchQuery] = useState("");



    // Delete an givenLoan
    const handleDelete = async (id) => {
        setModalType("delete");
        setShowModal(true);
        setFormData({ ...formData, id: id });
    };
    const confirmDelete = async () => {
        try {
            await axios.post(`${SERVER_URL}pyr-loan-del/`, {
                id: formData.id,
            });
            fetchLoan();
            setShowModal(false);
            setSuccessModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddNew = () => {
        setShowAddForm(true);
        setShowEditForm(false);
    };

    const addLoan = () => {
        setModalType("create");
        setShowModal(true);
    };
    const confirmAdd = async () => {
        if (
            !formData.empId ||
            !formData.returnInMonths ||
            !formData.paidAmount ||
            !formData.pendingAmount ||
            !formData.nextPayable ||
            !formData.reason ||
            !formData.status ||
            !formData.name ||
            !formData.loanId
        ) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }

        const newLoan = {
            empId: formData.empId,
            returnInMonths: formData.returnInMonths,
            paidAmount: formData.paidAmount,
            pendingAmount: formData.pendingAmount,
            nextPayable: formData.nextPayable,
            reason: formData.reason,
            assign_date: formData.assign_date,
            applied_on: formData.applied_on,
            status: formData.status,
            loanId: formData.loanId,
            name: formData.name,
        };
        try {
            await axios.post(`${SERVER_URL}pyr-loan/`, newLoan);
            setShowModal(false);
            setSuccessModal(true);
            setShowAddForm(false);
            fetchLoan();
            handleReset()
        } catch (error) {
            console.log(error);
        }
    };
    // Handle form data changes
    const handleEdit = (data) => {
        setEditFormData({
            id: data.id,
            returnInMonths: data.returnInMonths,
            paidAmount: data.paidAmount,
            pendingAmount: data.pendingAmount,
            nextPayable: data.nextPayable,
            reason: data.reason,
            assign_date: data.assign_date,
            applied_on: data.applied_on,
            status: data.status,
            loanId: data.loanId,
            name: data.name,
        });
        setShowAddForm(false);
        setShowEditForm(true);
    };

    const updateLoan = (row) => {
        setModalType("update");
        setEditFormData({ ...editFormData });
        setShowModal(true);
    };

    const confirmUpdate = async () => {
        if (
            !editFormData.empId ||
            !editFormData.returnInMonths ||
            !editFormData.paidAmount ||
            !editFormData.pendingAmount ||
            !editFormData.nextPayable ||
            !editFormData.reason ||
            !editFormData.status ||
            !editFormData.name ||
            !editFormData.loanId
        ) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }


        try {
            const updateLoan = {
                id: editFormData.id,
                returnInMonths: editFormData.returnInMonths,
                paidAmount: editFormData.paidAmount,
                pendingAmount: editFormData.pendingAmount,
                nextPayable: editFormData.nextPayable,
                reason: editFormData.reason,
                assign_date: editFormData.assign_date,
                applied_on: editFormData.applied_on,
                status: editFormData.status,
                loanId: editFormData.loanId,
                name: editFormData.name,
            };
            await axios.post(`${SERVER_URL}pyr-loan-up/`, updateLoan);
            setShowModal(false);
            setSuccessModal(true);
            setShowEditForm(false);
            fetchLoan();
            handleReset()
        } catch (error) {
            console.log(error);
        }
    };

    const filteredData = data.filter(
        (item) =>
            item.empId?.toString().includes(searchQuery) ||
            item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.returnInMonths?.toString().includes(searchQuery) ||
            item.paidAmount?.toString().includes(searchQuery) ||
            item.pendingAmount?.toString().includes(searchQuery) ||
            item.nextPayable?.toString().includes(searchQuery) ||
            item.assign_date?.toString().includes(searchQuery) ||
            item.applied_on?.toString().includes(searchQuery) ||
            item.loanId?.toString().includes(searchQuery) ||
            item.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.status?.toLowerCase().includes(searchQuery.toLowerCase()) 
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
            await axios.post(`${SERVER_URL}loan/del/data`, payload);
            const updatedData = await axios.get(`${SERVER_URL}pyr-loan/`);
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
                    modalType === "delete selected"
                        ? "Are you sure you want to delete selected items?"
                        : `Are you sure you want to ${modalType} this Loan?`
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
                        : `Loan ${modalType}d successfully!`
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
                <div className="add-delete-conainer">
                    <button className="add-button" onClick={handleAddNew}>
                        <FaPlus /> Add New Loan
                    </button>
                    <button className="add-button submit-button" onClick={handleBulkDelete}>
                        <FaTrash className="add-icon" /> Delete Bulk
                    </button>
                </div>
            </div>

            {showAddForm && !showEditForm && (
                <div className="add-leave-form">
                    <h3>Add New Loan</h3>
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

                    <label>Given Loan</label>
                    <input
                        type="number"
                        name="givenLoan"
                        placeholder="Given Loan"
                        value={formData.givenLoan}
                        onChange={handleInputChange}

                    />
                    {formData.type !== "NotPayable" && (
                        <>
                            <label>Return In Months</label>
                            <input
                                type="number"
                                name="returnInMonths"
                                placeholder="Return In Months"
                                value={formData.returnInMonths}
                                onChange={handleInputChange}

                            />
                        </>
                    )}

                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        value={formData.date}
                        onChange={handleInputChange}

                    />
                    <label>Reason</label>
                    <input
                        type="text"
                        name="reason"
                        placeholder="Reason"
                        value={formData.reason}
                        onChange={handleInputChange}

                    />
                    <label>Select Status</label>
                    <select
                        value={formData.status}
                        name="status"
                        onChange={handleInputChange}

                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <button className="submit-button" onClick={addLoan}>
                        Add Loan
                    </button>
                    <button className="cancel-button" onClick={handleReset}>
                        Cancel
                    </button>
                </div>
            )}
            {showEditForm && (
                <div className="add-leave-form">
                    <h3>Update Loan</h3>
                    <label>Selected Employee</label>
                    <input
                        disabled
                        list="employeesList"
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

                    <label>Given Loan</label>
                    <input
                        type="number"
                        placeholder="Given Loan"
                        value={editFormData.givenLoan}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, givenLoan: e.target.value })
                        }
                    />

                    <label>Return In Months</label>
                    <input
                        type="number"
                        placeholder="Return In Months"
                        value={editFormData.returnInMonths}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, returnInMonths: e.target.value })
                        }
                    />

                    <label>Paid Amount</label>
                    <input
                        type="number"
                        placeholder="Paid Amount"
                        value={editFormData.paidAmount}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, paidAmount: e.target.value })
                        }
                    />

                    <label>Date</label>
                    <input
                        type="date"
                        placeholder="Date"
                        value={editFormData.date}
                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    />
                    <label>Reason</label>
                    <input
                        type="text"
                        placeholder="Reason"
                        value={editFormData.reason}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, reason: e.target.value })
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
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <button
                        className="submit-button"
                        onClick={() => updateLoan(formData)}
                    >
                        Update Loan
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
                            <th>ID</th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Given Loan</th>
                            <th>Paid Amount</th>
                            <th>Pending Amount</th>
                            <th>Return In Months</th>
                            <th>Next Month Payable</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((adv) => (
                            <tr key={adv.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="delete-checkbox"
                                        checked={selectedIds.includes(adv.id)}
                                        onChange={(event) => handleRowCheckboxChange(event, adv.id)}
                                    />
                                </td>
                                <td>{adv.id}</td>
                                <td>{adv.empId}</td>
                                <td className="bold-fonts">{adv.empName}</td>
                                <td>{adv.givenLoan}</td>
                                <td>{adv.paidAmount}</td>
                                <td>{adv.pendingAmount}</td>
                                <td>{adv.returnInMonths}</td>
                                <td>{adv.nextPayable}</td>
                                <td>{adv.date}</td>
                                <td>{adv.reason}</td>
                                <td>
                                    <span
                                        className={`status ${adv.status === "Rejected"
                                            ? "absentStatus"
                                            : adv.status === "Pending"
                                                ? "lateStatus"
                                                : "presentStatus"
                                            }`}
                                    >
                                        {adv.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(adv)}
                                        style={{ background: "none", border: "none" }}
                                    >
                                        <FaEdit className="table-edit" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(adv.id)}
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

export default AssignLoan;
