import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import axios from "axios";
import "../../Dashboard/dashboard.css";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";


const Appraisal = () => {
  const [data, setData] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    empName: "",
    appraisal: "",
    reason: "",
    date: "",
    status: "Pending",
    desc: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

 
  const fetchAppraisals = useCallback(

    async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/fetchAppraisal"
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching appraisals data:", error);
      }
    }, [setData]
  ) 
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
    fetchAppraisals();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchAppraisals, successModal]);

  const [searchQuery, setSearchQuery] = useState("");

  // Handle form data changes
  const handleEdit = (data) => {
    setFormData({
      _id: data._id,
      id: data.id,
      empId: data.empId,
      empName: data.empName,
      appraisal: data.appraisal,
      reason: data.reason,
      date: data.date,
      status: data.status,
      desc: data.desc,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  // Delete an appraisal
  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: id });
  }
  const confirmDelete = async () => {
    try {
      await axios.post(`http://localhost:5000/api/deleteAppraisal`, { id: formData._id });
      
      fetchAppraisals();
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
      appraisal: "",
      reason: "",
      date: "",
      status: "",
      desc: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addAppraisal = () => {
    setModalType("create");
    setShowModal(true);
  }
  const confirmAdd = async () => {
    const newAppraisal = {
      id: parseInt(formData.id, 10),
      empId: formData.empId,
      empName: formData.empName,
      appraisal: formData.appraisal,
      reason: formData.reason,
      date: formData.date,
      status: formData.status,
      desc: formData.desc,
    };
    try {
      await axios.post(
        "http://localhost:5000/api/addAppraisal",
        newAppraisal
      );
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchAppraisal"
      );
      setData(updatedData.data);
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
      fetchAppraisals();
    } catch (error) {
      console.log(error);
    }
  }
  const updateAppraisal = (row) => {
    setModalType("update");
    setFormData({
      _id: row._id,
      id: row.id,
      empId: row.empId,
      empName: row.empName,
      appraisal: row.appraisal,
      reason: row.reason,
      date: row.date,
      status: row.status,
      desc: row.desc,
    })
    setShowModal(true);
  }
  const confirmUpdate = async() => {
    try {
      const updateAppraisal = {
        _id: formData._id,
        id: parseInt(formData.id, 10),
        empId: formData.empId,
        empName: formData.empName,
        appraisal: formData.appraisal,
        reason: formData.reason,
        date: formData.date,
        status: formData.status,
        desc: formData.desc,
      };
      console.log(updateAppraisal);
      await axios.post(
        "http://localhost:5000/api/updateAppraisal",
        updateAppraisal
      );
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchAppraisal"
      );
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchAppraisals();
    } catch (error) {
      console.log(error);
    }
  }
 


  const filteredData = data.filter(
    (item) =>
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.date?.toLowerCase().includes(searchQuery) ||
      item.reason?.toLowerCase().includes(searchQuery) ||
      item.desc?.toLowerCase().includes(searchQuery) ||
      item.appraisal?.toLowerCase().includes(searchQuery)
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
          <FaPlus /> Add New Appraisal
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Appraisal</h3>
          <input
            type="text"
            placeholder="Appraisal ID"
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
              <option
                key={emp.empId}
                value={`${emp.fName} ${emp.lName}`}
              >
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          <input
            type="Number"
            placeholder="Appraisal"
            value={formData.appraisal}
            onChange={(e) =>
              setFormData({ ...formData, appraisal: e.target.value })
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

          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={(e) =>
              setFormData({ ...formData, desc: e.target.value })
            }
          />

          <button className="submit-button" onClick={addAppraisal}>Add Appraisal</button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Appraisal</h3>
          <input
            type="text"
            placeholder="Appraisal ID"
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
              <option
                key={emp.empId}
                value={`${emp.fName} ${emp.lName}`}
              >
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          <input
            type="Number"
            placeholder="Appraisal"
            value={formData.appraisal}
            onChange={(e) =>
              setFormData({ ...formData, appraisal: e.target.value })
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

          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={(e) =>
              setFormData({ ...formData, desc: e.target.value })
            }
          />

          <button className="submit-button" onClick={() => updateAppraisal(formData)}>Update Appraisal</button>
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
              <th>Appraisal</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((adv) => (
              <tr key={adv._id}>
                <td>{adv.id}</td>
                <td>{adv.empId}</td>
                <td className="bold-fonts">{adv.empName}</td>
                <td>{adv.appraisal}</td>
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
                <td>{adv.desc}</td>
                <td>
                  <button
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

export default Appraisal;
