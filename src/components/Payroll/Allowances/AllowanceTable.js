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
import AssignAllowance from "./AssignAllowance";
import { useDispatch, useSelector } from "react-redux";
import { setAllowanceData, resetAllowanceData } from "../../../redux/allowancesSlice";

const AllowanceTable = () => {
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [allSettings, setAllSettings] = useState("");

  const dispatch = useDispatch();
  const allowancesData = useSelector((state) => state.allowances);

  const [formData, setFormData] = useState(
    allowancesData || {
      id: "",
      type: "",
      amount: "",
      date: "",
    });
  const handleReset = () => {
    dispatch(resetAllowanceData());
    setFormData({
      id: "",
      type: "",
      amount: "",
      date: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    type: "",
    amount: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setAllowanceData(updatedFormData));
      return updatedFormData;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");


  const fetchAllSettings = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}allowance-types/`);
      setAllSettings(response.data);
    } catch (error) {
    }
  };

  const fetchAllowances = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}allowances/`);
      setData(response.data);
    } catch (error) {
    }
  }, [setData]);

  useEffect(() => {
    fetchAllowances();
    fetchAllSettings();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchAllowances, successModal]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}allowances/${formData.id}/`);
      const updatedData = await axios.get(`${SERVER_URL}allowances/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      fetchAllowances();
    } catch (error) {
      setShowModal(false);
      setWarningModal(true);
    }
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
    if (!formData.type || !formData.amount || !formData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }
    if (formData.amount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const bouneses = {
      type: formData.type,
      amount: formData.amount,
      date: formData.date,
    };
    try {
      axios.post(`${SERVER_URL}allowances/`, bouneses);
      const updatedData = await axios.get(`${SERVER_URL}allowances/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false);
      fetchAllowances();
      handleReset()
    } catch (error) {
    }
  };

  const handleEdit = (data) => {
    setEditFormData({
      id: data.id,
      type: data.type,
      amount: data.amount,
      date: data.date,
    });
    setShowEditForm(true);
  };

  const updateBonus = (row) => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!editFormData.type || !editFormData.amount || !editFormData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }


    const updateBonuses = {
      type: editFormData.type,
      amount: editFormData.amount,
      date: editFormData.date,
    };

    try {
      await axios.put(`${SERVER_URL}allowances/${editFormData.id}/`, updateBonuses);
      const updatedData = await axios.get(`${SERVER_URL}allowances/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchAllowances();
      handleReset()
    } catch (error) {
      setShowModal(false);
      setWarningModal(true);
    }
  };


  const filteredData = data.filter((item) =>
    item.allowanceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.amount.toLowerCase().includes(searchQuery.toLowerCase())
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
      await axios.post(`${SERVER_URL}awlc/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}allowances/`);
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
            : `Are you sure you want to ${modalType} this Allowance?`
        }
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
          else if (modalType === "update") confirmUpdate();
          else if (modalType === "delete selected") confirmBulkDelete();
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
            : `Allowance ${modalType}d successfully!`
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
            <FaPlus /> Add New Allowance
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Allowance</h3>
          <label>Allowance Type</label>
          <input
            type="text"
            list="allowanceTypesList" // Link to the datalist by id
            placeholder="Allowance Type"
            value={
              allSettings.find((setting) => setting.id === formData.type)
                ?.type || ""
            } // Display the type based on the selected id
            onChange={(e) => {
              const selectedId = allSettings.find(
                (setting) => setting.type === e.target.value
              )?.id;
              setFormData({ ...formData, type: selectedId });
            }}
          />

          <datalist id="allowanceTypesList">
            {allSettings.map((setting) => (
              // Display each allowance type from allSettings
              <option key={setting.id} value={setting.type}>
                {setting.type}
              </option>
            ))}
          </datalist>

          <label>Allowance Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Allowance Amount"
            value={formData.amount}
            onChange={handleInputChange}

          />
          <label>Allowance Date</label>
          <input
            type="date"
            name="date"
            placeholder="Allowance Date"
            value={formData.date}
            onChange={handleInputChange}

          />
          <button className="submit-button" onClick={addBonus}>
            Add Allowance
          </button>
          <button className="cancel-button" onClick={handleReset}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Edit Allowance</h3>
          <label>Allowance Type</label>
          <input
            type="text"
            list="allowanceTypesList" // Link to the datalist by id
            placeholder="Allowance Type"
            value={
              allSettings.find((setting) => setting.id === editFormData.type)
                ?.type || ""
            } // Display the type based on the selected id
            onChange={(e) => {
              const selectedId = allSettings.find(
                (setting) => setting.type === e.target.value
              )?.id;
              setEditFormData({ ...editFormData, type: selectedId });
            }}
          />

          <datalist id="allowanceTypesList">
            {allSettings.map((setting) => (
              // Display each allowance type from allSettings
              <option key={setting.id} value={setting.type}>
                {setting.type}
              </option>
            ))}
          </datalist>

          <label>Allowance Amount</label>
          <input
            type="number"
            placeholder="Allowance Amount"
            value={editFormData.amount}
            onChange={(e) =>
              setEditFormData({ ...editFormData, amount: e.target.value })
            }
          />
          <label>Allowance Date</label>
          <input
            type="date"
            placeholder="Allowance Date"
            value={editFormData.date}
            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
          />
          <button
            className="submit-button"
            onClick={() => updateBonus(editFormData)}
          >
            Update Allowance
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
              <th>ID</th>
              <th>Allowance Type</th>
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
                <td className="bold-fonts">{bonus.allowanceName}</td>
                <td>{bonus.amount}</td>
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
export default AllowanceTable;
