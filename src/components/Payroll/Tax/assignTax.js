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

const AssignTax = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [enrollSites, setEnrollSites] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    txId: "",
    date: "",
    value: "",
    assignTo: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchEmployeesBonus = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}assign-taxes/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching employee bonuses:", error);
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

  const fetchTax = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}taxes/`);
      setBonuses(response.data);
    } catch (error) {
      console.error("Error fetching bonuses:", error);
    }
  };
  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}emp-fun/`);
      setDepartments(response.data.dpt_data);
      setEnrollSites(response.data.loc_data);
      setDesignations(response.data.dsg_data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchEmployeesBonus();
    fetchEmployees();
    fetchTax();
    fetchOptions();
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
      await axios.delete(`${SERVER_URL}assign-taxes/${formData.id}/`);
      await fetchEmployeesBonus(); // Refresh data after deletion
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting bonus:", error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      empId: "",
      txId: "",
      date: "",
      assignTo: "",
      value: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addAssign = () => {
    setModalType("create");
    setShowModal(true);
  };

  const confirmAdd = async () => {
    if (!formData.txId || !formData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    await axios.post(`${SERVER_URL}assign-taxes/`, formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowAddForm(false);
    fetchEmployeesBonus();
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      empId: item.empId,
      txId: item.txId,
      date: item.date,
      value: item.value,
      assignTo: item.assignTo,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };
  const updateAssign = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      empId: row.empId,
      txId: row.txId,
      date: row.date,
      value: row.value,
      assignTo: row.assignTo,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.empId || !formData.txId || !formData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    await axios.put(`${SERVER_URL}assign-taxes/${formData.id}/`, formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowEditForm(false);
    fetchEmployeesBonus();
  };
  const handleSaveItem = async () => {
    try {
      if (formMode === "add") {
        await axios.post(`${SERVER_URL}assign-taxes/`, formData);
      } else {
        await axios.post(`${SERVER_URL}assign-taxes/`, formData);
      }
      await fetchEmployeesBonus(); // Refresh data after add/update
      resetForm();
    } catch (error) {
      console.error("Error saving bonus:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      empId: "",
      txId: "",
      date: "",
      assignTo: "",
    });
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredData = data.filter((item) =>
    item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.empTaxAmount.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.taxName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

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
      const response = await axios.post(`${SERVER_URL}asgntax/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}assign-taxes/`);
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
            ? `Are you sure you want to confirm Assign Tax?`
            : modalType === "update"
              ? "Are you sure you want to update Assigned Tax?"
              : modalType === "delete selected"
                ? "Are you sure you want to delete selected items?"
                : `Are you sure you want to delete Assigned Tax?`
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
            : `Assign Tax ${modalType}d successfully!`
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

        <div className="add-delete-conainer">
          <button className="add-button" onClick={handleAddNew}>
            <FaPlus /> Assign New Tax
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Assign Tax to Employee</h3>
          <label>Assign Tax</label>
          <select
            value={formData.assignTo}
            onChange={(e) =>
              setFormData({ ...formData, assignTo: e.target.value })
            }
          >
            <option value="">Select Options</option>
            <option value="emp">Assign to Employee</option>
            <option value="all">Assign to All Employees</option>
            <option value="byDsg">By Designation</option>
            <option value="byDpt">By Department</option>
            <option value="byLoc">By Location</option>
          </select>
          {formData.assignTo == "emp" && (
            <>
              <input
                type="text"
                list="employeesList" // Link to the datalist by id
                placeholder="Search or select an employee"
                value={
                  employees.find((emp) => emp.id === formData.empId)
                    ? `${employees.find((emp) => emp.id === formData.empId).empId
                    } ${employees.find((emp) => emp.id === formData.empId).fName
                    } ${employees.find((emp) => emp.id === formData.empId).lName
                    }`
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
            </>
          )}

          {formData.assignTo == "byLoc" && (
            <>
              <label>Enrolled Sites</label>
              <select
                name="enrollSite"
                value={formData.locId}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
              >
                <option value="">Select Enrolled Site</option>
                {enrollSites.map((site, index) => (
                  <option key={site.locId} value={site.locId}>
                    {site.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {formData.assignTo == "byDsg" && (
            <>
              <label>Designations</label>
              <select
                name="enrollSite"
                value={formData.dgsId}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
              >
                <option value="">Select Designation</option>
                {designations.map((site, index) => (
                  <option key={site.dsgId} value={site.dsgId}>
                    {site.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {formData.assignTo == "byDpt" && (
            <>
              <label>Departments</label>
              <select
                name="enrollSite"
                value={formData.dptId}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {departments.map((site, index) => (
                  <option key={site.dptId} value={site.dptId}>
                    {site.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>Select Tax Type</label>
          <select
            value={formData.txId}
            onChange={(e) => setFormData({ ...formData, txId: e.target.value })}
          >
            <option value="">Select Tax</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.taxName}{" "}
                {bonus.amount == 0 ? bonus.percent : bonus.amount}{" "}
                {bonus.percent != 0 ? "%" : "Rs"}
              </option>
            ))}
          </select>
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <button className="submit-button" onClick={addAssign}>
            Assign Tax
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Assigned Tax</h3>

          <input
            type="text"
            disabled
            list="employeesList" // Link to the datalist by id
            placeholder="Search or select an employee"
            value={
              employees.find((emp) => emp.id === formData.empId)
                ? `${employees.find((emp) => emp.id === formData.empId).empId
                } ${employees.find((emp) => emp.id === formData.empId).fName
                } ${employees.find((emp) => emp.id === formData.empId).lName}`
                : "" // Display empId, fName, and lName of the selected employee
            }
            onChange={(e) => {
              const selectedEmployee = employees.find(
                (emp) =>
                  `${emp.empId} ${emp.fName} ${emp.lName}` === e.target.value
              );
              setFormData({ ...formData, empId: selectedEmployee?.id });
            }}
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option
                key={emp.id}
                value={`${emp.empId} ${emp.fName} ${emp.lName}`} // Format: empId fName lName
              >
                {emp.empId} {emp.fName} {emp.lName}
              </option>
            ))}
          </datalist>

          <select
            value={formData.txId}
            onChange={(e) => setFormData({ ...formData, txId: e.target.value })}
          >
            <option value="">Select Tax</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.taxName}{" "}
                {bonus.amount == 0 ? bonus.percent : bonus.amount}{" "}
                {bonus.percent != 0 ? "%" : "Rs"}
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
            Update Assigned Tax
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
              <th>Tax Name</th>
              <th>Amount</th>
              <th>Date</th>
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
                <td>{bonus.employeeId}</td>
                <td className="bold-fonts">{bonus.empName}</td>
                <td className="bold-fonts">{bonus.taxName}</td>
                <td className="bold-fonts">{bonus.empTaxAmount}</td>
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

export default AssignTax;
