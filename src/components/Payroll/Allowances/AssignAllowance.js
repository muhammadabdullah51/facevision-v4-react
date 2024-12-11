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

const AssignAllowance = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    awlcId: "",
    date: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchAssignAllowances = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}assign-allowances/`);
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

  const fetchAllowances = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}allowances/`);
      setAllowances(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchAssignAllowances();
    fetchEmployees();
    fetchAllowances();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchAssignAllowances, successModal]);

  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}assign-allowances/${formData.id}/`); // Use DELETE method and the correct URL with the `id`
      await fetchAssignAllowances(); // Refresh data after deletion
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAddNew = () => {
    setFormData({
      empId: "",
      awlcId: "",
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
    if (!formData.empId || !formData.awlcId || !formData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    await axios.post(`${SERVER_URL}assign-allowances/`, formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowAddForm(false);
    fetchAssignAllowances();
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      empId: item.empId,
      awlcId: item.awlcId,
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
      awlcId: row.awlcId,
      date: row.date,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.empId || !formData.awlcId || !formData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    try {
      // Use the PUT method and pass the `id` to update the specific resource
      await axios.put(
        `${SERVER_URL}assign-allowances/${formData.id}/`,
        formData
      );
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchAssignAllowances(); // Refresh data after updating
    } catch (error) {
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      empId: "",
      awlcId: "",
      date: "",
    });
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredData = data.filter((item) =>
    item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.allowanceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.allowanceAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "create"
            ? `Are you sure you want to confirm Assign Allowance?`
            : modalType === "update"
            ? "Are you sure you want to update Assigned Allowance?"
            : `Are you sure you want to delete Assigned Allowance?`
        }
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
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
        message={`Assign Allowance ${modalType}d successfully!`}
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
        <button
          className="add-button"
          onClick={handleAddNew}
        >
          <FaPlus /> Assign New Allowance
        </button>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Assign Allowance to Employee</h3>

          <input
            type="text"
            list="employeesList" // Link to the datalist by id
            placeholder="Search or select an employee"
            value={
              employees.find((emp) => emp.id === formData.empId)
                ? `${
                    employees.find((emp) => emp.id === formData.empId).empId
                  } ${
                    employees.find((emp) => emp.id === formData.empId).fName
                  } ${employees.find((emp) => emp.id === formData.empId).lName}`
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
                empId: selectedEmployee ? selectedEmployee.id : value, // Update empId if matched, otherwise store raw input
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

          <select
            value={formData.awlcId}
            onChange={(e) =>
              setFormData({ ...formData, awlcId: e.target.value })
            }
          >
            <option value="">Select Allowance</option>
            {allowances.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.allowanceName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <button className="submit-button" onClick={addAssign}>
            Assign Allowance
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Assigned Allowance</h3>

          <input
            disabled
            type="text"
            list="employeesList" // Link to the datalist by id
            placeholder="Search or select an employee"
            value={
              employees.find((emp) => emp.id === formData.empId)
                ? `${
                    employees.find((emp) => emp.id === formData.empId).empId
                  } ${
                    employees.find((emp) => emp.id === formData.empId).fName
                  } ${employees.find((emp) => emp.id === formData.empId).lName}`
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
                empId: selectedEmployee ? selectedEmployee.id : value, // Update empId if matched, otherwise store raw input
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

          <select
            value={formData.awlcId}
            onChange={(e) =>
              setFormData({ ...formData, awlcId: e.target.value })
            }
          >
            <option value="">Select Allowance</option>
            {allowances.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.allowanceName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <button
            className="submit-button"
            onClick={() => updateAssign(formData)}
          >
            Update Assigned Allowance
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
              <th>ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Allowance Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bonus) => (
              <tr key={bonus.id}>
                <td>{bonus.id}</td>
                <td>{bonus.employeeId}</td>
                <td className="bold-fonts">{bonus.empName}</td>
                <td className="bold-fonts">{bonus.allowanceName}</td>
                <td className="bold-fonts">{bonus.allowanceAmount}</td>
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

export default AssignAllowance;
