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

const Loan = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    givenLoan: "",
    returnInMonths: "",
    paidAmount: "",
    pendingAmount: "",
    nextMonthPayable: "",
    reason: "",
    date: "",
    status: "Pending",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchLoan = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-loan/`);
      console.log(response.data);
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

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  // Delete an givenLoan
  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });
    console.log(formData)
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
    setFormData({
      empId: "",
      givenLoan: "",
      returnInMonths: "",
      reason: "",
      date: "",
      status: "Pending",
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
      !formData.givenLoan ||
      !formData.returnInMonths ||
      !formData.reason ||
      !formData.date ||
      !formData.status
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.givenLoan < 1 || formData.returnInMonths < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const newLoan = {
      empId: formData.empId,
      givenLoan: formData.givenLoan,
      returnInMonths: formData.returnInMonths,
      date: formData.date,
      reason: formData.reason,
      status: formData.status,
    };
    console.log(newLoan);
    try {
      await axios.post(`${SERVER_URL}pyr-loan/`, newLoan);
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
      id: data.id,
      empId: data.empId,
      givenLoan: data.givenLoan,
      returnInMonths: data.returnInMonths,
      paidAmount: data.paidAmount,
      date: data.date,
      reason: data.reason,
      status: data.status,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateLoan = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      empId: row.empId,
      givenLoan: row.givenLoan,
      returnInMonths: row.returnInMonths,
      paidAmount: row.paidAmount,
      reason: row.reason,
      date: row.date,
      status: row.status,
    });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (
      !formData.givenLoan ||
      !formData.returnInMonths ||
      !formData.reason ||
      !formData.date 
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.givenLoan < 1 || formData.returnInMonths < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    try {
      const updateLoan = {
        id: formData.id,
        givenLoan: formData.givenLoan,
        returnInMonths: formData.returnInMonths,
        paidAmount: formData.paidAmount,
        reason: formData.reason,
        date: formData.date,
        status: formData.status,
      };
      console.log(updateLoan);
      await axios.post(`${SERVER_URL}pyr-loan-up/`, updateLoan);
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
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.paid?.toLowerCase().includes(searchQuery) ||
      item.pendingAmount?.toLowerCase().includes(searchQuery) ||
      item.givenLoan?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={ `Are you sure you want to ${modalType} this Loan?`}
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
        message={`Loan ${modalType}d successfully!`}
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
          <FaPlus /> Add New Loan
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Loan</h3>
          <label>Select Employee</label>
          <input
            list="employeesList"
            value={formData.empId} // display the employee's name
            onChange={(e) => {
              setFormData({ ...formData, empId: e.target.value });
            }}
            placeholder="Search or select an employee"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              // Display employee's full name as option value
              <option key={emp.empId} value={emp.empId}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </datalist>
          <label>Given Loan</label>
          <input
            type="number"
            placeholder="Given Loan"
            value={formData.givenLoan}
            onChange={(e) =>
              setFormData({ ...formData, givenLoan: e.target.value })
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
            value={formData.status}
            onChange={(e) => 
              setFormData({...formData, status: e.target.value})
            }
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button className="submit-button" onClick={addLoan}>
            Add Loan
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
            readOnly
            list="employeesList"
            value={formData.empId} // display the employee's name
            onChange={(e) => {
              setFormData({ ...formData, empId: e.target.value });
            }}
            placeholder="Search or select an employee"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              // Display employee's full name as option value
              <option key={emp.empId} value={emp.empId}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </datalist>
          <label>Given Loan</label>
          <input
            type="number"
            placeholder="Given Loan"
            value={formData.givenLoan}
            onChange={(e) =>
              setFormData({ ...formData, givenLoan: e.target.value })
            }
          />

         
              <label>Return In Months</label>
              <input
                type="number"
                placeholder="Return In Months"
                value={formData.returnInMonths}
                onChange={(e) =>
                  setFormData({ ...formData, returnInMonths: e.target.value })
                }
              />
        
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
          <label>Selected Status</label>
          <select
            value={formData.status}
            onChange={(e) => 
              setFormData({...formData, status: e.target.value})
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
                    className={`status ${
                      adv.status === "Rejected"
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

export default Loan;
