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
import { setBonusData, resetBonusData } from "../../../redux/bonusSlice";

const BonusTable = () => {
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const dispatch = useDispatch();
  const bonusData = useSelector((state) => state.bonus);

  const [formData, setFormData] = useState(
    bonusData|| {
    id: "",
    bonusName: "",
    bonusDuration: "",
    bonusAmount: "",
    bonusDate: "",
  });

  const handleReset = () => {
    dispatch(resetBonusData());
    setFormData({
      id: "",
      bonusName: "",
      bonusDuration: "",
      bonusAmount: "",
      bonusDate: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    bonusName: "",
    bonusDuration: "",
    bonusAmount: "",
    bonusDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setBonusData(updatedFormData));
      return updatedFormData;
    });
  };


  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");



  const fetchBouneses = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-bns/`);
      setData(response.data);
    } catch (error) {
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


  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });
  };
  const confirmDelete = async () => {
    axios.post(`${SERVER_URL}pyr-bns-del/${formData.id}/`, {
      id: formData.id,
    });
    const updatedData = await axios.get(`${SERVER_URL}pyr-bns/`);
    setData(updatedData.data);
    setShowModal(false);
    setSuccessModal(true);
    fetchBouneses();
  };

  const handleAddNew = () => {
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
      handleReset()
    } catch (error) {
    }
  };

  const handleEdit = (data) => {
    setEditFormData({
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
    setEditFormData({ ...editFormData });
    setShowModal(true);
  }
  const confirmUpdate = async () => {
    if (
      !editFormData.bonusName ||
      !editFormData.bonusDuration ||
      !editFormData.bonusAmount ||
      !editFormData.bonusDate
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }
    if (editFormData.bonusDuration < 1 || editFormData.bonusAmount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updateBounses = {
      id: editFormData.id,
      bonusName: editFormData.bonusName,
      bonusDuration: editFormData.bonusDuration,
      bonusAmount: editFormData.bonusAmount,
      bonusDate: editFormData.bonusDate,

    };
    try {
      await axios.post(`${SERVER_URL}pyr-bns-up/`, updateBounses);
      const updatedData = await axios.get(`${SERVER_URL}pyr-bns/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchBouneses();
      handleReset()
    } catch (error) {
    }
  }


  const filteredData = data.filter((item) =>
    item.bonusName.toLowerCase().includes(searchQuery.toLowerCase())
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
      await axios.post(`${SERVER_URL}bonus/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pyr-bns/`);
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
            : `Are you sure you want to ${modalType} this Bonus?`
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
            : `Bonus ${modalType}d successfully!`
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
            <FaPlus /> Add New Bonus
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Bonus</h3>
          <label>Bonus Name</label>
          <input
            type="text"
            name="bonusName"
            placeholder="Bonus Name"
            value={formData.bonusName}
            onChange={handleInputChange}
          />
          <label>Bonus Duration</label>
          <select
            className="bonus-duration"
            name="bonusDuration"
            value={formData.bonusDuration}
            onChange={handleInputChange}
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
            name="bonusAmount"
            placeholder="Bonus Amount"
            value={formData.bonusAmount}
            onChange={handleInputChange}
          />
          <label>Bonus Date</label>
          <input
            type="date"
            name="bonusDate"
            placeholder="Bonus Date"
            value={formData.bonusDate}
            onChange={handleInputChange}
          />
          <button className="submit-button" onClick={addBonus}>Add Bonus</button>
          <button className="cancel-button" onClick={handleReset}>Cancel</button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Edit Bonus</h3>
          <label>Bonus Name</label>
          <input
            type="text"
            placeholder="Bonus Name"
            value={editFormData.bonusName}
            onChange={(e) =>
              setEditFormData({ ...editFormData, bonusName: e.target.value })
            }
          />
          <label>Bonus Duration</label>
          <select
            className="bonus-duration"
            value={editFormData.bonusDuration}
            onChange={(e) =>
              setEditFormData({ ...editFormData, bonusDuration: e.target.value })
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
            value={editFormData.bonusAmount}
            onChange={(e) =>
              setEditFormData({ ...editFormData, bonusAmount: e.target.value })
            }
          />
          <label>Bonus Date</label>
          <input
            readOnly
            type="date"
            placeholder="Bonus Date"
            value={editFormData.bonusDate}
            onChange={(e) =>
              setEditFormData({ ...editFormData, bonusDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={() => updateBonus(editFormData)}>Update Bonus</button>
          <button className="cancel-button" onClick={handleReset}>Cancel</button>
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
              <th>Bonus Name</th>
              <th>Bonus Duration</th>
              <th>Bonus Amount</th>
              <th>Bonus Date</th>
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
      
    </div>
  );
};

export default BonusTable;
