import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import axios from "axios";
import "../../Dashboard/dashboard.css";

import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";

const ExtraFunds = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    empName: "",
    extraFundAmount: "",
    returnInMonths: "",
    paidAmount: "",
    pendingAmount: "",
    nextMonthPayable: "",
    reason: "",
    date: "",
    type: "Pending",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchLoan = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchLoan");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Loan data:", error);
    }
  }, [setData]);
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetchEmployees"
      );
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

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  // Delete an extraFundAmount
  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`http://localhost:5000/api/deleteLoan`, {
        id: formData._id,
      });
      fetchLoan();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      id: (data.length + 1).toString(),
      empId: "",
      empName: "",
      extraFundAmount: "",
      returnInMonths: "",
      paidAmount: "",
      pendingAmount: "",
      nextMonthPayable: "",
      reason: "",
      date: "",
      type: "Pending",
    });
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
      !formData.empName ||
      !formData.extraFundAmount ||
      !formData.pending 
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newLoan = {
      id: formData.id,
      empId: formData.empId,
      empName: formData.empName,
      extraFundAmount: formData.extraFundAmount,
      returnInMonths: formData.returnInMonths,
      paidAmount: formData.paidAmount,
      pendingAmount: formData.pendingAmount,
      nextMonthPayable: formData.nextMonthPayable,
      reason: formData.reason,
      type: formData.type,
    };
    try {
      await axios.post("http://localhost:5000/api/addLoan", newLoan);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false);
      fetchLoan();
    } catch (error) {
      console.log(error);
    }
  };
  // Handle form data changes
  const handleEdit = (data) => {
    setFormData({
      _id: data._id,
      empId: data.empId,
      empName: data.empName,
      extraFundAmount: data.extraFundAmount,
      returnInMonths: data.returnInMonths,
      paidAmount: data.paidAmount,
      pendingAmount: data.pendingAmount,
      nextMonthPayable: data.nextMonthPayable,
      reason: data.reason,
      type: data.type,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateLoan = (row) => {
    setModalType("update");
    setFormData({
      _id: row._id,
      empId: row.empId,
      empName: row.empName,
      extraFundAmount: row.extraFundAmount,
      returnInMonths: row.returnInMonths,
      paidAmount: row.paidAmount,
      pendingAmount: row.pendingAmount,
      nextMonthPayable: row.nextMonthPayable,
      reason: row.reason,
      type: row.type,
    });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (
      !formData.empId ||
      !formData.empName ||
      !formData.extraFundAmount ||
      !formData.pending 
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const updateLoan = {
        _id: formData._id,
        empId: formData.empId,
        empName: formData.empName,
        extraFundAmount: formData.extraFundAmount,
        returnInMonths: formData.returnInMonths,
        paidAmount: formData.paidAmount,
        pendingAmount: formData.pendingAmount,
        nextMonthPayable: formData.nextMonthPayable,
        reason: formData.reason,
        type: formData.type,
      };
      console.log(updateLoan);
      await axios.post("http://localhost:5000/api/updateLoan", updateLoan);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchLoan();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.paid?.toLowerCase().includes(searchQuery) ||
      item.pending?.toLowerCase().includes(searchQuery) ||
      item.extraFundAmount?.toLowerCase().includes(searchQuery)
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
          <FaPlus /> Add New Extra Funds
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Extra Funds</h3>
          <input
            type="text"
            placeholder="Loan ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            readOnly
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
          <input
            type="Number"
            placeholder="Given Loan"
            value={formData.extraFundAmount}
            onChange={(e) =>
              setFormData({ ...formData, extraFundAmount: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Paid Amount"
            value={formData.paidAmount}
            onChange={(e) =>
              setFormData({ ...formData, paidAmount: e.target.value })
            }
          />
          <input
            type="number"
            name="pending"
            placeholder="Pending Amount"
            value={formData.pending}
            onChange={(e) =>
              setFormData({ ...formData, pending: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Return In Months"
            value={formData.returnInMonths}
            onChange={(e) =>
              setFormData({ ...formData, returnInMonths: e.target.value })
            }
          />
          <input
            type="Number"
            placeholder="Next Month Payable"
            value={formData.nextMonthPayable}
            onChange={(e) =>
              setFormData({ ...formData, nextMonthPayable: e.target.value })
            }
          />
         

          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
             <option value="">Select Type</option>
            <option value="payable">Payable</option>
            <option value="NotPayable">Not Payable</option>
          </select>

          <button className="submit-button" onClick={addLoan}>
            Add Extra Funds
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Loan</h3>
          <input
            type="text"
            placeholder="Loan ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            readOnly
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
          <input
            type="Number"
            placeholder="Given Loan"
            value={formData.extraFundAmount}
            onChange={(e) =>
              setFormData({ ...formData, extraFundAmount: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Paid Amount"
            value={formData.paidAmount}
            onChange={(e) =>
              setFormData({ ...formData, paidAmount: e.target.value })
            }
          />
          <input
            type="number"
            name="pending"
            placeholder="Pending Amount"
            value={formData.pending}
            onChange={(e) =>
              setFormData({ ...formData, pending: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Retun In Month"
            value={formData.returnInMonths}
            onChange={(e) =>
              setFormData({ ...formData, returnInMonths: e.target.value })
            }
          />
          <input
            type="Number"
            placeholder="Next Month Payable"
            value={formData.nextMonthPayable}
            onChange={(e) =>
              setFormData({ ...formData, nextMonthPayable: e.target.value })
            }
          />
         
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="payable">Payable</option>
            <option value="NotPayable">Not Payable</option>
          </select>

          <button
            className="submit-button"
            onClick={() => updateLoan(formData)}
          >
            Update Extra Funds
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
              <tr key={adv._id}>
                <td>{adv.id}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.empName}</td>
                <td>{adv.extraFundAmount}</td>
                <td>{adv.paidAmount}</td>
                <td>{adv.pendingAmount}</td>
                <td>{adv.returnInMonths}</td>
                <td>{adv.nextMonthPayable}</td>
                <td>{adv.date}</td>
                <td>{adv.reason}</td>
                <td>
                  <span
                    className={`status ${
                      adv.type === "Pending"
                        ? "lateStatus"
                        : adv.type === "Rejected"
                        ? "absentStatus"
                        : "presentStatus"
                    }`}
                  >
                    {adv.type}
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

export default ExtraFunds;
