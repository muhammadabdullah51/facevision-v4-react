import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import axios from "axios";
import "../../Dashboard/dashboard.css";
import AssignBonus from "./assignBonus";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";

import { SERVER_URL } from "../../../config";

const Bonuses = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    bonusName: "",
    bonusDuration: "",
    bonusAmount: "",
    bonusDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const [loading, setLoading] = useState(false); // Loading state

  const fetchBouneses = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-bns/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching bonus data:", error);
    }
  }, [setData]);

  useEffect(() => {
    fetchBouneses();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchBouneses, successModal]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });
  };
  const confirmDelete = async () => {
    axios.post(`${SERVER_URL}pyr-bns-del/`, {
      id: formData.id,
    });
    const updatedData = await axios.get(`${SERVER_URL}pyr-bns/`);
    setData(updatedData.data);
    setShowModal(false);
    setSuccessModal(true);
    fetchBouneses();
  };

  const handleAddNew = () => {
    setFormData({
      bonusName: "",
      bonusDuration: "",
      bonusAmount: "",
      bonusDate: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addBonus = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      !formData.bonusName ||
      !formData.bonusDuration ||
      !formData.bonusAmount ||
      !formData.bonusDate
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }
    if (formData.bonusDuration < 1 || formData.bonusAmount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const bouneses = {
      bonusName: formData.bonusName,
      bonusDuration: formData.bonusDuration,
      bonusAmount: formData.bonusAmount,
      bonusDate: formData.bonusDate,
    };
    try {
      axios.post(`${SERVER_URL}pyr-bns/`, bouneses);
      const updatedData = await axios.get(`${SERVER_URL}pyr-bns/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false)
      fetchBouneses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (data) => {
    setFormData({
      id: data.id,
      bonusName: data.bonusName,
      bonusDuration: data.bonusDuration,
      bonusAmount: data.bonusAmount,
      bonusDate: data.bonusDate,
    });
    setShowEditForm(true)
  };

  const updateBonus = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      bonusName: row.bonusName,
      bonusDuration: row.bonusDuration,
      bonusAmount: row.bonusAmount,
      bonusDate: row.bonusDate,
    })
    setShowModal(true);
  }
  const confirmUpdate = async () => {
    if (
      !formData.bonusName ||
      !formData.bonusDuration ||
      !formData.bonusAmount ||
      !formData.bonusDate
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }
    if (formData.bonusDuration < 1 || formData.bonusAmount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updateBounses = {
      id: formData.id,
      bonusName: formData.bonusName,
      bonusDuration: formData.bonusDuration,
      bonusAmount: formData.bonusAmount,
      bonusDate: formData.bonusDate,
      
    };
    console.log(updateBounses);
    try {
      await axios.post(`${SERVER_URL}pyr-bns-up/`, updateBounses);
      const updatedData = await axios.get(`${SERVER_URL}pyr-bns/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchBouneses();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.bonusName.toLowerCase().includes(searchQuery.toLowerCase())
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
          <FaPlus /> Add New Bonus
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Bonus</h3>
          <label>Bonus Name</label>
          <input
            type="text"
            placeholder="Bonus Name"
            value={formData.bonusName}
            onChange={(e) =>
              setFormData({ ...formData, bonusName: e.target.value })
            }
          />
          <label>Bonus Duration</label>
          <select
            className="bonus-duration"
            value={formData.bonusDuration}
            onChange={(e) =>
              setFormData({ ...formData, bonusDuration: e.target.value })
            }
          >
            <option value="">Select Duration</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="3-Month">3-Month</option>
            <option value="6-Month">6-Month</option>
            <option value="Yearly">Yearly</option>
          </select>

          <label>Bonus Amount</label>
          <input
            type="number"
            placeholder="Bonus Amount"
            value={formData.bonusAmount}
            onChange={(e) =>
              setFormData({ ...formData, bonusAmount: e.target.value })
            }
          />
          <label>Bonus Date</label>
          <input
            type="date"
            placeholder="Bonus Date"
            value={formData.bonusDate}
            onChange={(e) =>
              setFormData({ ...formData, bonusDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={addBonus}>Add Bonus</button>
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Edit Bonus</h3>
          <label>Bonus Name</label>
          <input
            type="text"
            placeholder="Bonus Name"
            value={formData.bonusName}
            onChange={(e) =>
              setFormData({ ...formData, bonusName: e.target.value })
            }
          />
          <label>Bonus Duration</label>
          <select
            className="bonus-duration"
            value={formData.bonusDuration}
            onChange={(e) =>
              setFormData({ ...formData, bonusDuration: e.target.value })
            }
          >
            <option value="">Select Duration</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="3-Month">3-Month</option>
            <option value="6-Month">6-Month</option>
            <option value="Yearly">Yearly</option>
          </select>
          <label>Bonus Amount</label>
          <input
            type="number"
            placeholder="Bonus Amount"
            value={formData.bonusAmount}
            onChange={(e) =>
              setFormData({ ...formData, bonusAmount: e.target.value })
            }
          />
          <label>Bonus Date</label>
          <input
          readOnly
            type="date"
            placeholder="Bonus Date"
            value={formData.bonusDate}
            onChange={(e) =>
              setFormData({ ...formData, bonusDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={()=> updateBonus(formData)}>Update Bonus</button>
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      )}

      <div className="departments-table">
        <table className="table">
          <thead>
            <tr>
              <th>Bonus ID</th>
              <th>Bonus Name</th>
              <th>Bonus Duration</th>
              <th>Bonus Amount</th>
              <th>Bonus Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bonus) => (
              <tr key={bonus._id}>
                <td>{bonus.id}</td>
                <td className="bold-fonts">{bonus.bonusName}</td>
                <td>{bonus.bonusDuration}</td>
                <td>{bonus.bonusAmount}</td>
                <td>{bonus.bonusDate}</td>
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
      <AssignBonus />
    </div>
  );
};

export default Bonuses;
