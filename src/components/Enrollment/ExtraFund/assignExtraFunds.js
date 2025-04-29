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
import { setAssignBonusData, resetAssignBonusData } from "../../../redux/assignBonusSlice";


const AssignExtrFunds = () => {
    const [data, setData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [extraFunds, setExtraFunds] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch = useDispatch();
    const assignAppraisalData = useSelector((state) => state.assignAppraisal);

    const [formData, setFormData] = useState(
        assignAppraisalData || {
            id: "",
            extfund_id: "",
            returnInMonths: "",
            pendingAmount: "",
            nextPayable: "",
            paidAmount: "",
            empId: "",
            assign_date: "",
            status: "",
            desc: "",
        });

    const handleReset = () => {
        dispatch(resetAssignBonusData());
        setFormData({
            id: "",
            extfund_id: "",
            returnInMonths: "",
            pendingAmount: "",
            nextPayable: "",
            paidAmount: "",
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
        extfund_id: "",
        returnInMonths: "",
        pendingAmount: "",
        nextPayable: "",
        paidAmount: "",
        empId: "",
        assign_date: "",
        status: "",
        desc: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => {
            const updatedFormData = { ...prevState, [name]: value };
            dispatch(setAssignBonusData(updatedFormData));
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
            const response = await axios.get(`${SERVER_URL}pyr-asg-bns/`);
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

    const fetchExtraFunds = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}pyr-ext/`);
            setExtraFunds(response.data);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchEmployeesExtraFund();
        fetchEmployees();
        fetchExtraFunds();
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
    const confirmDelete = async (id) => {
        try {
            await axios.post(`${SERVER_URL}pyr-asg-bns-del/`, {
                id: formData.id,
            });
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
        if (!formData.extfund_id ||
            !formData.returnInMonths ||
            !formData.pendingAmount ||
            !formData.nextPayable ||
            !formData.paidAmount ||
            !formData.empId ||
            !formData.assign_date ||
            !formData.status ||
            !formData.desc
        ) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        await axios.post(`${SERVER_URL}pyr-asg-bns/`, formData);
        setShowModal(false);
        setSuccessModal(true);
        setShowAddForm(false);
        fetchEmployeesExtraFund();
        handleReset();
    };

    const handleEdit = (item) => {
        setEditFormData({
            id: item.id,
            extfund_id: item.extfund_id,
            returnInMonths: item.returnInMonths,
            pendingAmount: item.pendingAmount,
            nextPayable: item.nextPayable,
            paidAmount: item.paidAmount,
            empId: item.empId,
            assign_date: item.assign_date,
            status: item.status,
            desc: item.desc,
        });
        setShowAddForm(false);
        setShowEditForm(true);
    };
    const updateAssign = (row) => {
        setModalType("update");
        setEditFormData({ ...editFormData });
        setShowModal(true);
    };
    const confirmUpdate = async () => {
        if (!editFormData.id ||
            !editFormData.extfund_id ||
            !editFormData.returnInMonths ||
            !editFormData.pendingAmount ||
            !editFormData.nextPayable ||
            !editFormData.paidAmount ||
            !editFormData.empId ||
            !editFormData.assign_date ||
            !editFormData.status ||
            !editFormData.desc) {
            setResMsg("Please fill in all required fields.");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
        await axios.post(`${SERVER_URL}pyr-asg-bns-up/`, editFormData);
        setShowModal(false);
        setSuccessModal(true);
        setShowEditForm(false);
        fetchEmployeesExtraFund();
        handleReset();
    };




    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const filteredData = data.filter((item) =>
        // item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // item.empId?.toString().includes(searchQuery)  ||
        // item.paid?.toLowerCase().includes(searchQuery) ||
        item.pendingAmount?.toLowerCase().includes(searchQuery) 
        // ||
        // item.extraFundAmount?.toLowerCase().includes(searchQuery)

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
                        ? `Are you sure you want to confirm Assign Extra Funds?`
                        : modalType === "update"
                            ? "Are you sure you want to update Assigned Bonus?"
                            : modalType === "delete selected"
                                ? "Are you sure you want to delete selected items?"
                                : `Are you sure you want to delete Assigned Bonus?`
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
                        : `Assign Extra Funds ${modalType}d successfully!`
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
                        <FaPlus /> Assign New Extra Funds
                    </button>
                    <button className="add-button submit-button" onClick={handleBulkDelete}>
                        <FaTrash className="add-icon" /> Delete Bulk
                    </button>
                </div>
            </div>
            {showAddForm && !showEditForm && (
                <div className="add-leave-form">
                    <h3>Assign Extra Funds to Employee</h3>
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
                    <label>Select Extra Funds</label>
                    <select
                        name="extfund_id"
                        value={formData.extfund_id}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Extra Funds</option>
                        {extraFunds.map((ext) => (
                            <option key={ext.id} value={ext.id}>
                                {ext.name}
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
                    <label>Select Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => {
                            const selectedType = e.target.value;
                            setFormData({
                                ...formData,
                                type: selectedType,
                                returnInMonths:
                                    selectedType === "NotPayable" ? "1" : formData.returnInMonths,
                            });
                        }}
                    >
                        <option value="">Select Type</option>
                        <option value="payable">Payable</option>
                        <option value="NotPayable">Not Payable</option>
                    </select>
                    <button className="submit-button" onClick={addAssign}>
                        Assign Extra Funds
                    </button>
                    <button className="cancel-button" onClick={handleReset}>
                        Cancel
                    </button>
                </div>
            )}
            {showEditForm && (
                <div className="add-leave-form">
                    <h3>Update Assigned Bonus</h3>
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
                    <label>Select Extra Funds</label>
                    <select
                        value={editFormData.extfund_id}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, extfund_id: e.target.value })
                        }
                    >
                        <option value="">Select Extra Funds</option>
                        {extraFunds.map((ext) => (
                            <option key={ext.id} value={ext.id}>
                                {ext.name}
                            </option>
                        ))}
                    </select>
                    <label>Assign Date</label>
                    <input
                        type="date"
                        value={editFormData.assign_date}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, assign_date: e.target.value })
                        }
                    />
                    {editFormData.type !== "NotPayable" && (
                        <>
                            <label>Return In Months</label>
                            <input
                                type="number"
                                placeholder="Return In Months"
                                value={editFormData.returnInMonths}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, returnInMonths: e.target.value })
                                }
                            />
                        </>
                    )}
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
                        placeholder="Assign Date"
                        value={editFormData.assign_date}
                        onChange={(e) => setEditFormData({ ...editFormData, assign_date: e.target.value })}
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
                    <button
                        className="submit-button"
                        onClick={() => updateAssign(editFormData)}
                    >
                        Update Assigned Bonus
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
                            <th>Extra Funds Amount</th>
                            <th>Paid Amount</th>
                            <th>Pending Amount</th>
                            <th>Return In Months</th>
                            <th>Next Month Payable</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Type</th>
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
                                <td>{adv.extraFundAmount}</td>
                                <td>{adv.paidAmount}</td>
                                <td>{adv.pendingAmount}</td>
                                <td>{adv.returnInMonths}</td>
                                <td>{adv.nextPayable}</td>
                                <td>{adv.assign_date}</td>
                                <td>{adv.reason}</td>
                                <td>
                                    <span
                                        className={`status ${adv.type === "payable"
                                            ? "absentStatus"
                                            : adv.type === "Rejected"
                                                ? "absentStatus"
                                                : "presentStatus"
                                            }`}
                                    >
                                        {adv.type}
                                    </span>
                                </td>
                                <td>
                                    {adv.type.toLowerCase() === "payable" && (
                                        <button
                                            onClick={() => handleEdit(adv)}
                                            style={{ background: "none", border: "none" }}
                                        >
                                            <FaEdit className="table-edit" />
                                        </button>
                                    )}

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

export default AssignExtrFunds;
