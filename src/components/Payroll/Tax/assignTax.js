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

  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    bonusId: "",
    bonusAssignDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");


  const fetchEmployeesBonus = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-asg-bns/`);
      setData(response.data);
      console.log(response.data)
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

  const fetchBonuses = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-bns/`);
      console.log("Fetched bonuses:", response.data);
      setBonuses(response.data);
    } catch (error) {
      console.error("Error fetching bonuses:", error);
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
      console.error("Error deleting bonus:", error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      empId: "",
      bonusId: "",
      bonusAssignDate: "",
    });
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
    console.log(formData)
    await axios.post(`${SERVER_URL}pyr-asg-bns/`, formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowAddForm(false);
    fetchEmployeesBonus();
  };

  const handleEdit = (item) => {
    setFormData({
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
    setFormData({
      id: row.id,
      empId: row.empId,
      bonusId: row.bonusId,
      bonusAssignDate: row.bonusAssignDate,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.empId || !formData.bonusId || !formData.bonusAssignDate) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    await axios.post(`${SERVER_URL}pyr-asg-bns-up/`, formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowEditForm(false);
    fetchEmployeesBonus();
  };
  const handleSaveItem = async () => {
    try {
      if (formMode === "add") {
        await axios.post(`${SERVER_URL}pyr-asg-bns/`, formData);
      } else {
        await axios.post(`${SERVER_URL}pyr-asg-bns/`, formData);
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
      bonusId: "",
      bonusAssignDate: "",
    });
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredData = data.filter((item) =>
    item.bonusName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  return (
    <div className="department-table">
       <ConirmationModal
        isOpen={showModal}
        message={modalType === 'create' 
          ? `Are you sure you want to confirm Assign Bonus?`
          : modalType === 'update' 
          ? 'Are you sure you want to update Assigned Bonus?'
          : `Are you sure you want to delete Assigned Bonus?`
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
        message={`Assign Bonus ${modalType}d successfully!`}
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
          <FaPlus /> Assign New Bonus
        </button>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Assign Bonus to Employee</h3>
          
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


          <select
            value={formData.bonusId}
            onChange={(e) =>
              setFormData({ ...formData, bonusId: e.target.value })
            }
          >
            <option value="">Select Bonus</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.bonusName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.bonusAssignDate}
            onChange={(e) =>
              setFormData({ ...formData, bonusAssignDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={addAssign}>
            Assign Bonus
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Assigned Bonus</h3>
          
          <input
            disabled
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


          <select
            value={formData.bonusId}
            onChange={(e) =>
              setFormData({ ...formData, bonusId: e.target.value })
            }
          >
            <option value="">Select Bonus</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.id}>
                {bonus.bonusName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.bonusAssignDate}
            onChange={(e) =>
              setFormData({ ...formData, bonusAssignDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={() => updateAssign(formData)}>
            Update Assigned Bonus
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Bonus ID</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Bonus Name</th>
            <th>Awarded Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((bonus) => (
            <tr key={bonus.id}>
              <td>{bonus.id}</td>
              <td>{bonus.empId}</td>
              <td className="bold-fonts">{bonus.empName}</td>
              <td className="bold-fonts">{bonus.bonusName}</td>
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
  );
};

export default AssignTax;
