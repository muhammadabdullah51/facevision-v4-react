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

const Appraisal = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    appraisal: "",
    reason: "",
    date: "",
    status: "Pending",
    desc: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchAppraisals = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-appr/`);
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

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchAppraisals();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchAppraisals, successModal]);

  const [searchQuery, setSearchQuery] = useState("");

  // Handle form data changes
  const handleEdit = (data) => {
    setFormData({
      id: data.id,
      empId: data.empId,
      appraisal: data.appraisal,
      reason: data.reason,
      date: data.date,
      status: data.status,
      desc: data.desc,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  // Delete an appraisal
  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}pyr-appr-del/`, { id: formData.id });

      fetchAppraisals();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAddNew = () => {
    setFormData({
      empId: "",
      appraisal: "",
      reason: "",
      date: "",
      status: "",
      desc: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addAppraisal = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.empId === "" ||
      formData.appraisal === "" ||
      formData.reason === "" ||
      formData.date === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.appraisal < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const newAppraisal = {
      empId: formData.empId,
      appraisal: formData.appraisal,
      reason: formData.reason,
      date: formData.date,
      status: formData.status,
      desc: formData.desc,
    };
    try {
      await axios.post(`${SERVER_URL}pyr-appr/`, newAppraisal);
      const updatedData = await axios.get(`${SERVER_URL}pyr-appr/`);
      setData(updatedData.data);
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
      fetchAppraisals();
    } catch (error) {
    }
  };
  const updateAppraisal = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      empId: row.empId,
      empName: row.empName,
      appraisal: row.appraisal,
      reason: row.reason,
      date: row.date,
      status: row.status,
      desc: row.desc,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (
      formData.empId === "" ||
      formData.appraisal === "" ||
      formData.reason === "" ||
      formData.date === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.appraisal < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    try {
      const updateAppraisal = {
        id: formData.id,
        empId: formData.empId,
        empName: formData.empName,
        appraisal: formData.appraisal,
        reason: formData.reason,
        date: formData.date,
        status: formData.status,
        desc: formData.desc,
      };

      await axios.post(`${SERVER_URL}pyr-appr-up/`, updateAppraisal);
      const updatedData = await axios.get(`${SERVER_URL}pyr-appr/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchAppraisals();
    } catch (error) {
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.date?.toLowerCase().includes(searchQuery) ||
      item.reason?.toLowerCase().includes(searchQuery) ||
      item.desc?.toLowerCase().includes(searchQuery) ||
      item.appraisal?.toLowerCase().includes(searchQuery)
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
      await axios.post(`${SERVER_URL}appr/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pyr-appr/`);
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
            : `Are you sure you want to ${modalType} this Appraisal?`
        }
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
          else if (modalType === "update") confirmUpdate();
          else if (modalType === "delete selected") confirmBulkDelete();
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
            : `Appraisals ${modalType}d successfully!`
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
            <FaPlus /> Add New Appraisal
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Appraisal</h3>
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

          <label>Appraisal Amount</label>
          <input
            type="Number"
            placeholder="Appraisal"
            value={formData.appraisal}
            onChange={(e) =>
              setFormData({ ...formData, appraisal: e.target.value })
            }
          />

          <label>Reason</label>
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />

          <label>Date</label>
          <input
            type="Date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <label>Select Status</label>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label>Description</label>

          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          />

          <button className="submit-button" onClick={addAppraisal}>
            Add Appraisal
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Appraisal</h3>
          <label>Selected Employee</label>
          <input
            disabled
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

          <label>Appraisal Amount</label>
          <input
            type="Number"
            placeholder="Appraisal"
            value={formData.appraisal}
            onChange={(e) =>
              setFormData({ ...formData, appraisal: e.target.value })
            }
          />
          <label>Reason</label>
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <label>Date</label>
          <input
            type="Date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <label>Select Status</label>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label>Description</label>
          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          />

          <button
            className="submit-button"
            onClick={() => updateAppraisal(formData)}
          >
            Update Appraisal
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
              <th>ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Appraisal</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Description</th>
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
                <td>{adv.appraisal}</td>
                <td>{adv.reason}</td>
                <td>{adv.date}</td>
                <td>
                  <span
                    className={`status ${adv.status === "Pending"
                      ? "lateStatus"
                      : adv.status === "Rejected"
                        ? "absentStatus"
                        : "presentStatus"
                      }`}
                  >
                    {adv.status}
                  </span>
                </td>
                <td>{adv.desc}</td>
                <td>
                  <button
                    onClick={() => handleEdit(adv)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(adv._id)}
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

export default Appraisal;
