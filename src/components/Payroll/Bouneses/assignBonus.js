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


const AssignBonus = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const assignBonusData = useSelector((state) => state.assignBonus);

  const [formData, setFormData] = useState(
    assignBonusData || {
      id: "",
      empId: "",
      bonusId: "",
      bonusAssignDate: "",
    });

  const handleReset = () => {
    dispatch(resetAssignBonusData());
    setFormData({
      id: "",
      empId: "",
      bonusId: "",
      bonusAssignDate: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    empId: "",
    bonusId: "",
    bonusAssignDate: "",
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

  const fetchEmployeesBonus = useCallback(async () => {
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

  const fetchBonuses = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-bns/`);
      setBonuses(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchEmployeesBonus();
    fetchEmployees();
    fetchBonuses();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchEmployeesBonus, successModal]);

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
      await fetchEmployeesBonus(); // Refresh data after deletion
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
    if (!formData.empId || !formData.bonusId || !formData.bonusAssignDate) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    await axios.post(`${SERVER_URL}pyr-asg-bns/`, formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowAddForm(false);
    fetchEmployeesBonus();
    handleReset();
  };

  const handleEdit = (item) => {
    setEditFormData({
      id: item.id,
      empId: item.empId,
      bonusId: item.bonusId,
      bonusAssignDate: item.bonusAssignDate,
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
    if (!editFormData.empId || !editFormData.bonusId || !editFormData.bonusAssignDate) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    await axios.post(`${SERVER_URL}pyr-asg-bns-up/`, editFormData);
    setShowModal(false);
    setSuccessModal(true);
    setShowEditForm(false);
    fetchEmployeesBonus();
    handleReset();
  };




  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredData = data.filter((item) =>
    item.bonusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bonusAssignDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bonusAmount.toLowerCase().includes(searchQuery.toLowerCase())

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
            ? `Are you sure you want to confirm Assign Bonus?`
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
            : `Assign Bonus ${modalType}d successfully!`
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
            <FaPlus /> Assign New Bonus
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Assign Bonus to Employee</h3>
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
          <label>Select Bonus</label>
          <select
            name="bonusId"
            value={formData.bonusId}
            onChange={handleInputChange}
          >
            <option value="">Select Bonus</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.bonusName}
              </option>
            ))}
          </select>
          <label>Date</label>
          <input
            type="date"
            name="bonusAssignDate"
            value={formData.bonusAssignDate}
            onChange={handleInputChange}
          />
          <button className="submit-button" onClick={addAssign}>
            Assign Bonus
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
          <label>Select Bonus</label>
          <select
            value={editFormData.bonusId}
            onChange={(e) =>
              setEditFormData({ ...editFormData, bonusId: e.target.value })
            }
          >
            <option value="">Select Bonus</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.bonusName}
              </option>
            ))}
          </select>
          <label>Date</label>
          <input
            type="date"
            value={editFormData.bonusAssignDate}
            onChange={(e) =>
              setEditFormData({ ...editFormData, bonusAssignDate: e.target.value })
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
              <th>Bonus ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Bonus Name</th>
              <th>Amount</th>
              <th>Awarded Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bonus) => (
              <tr key={bonus.id}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(bonus.id)}
                    onChange={(event) => handleRowCheckboxChange(event, bonus.id)}
                  />
                </td>
                <td>{bonus.id}</td>
                <td>{bonus.empId}</td>
                <td className="bold-fonts">{bonus.empName}</td>
                <td>{bonus.bonusName}</td>
                <td className="bold-fonts">{bonus.bonusAmount}</td>
                <td>{bonus.bonusAssignDate}</td>
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

export default AssignBonus;
