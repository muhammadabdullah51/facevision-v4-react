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
import { setAdvanceSalaryData, resetAdvanceSalaryData } from "../../../redux/advanceSalarySlice";


const AdvanceSalary = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);



  const dispatch = useDispatch();
  const advSalData = useSelector((state) => state.advanceSalary);

  const [formData, setFormData] = useState(
    advSalData || {
      empId: "",
      amount: "",
      reason: "",
      date: "",
    });

  const handleReset = () => {
    dispatch(resetAdvanceSalaryData());
    setFormData({
      id: "",
      empId: "",
      first_checkin: "",
      last_checkout: "",
      calcHours: '',
      date: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    empId: "",
    first_checkin: "",
    last_checkout: "",
    calcHours: '',
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setAdvanceSalaryData(updatedFormData));
      return updatedFormData;
    });
  };


  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchAdvSalary = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-adv/`);
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
    }
  };

  const handleAddNew = () => {
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
    try {
      await axios.post(`${SERVER_URL}pyr-adv/`, advSalary);
      const updatedData = await axios.get(`${SERVER_URL}pyr-adv/`);
      setData(updatedData.data);
      setShowModal(false);
      setShowAddForm(false);
      setSuccessModal(true);
      fetchAdvSalary();
      handleReset()
    } catch (error) {
    }
  };



  const handleEdit = (data) => {
    setEditFormData({ ...data });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateAdvSalary = (row) => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    console.log(editFormData);
    if (
      editFormData.empId === "" ||
      editFormData.amount === "" ||
      editFormData.reason === "" ||
      editFormData.date === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updateAdvSalary = {
      advSalaryId: editFormData.advSalaryId,
      empId: editFormData.empId,
      amount: editFormData.amount,
      reason: editFormData.reason,
      date: editFormData.date,
    };
    try {
      axios.post(`${SERVER_URL}pyr-adv-up/`, updateAdvSalary);
      const updatedData = await axios.get(`${SERVER_URL}pyr-adv/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchAdvSalary();
      handleReset()
    } catch (error) {
    }
  };


  const filteredData = data.filter(
    (item) =>
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.date?.toLowerCase().includes(searchQuery) ||
      item.month?.toLowerCase().includes(searchQuery) ||
      item.reason?.toLowerCase().includes(searchQuery)
  );

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = filteredData.map((row) => row.advSalaryId);
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
      await axios.post(`${SERVER_URL}advsal/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pyr-adv/`);
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
            : `Are you sure you want to ${modalType} this Advance Salary?`
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
            : `Advance Salary ${modalType}d successfully!`
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
            <FaPlus /> Add New Advance Salary
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>

      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Advance Salary</h3>
          <label>Select Employee</label>
          <input
            list="employeesList"
            value={
              employees.find((emp) => emp.empId === formData.empId)
                ? `${employees.find((emp) => emp.empId === formData.empId).empId
                } ${employees.find((emp) => emp.empId === formData.empId).fName
                } ${employees.find((emp) => emp.empId === formData.empId).lName
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
            name="amount"
            placeholder="Amount"
            value={formData.amount}
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
          <label>Date</label>
          <input
            type="Date"
            name="date"
            placeholder="Date"
            value={formData.date}
            onChange={handleInputChange}

          />


          <button className="submit-button" onClick={addAdvSalary}>
            Add Advance Salary
          </button>
          <button className="cancel-button" onClick={handleReset}>
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
              employees.find((emp) => emp.empId === editFormData.empId)
                ? `${employees.find((emp) => emp.empId === editFormData.empId).empId
                } ${employees.find((emp) => emp.empId === editFormData.empId).fName
                } ${employees.find((emp) => emp.empId === editFormData.empId).lName
                }`
                : editFormData.empId || ""
            } // Display empId, fName, and lName of the selected employee or inputted empId
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
            value={editFormData.amount}
            onChange={(e) =>
              setEditFormData({ ...editFormData, amount: e.target.value })
            }
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
          <label>Date</label>
          <input
            type="Date"
            placeholder="Date"
            value={editFormData.date}
            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
          />



          <button
            className="submit-button"
            onClick={() => updateAdvSalary(editFormData)}
          >
            Update Advance Salary
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
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(adv.advSalaryId)}
                    onChange={(event) => handleRowCheckboxChange(event, adv.advSalaryId)}
                  />
                </td>
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
