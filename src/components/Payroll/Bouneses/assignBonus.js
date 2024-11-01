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


const AssignBonus = () => {
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
    employee: "",
    bonus: "",
    awardedDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const fetchEmployeesBonus = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetchEmployeeBonus"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching employee bonuses:", error);
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

  const fetchBonuses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetchBouneses"
      );
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
    setFormData({ ...formData, _id: id });
  };
  const confirmDelete = async (id) => {
    try {
      await axios.post("http://localhost:5000/api/deleteEmployeeBonus", {
        id: formData._id,
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
      id: (data.length + 1).toString(),
      employee: "",
      bonus: "",
      awardedDate: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addAssign = () => {
    setModalType("create");
    setShowModal(true);
  };

  const confirmAdd = async () => {
    if (!formData.employee || !formData.bonus || !formData.awardedDate) {
      alert("Please fill in all required fields.");
      return;
    }
    await axios.post("http://localhost:5000/api/addEmployeeBonus", formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowAddForm(false);
    fetchEmployeesBonus();
  };

  const handleEdit = (item) => {
    setFormData({
      _id: item._id,
      id: item.id,
      employee: item.employee,
      bonus: item.bonus,
      awardedDate: item.awardedDate,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };
  const updateAssign = (row) => {
    setModalType("update");
    setFormData({
      _id: row._id,
      id: row.id,
      employee: row.employee,
      bonus: row.bonus,
      awardedDate: row.awardedDate,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.employee || !formData.bonus || !formData.awardedDate) {
      alert("Please fill in all required fields.");
      return;
    }
    await axios.post("http://localhost:5000/api/updateEmployeeBonus", formData);
    setShowModal(false);
    setSuccessModal(true);
    setShowEditForm(false);
    fetchEmployeesBonus();
  };
  const handleSaveItem = async () => {
    try {
      if (formMode === "add") {
        await axios.post(
          "http://localhost:5000/api/addEmployeeBonus",
          formData
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/updateEmployeeBonus",
          formData
        );
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
      employee: "",
      bonus: "",
      awardedDate: "",
    });
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredData = data.filter((item) =>
    item.bonus.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

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
            type="text"
            placeholder="ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            readOnly
          />
          <select
            value={formData.employee}
            onChange={(e) =>
              setFormData({ ...formData, employee: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          <select
            value={formData.bonus}
            onChange={(e) =>
              setFormData({ ...formData, bonus: e.target.value })
            }
          >
            <option value="">Select Bonus</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.bonusName}>
                {bonus.bonusName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.awardedDate}
            onChange={(e) =>
              setFormData({ ...formData, awardedDate: e.target.value })
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
            type="text"
            placeholder="ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            readOnly
          />
          <select
            value={formData.employee}
            onChange={(e) =>
              setFormData({ ...formData, employee: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          <select
            value={formData.bonus}
            onChange={(e) =>
              setFormData({ ...formData, bonus: e.target.value })
            }
          >
            <option value="">Select Bonus</option>
            {bonuses.map((bonus) => (
              <option key={bonus.id} value={bonus.bonusName}>
                {bonus.bonusName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.awardedDate}
            onChange={(e) =>
              setFormData({ ...formData, awardedDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={() => updateAssign(formData)}>
            Update Assign Bonus
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
            <th>Employee Name</th>
            <th>Bonus Name</th>
            <th>Awarded Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((bonus) => (
            <tr key={bonus._id}>
              <td>{bonus.id}</td>
              <td className="bold-fonts">{bonus.employee}</td>
              <td className="bold-fonts">{bonus.bonus}</td>
              <td>{bonus.awardedDate}</td>
              <td>
                <button
                  // className="edit-button"
                  onClick={() => handleEdit(bonus)}
                  style={{ background: "none", border: "none" }}
                >
                  <FaEdit className="table-edit" />
                </button>
                <button
                  onClick={() => handleDelete(bonus._id)}
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

export default AssignBonus;
