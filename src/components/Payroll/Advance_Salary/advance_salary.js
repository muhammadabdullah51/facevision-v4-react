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

const AdvanceSalary = () => {
  const [data, setData] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const date = Date();
  const [formData, setFormData] = useState({
    empId: "",
    amount: "",
    reason: "",
    date: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchAdvSalary = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-adv/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching AdvSalary data:", error);
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
    fetchAdvSalary();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchAdvSalary, successModal]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (data) => {
    setFormData({ ...data });
    console.log(formData);
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleDelete = async (advSalaryId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, advSalaryId: advSalaryId });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}pyr-adv-del/`, {
        id: formData.advSalaryId,
      });

      fetchAdvSalary();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting advance salary: ", error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      empId: "",
      amount: "",
      reason: "",
      date: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addAdvSalary = () => {
    setModalType("create");
    setShowModal(true);
  };

  const confirmAdd = async () => {
    if (
      formData.empId === "" ||
      formData.amount === "" ||
      formData.reason === "" ||
      formData.date === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const advSalary = {
      empId: formData.empId,
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date,
    };
    console.log(advSalary);
    try {
      await axios.post(`${SERVER_URL}pyr-adv/`, advSalary);
      const updatedData = await axios.get(`${SERVER_URL}pyr-adv/`);
      setData(updatedData.data);
      setShowModal(false);
      setShowAddForm(false);
      setSuccessModal(true);
      fetchAdvSalary();
    } catch (error) {
      console.error(error);
    }
  };

  const updateAdvSalary = (row) => {
    setModalType("update");
    setFormData({
      advSalaryId: formData.advSalaryId,
      amount: row.amount,
      reason: row.reason,
      date: row.date,
    });
    console.log(formData);
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (
      formData.empId === "" ||
      formData.amount === "" ||
      formData.reason === "" ||
      formData.date === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updateAdvSalary = {
      advSalaryId: formData.advSalaryId,
      empId: formData.empId,
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date,
    };
    try {
      axios.post(`${SERVER_URL}pyr-adv-up/`, updateAdvSalary);
      const updatedData = await axios.get(`${SERVER_URL}pyr-adv/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);

      fetchAdvSalary();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.date?.toLowerCase().includes(searchQuery) ||
      item.month?.toLowerCase().includes(searchQuery) ||
      item.reason?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this Advance Salary?`}
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
        message={`Advance Salary ${modalType}d successfully!`}
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
        <button className="add-button" onClick={handleAddNew}>
          <FaPlus /> Add New Advance Salary
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Advance Salary</h3>
          <label>Select Employee</label>
          <input
            list="employeesList"
            value={
              employees.find((emp) => emp.empId === formData.empId)
                ? `${
                    employees.find((emp) => emp.empId === formData.empId).empId
                  } ${
                    employees.find((emp) => emp.empId === formData.empId).fName
                  } ${
                    employees.find((emp) => emp.empId === formData.empId).lName
                  }`
                : formData.empId || ""
            } // Display empId, fName, and lName of the selected employee or inputted empId
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
                empName: selectedEmployee
                  ? `${selectedEmployee.fName} ${selectedEmployee.lName}`
                  : "", // Set empName based on the selected employee
              });
            }}
            placeholder="Enter or select Employee ID"
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
          <label>Advance Salary Amount</label>
          <input
            type="Number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
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

         

          <button className="submit-button" onClick={addAdvSalary}>
            Add Advance Salary
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Edit Advance Salary</h3>
          <label>Selected Employee</label>
          <input
            disabled
            list="employeesList"
            value={
              employees.find((emp) => emp.empId === formData.empId)
                ? `${
                    employees.find((emp) => emp.empId === formData.empId).empId
                  } ${
                    employees.find((emp) => emp.empId === formData.empId).fName
                  } ${
                    employees.find((emp) => emp.empId === formData.empId).lName
                  }`
                : formData.empId || ""
            } // Display empId, fName, and lName of the selected employee or inputted empId
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
                empName: selectedEmployee
                  ? `${selectedEmployee.fName} ${selectedEmployee.lName}`
                  : "", // Set empName based on the selected employee
              });
            }}
            placeholder="Enter or select Employee ID"
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
          <label>Advance Salary Amount</label>
          <input
            type="Number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
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

          

          <button
            className="submit-button"
            onClick={() => updateAdvSalary(formData)}
          >
            Update Advance Salary
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
              <th>Adv Salary ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Month</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((adv) => (
              <tr key={adv.advSalaryId}>
                <td>{adv.advSalaryId}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.empName}</td>
                <td className="bold-fonts">{adv.amount}</td>
                <td>{adv.reason}</td>
                <td>{adv.date}</td>
                <td>{adv.month}</td>
                <td>
                  <button
                    // className="edit-button"
                    onClick={() => handleEdit(adv)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(adv.advSalaryId)}
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

export default AdvanceSalary;
