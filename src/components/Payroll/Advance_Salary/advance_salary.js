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

  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    empName: "",
    amount: "",
    reason: "",
    date: "",
    status: "Pending",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

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
    setFormData({
      id: data.id,
      amount: data.amount,
      reason: data.reason,
      date: data.date,
      empId: data.empId,
      empName: data.empName,
      status: data.status,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}`, {id: formData.id,});
      
      fetchAdvSalary();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting advance salary: ", error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      id: (data.length + 1).toString(),
      amount: "",
      reason: "",
      date: "",
      empId: "",
      empName: "",
      status: "",
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
      id: parseInt(formData.id, 10),
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date,
      empId: formData.empId,
      empName: formData.empName,
      status: formData.status,
    };
    try {
      await axios.post(`${SERVER_URL}`, advSalary);
      const updatedData = await axios.get(`${SERVER_URL}`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      fetchAdvSalary();
    } catch (error) {
      console.log(error);
    }
  };

  const updateAdvSalary = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      amount: row.amount,
      reason: row.reason,
      date: row.date,
      empId: row.empId,
      empName: row.empName,
      status: row.status,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    const updateAdvSalary = {
      _id: formData._id,
      id: parseInt(formData.id, 10),
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date,
      empId: formData.empId,
      empName: formData.empName,
      status: formData.status,
    };
    try {
      axios.post(`${SERVER_URL}`, updateAdvSalary);
      const updatedData = await axios.get(`${SERVER_URL}`);
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
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.date?.toLowerCase().includes(searchQuery) ||
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
            type="text"
            placeholder="Adv Salary ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            readOnly
          />
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
          <input
            type="text"
            placeholder="Employee ID"
            value={formData.empId}
            readOnly
            onChange={(e) =>
              setFormData({ ...formData, empId: e.target.value })
            }
          />
          <select
            value={formData.empName}
            onChange={(e) => {
              const selectedEmployee = employees.find(
                (emp) => `${emp.fName} ${emp.lName}` === e.target.value
              )
                setFormData({
                ...formData,
                empName: e.target.value,
                empId: selectedEmployee ? selectedEmployee.empId : null,
              });
            }}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          

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
            type="text"
            placeholder="Adv Salary ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            readOnly
          />
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
          <input
            type="text"
            placeholder="Employee ID"
            value={formData.empId}
            onChange={(e) =>
              setFormData({ ...formData, empId: e.target.value })
            }
          />
          <select
            value={formData.empName}
            onChange={(e) => {
              const selectedEmployee = employees.find(
                (emp) => `${emp.fName} ${emp.lName}` === e.target.value
              );
              setFormData({
                ...formData,
                empName: e.target.value,
                empId: selectedEmployee ? selectedEmployee.empId : null,
              });
            }}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>


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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((adv) => (
              <tr key={adv._id}>
                <td>{adv.id}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.empName}</td>
                <td className="bold-fonts">{adv.amount}</td>
                <td>{adv.reason}</td>
                <td>{adv.date}</td>
                <td>
                  <span
                    className={`status ${
                      adv.status === "Pending"
                        ? "lateStatus"
                        : adv.status === "Rejected"
                        ? "absentStatus"
                        : "presentStatus"
                    }`}
                  >
                    {adv.status}
                  </span>
                </td>
                <td>
                  <button
                    // className="edit-button"
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

export default AdvanceSalary;
