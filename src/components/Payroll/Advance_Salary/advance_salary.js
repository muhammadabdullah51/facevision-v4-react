import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import axios from "axios";
import "../../Dashboard/dashboard.css";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import { SERVER_URL } from "../../../config";

const AdvanceSalary = () => {
  const [data, setData] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const date = Date()
  const [formData, setFormData] = useState({
    empId: "",
    amount: "",
    reason: "",
    date: "",
    month: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchAdvSalary = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-adv/`);
      console.log(response.data)
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
    setFormData({...data});
    console.log(formData)
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
      await axios.post(`${SERVER_URL}pyr-adv-del/`, { id: formData.advSalaryId });

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
      month: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addAdvSalary = () => {
    setModalType("create");
    setShowModal(true);
  };

  const confirmAdd = async () => {
    const advSalary = {
      empId: formData.empId,
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date,
      month:formData.month,
    };
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
      month: row.month,
    });
    console.log(formData)
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    const updateAdvSalary = {
      id: formData.advSalaryId,
      empId: formData.empId,
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date,
      month: formData.month,
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
          <h3>Edit Advance Salary</h3>
          <input
            type="Number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <input
            type="Date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <select
          value={formData.month}
          onChange={(e) =>
            setFormData({...formData, month: e.target.value })
          }
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
         
          <input
            list="employeesList"
            value={formData.empId} // This will store and display the empId
            onChange={(e) => {
              // Find the employee based on empId entered in the input
              const selectedEmployee = employees.find(
                (emp) => emp.empId === e.target.value
              );

              setFormData({
                ...formData,
                // Set empId to the selected empId from the datalist
                empId: e.target.value,
                // Set empName based on the selected empId, or empty if no match
                empName: selectedEmployee
                  ? `${selectedEmployee.fName} ${selectedEmployee.lName}`
                  : "",
              });
            }}
            placeholder="Enter or select Employee ID"
          />
          <datalist id="employeesList">
            {employees.map((emp) => (
              <option key={emp.empId} value={emp.empId}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </datalist>
          <select
            value={formData.empName}
            onChange={(e) => {
              // Find the employee based on selected name
              const selectedEmployee = employees.find(
                (emp) => `${emp.fName} ${emp.lName}` === e.target.value
              );

              setFormData({
                ...formData,
                empName: e.target.value,
                empId: selectedEmployee ? selectedEmployee.empId : null,
              });
            }}
            readOnly
          >
            <option value="">{formData.empName || "Select Employee"}</option>
          </select>
          
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
          <h3>Add New Advance Salary</h3>
          <input
            type="Number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <input
            type="Date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
           <select
          value={formData.month}
          onChange={(e) =>
            setFormData({...formData, month: e.target.value })
          }
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          

          <input
            list="employeesList"
            value={formData.empId} // This will store and display the empId
            readOnly
            onChange={(e) => {
              // Find the employee based on empId entered in the input
              const selectedEmployee = employees.find(
                (emp) => emp.empId === e.target.value
              );

              setFormData({
                ...formData,
                // Set empId to the selected empId from the datalist
                empId: e.target.value,
                // Set empName based on the selected empId, or empty if no match
                empName: selectedEmployee
                  ? `${selectedEmployee.fName} ${selectedEmployee.lName}`
                  : "",
              });
            }}
            placeholder="Enter or select Employee ID"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option key={emp.empId} value={emp.empId}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </datalist>



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
