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

const ExtraFunds = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    empId: "",
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

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchLoan = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-ext/`);
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
    setFormData({ ...formData, id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}pyr-ext-del/`, {
        id: formData.id,
      });
      fetchLoan();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAddNew = () => {
    setFormData({
      empId: "",
      extraFundAmount: "",
      returnInMonths: "",
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
      !formData.extraFundAmount ||
      !formData.returnInMonths ||
      !formData.reason ||
      !formData.date ||
      !formData.type
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.extraFundAmount < 1 || formData.returnInMonths < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const newLoan = {
      empId: formData.empId,
      extraFundAmount: formData.extraFundAmount,
      returnInMonths: formData.returnInMonths,
      date: formData.date,
      reason: formData.reason,
      type: formData.type,
    };
    try {
      await axios.post(`${SERVER_URL}pyr-ext/`, newLoan);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false);
      fetchLoan();
    } catch (error) {
    }
  };
  // Handle form data changes
  const handleEdit = (data) => {
    setFormData({
      id: data.id,
      empId: data.empId,
      extraFundAmount: data.extraFundAmount,
      returnInMonths: data.returnInMonths,
      paidAmount: data.paidAmount,
      date: data.date,
      reason: data.reason,
      type: data.type,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateLoan = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      empId: row.empId,
      extraFundAmount: row.extraFundAmount,
      returnInMonths: row.returnInMonths,
      paidAmount: row.paidAmount,
      reason: row.reason,
      date: row.date,
    });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (
      !formData.extraFundAmount ||
      !formData.returnInMonths ||
      !formData.reason ||
      !formData.date
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.extraFundAmount < 1 || formData.returnInMonths < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    try {
      const updateLoan = {
        id: formData.id,
        extraFundAmount: formData.extraFundAmount,
        returnInMonths: formData.returnInMonths,
        paidAmount: formData.paidAmount,
        reason: formData.reason,
        date: formData.date,
      };
      await axios.post(`${SERVER_URL}pyr-ext-up/`, updateLoan);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchLoan();
    } catch (error) {
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.paid?.toLowerCase().includes(searchQuery) ||
      item.pendingAmount?.toLowerCase().includes(searchQuery) ||
      item.extraFundAmount?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          formData.type === "NotPayable"
            ? `Are you sure you want to ${modalType} this Extra Fund as NOT PAYABLE amount?`
            : `Are you sure you want to ${modalType} this Extra Fund as PAYABLE amount?`
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
        message={`Extra Fund ${modalType}d successfully!`}
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
          <FaPlus /> Add New Extra Funds
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Extra Funds</h3>
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

          <label>Given Amount</label>
          <input
            type="number"
            placeholder="Given Amount"
            value={formData.extraFundAmount}
            onChange={(e) =>
              setFormData({ ...formData, extraFundAmount: e.target.value })
            }
          />
          {formData.type !== "NotPayable" && (
            <>
              <label>Return In Months</label>
              <input
                type="number"
                placeholder="Return In Months"
                value={formData.returnInMonths}
                onChange={(e) =>
                  setFormData({ ...formData, returnInMonths: e.target.value })
                }
              />
            </>
          )}

          <label>Date</label>
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

          <label>Given Amount</label>
          <input
            type="number"
            placeholder="Given Amount"
            value={formData.extraFundAmount}
            onChange={(e) =>
              setFormData({ ...formData, extraFundAmount: e.target.value })
            }
          />

          {formData.type !== "NotPayable" && (
            <>
              <label>Return In Months</label>
              <input
                type="number"
                placeholder="Return In Months"
                value={formData.returnInMonths}
                onChange={(e) =>
                  setFormData({ ...formData, returnInMonths: e.target.value })
                }
              />
            </>
          )}
          <label>Paid Amount</label>
          <input
            type="number"
            placeholder="Paid Amount"
            value={formData.paidAmount}
            onChange={(e) =>
              setFormData({ ...formData, paidAmount: e.target.value })
            }
          />

          <label>Date</label>
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
          <label>Selected Type</label>
          <select
            disabled
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
              <tr key={adv.id}>
                <td>{adv.id}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.empName}</td>
                <td>{adv.extraFundAmount}</td>
                <td>{adv.paidAmount}</td>
                <td>{adv.pendingAmount}</td>
                <td>{adv.returnInMonths}</td>
                <td>{adv.nextPayable}</td>
                <td>{adv.date}</td>
                <td>{adv.reason}</td>
                <td>
                  <span
                    className={`status ${
                      adv.type === "payable"
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

export default ExtraFunds;
