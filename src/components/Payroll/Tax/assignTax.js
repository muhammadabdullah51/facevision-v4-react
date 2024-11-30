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
      console.log(response.data);
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
      console.log("Fetched bonuses:", response.data);
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
      value:'',
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
    console.log(formData);
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
    item.taxName.toLowerCase().includes(searchQuery.toLowerCase())
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
            ? `Are you sure you want to confirm Assign Tax?`
            : modalType === "update"
            ? "Are you sure you want to update Assigned Tax?"
            : `Are you sure you want to delete Assigned Tax?`
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
        message={`Assign Tax ${modalType}d successfully!`}
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
      <div className="table-header" style={{ justifyContent: "end" }}>
        <button
          className="add-button"
          onClick={handleAddNew}
          style={{ margin: "5vh 0 2vh 0", justifyContent: "end" }}
        >
          <FaPlus /> Assign New Tax
        </button>
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
                    ? `${
                        employees.find((emp) => emp.id === formData.empId).fName
                      } ${
                        employees.find((emp) => emp.id === formData.empId).lName
                      }`
                    : "" // Display the full name based on the selected ID
                }
                onChange={(e) => {
                  const selectedId = employees.find(
                    (emp) => `${emp.fName} ${emp.lName}` === e.target.value
                  )?.id;
                  setFormData({ ...formData, empId: selectedId });
                }}
              />

              <datalist id="employeesList">
                {employees.map((emp) => (
                  <option key={emp.id} value={`${emp.fName} ${emp.lName}`}>
                    {emp.fName} {emp.lName}
                  </option>
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
                  setFormData({...formData, value: e.target.value})
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
                  setFormData({...formData, value: e.target.value})
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
                  setFormData({...formData, value: e.target.value})
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
                {bonus.taxName} {bonus.amount == 0 ? bonus.percent : bonus.amount} {bonus.percent != 0 ? '%' : 'Rs'}
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
                ? `${
                    employees.find((emp) => emp.id === formData.empId).fName
                  } ${employees.find((emp) => emp.id === formData.empId).lName}`
                : "" // Display the full name based on the selected ID
            }
            onChange={(e) => {
              const selectedId = employees.find(
                (emp) => `${emp.fName} ${emp.lName}` === e.target.value
              )?.id;
              setFormData({ ...formData, empId: selectedId });
            }}
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option key={emp.id} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
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
                {bonus.taxName}
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
              <th>Bonus ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Tax Name</th>
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
                <td className="bold-fonts">{bonus.taxName}</td>
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
