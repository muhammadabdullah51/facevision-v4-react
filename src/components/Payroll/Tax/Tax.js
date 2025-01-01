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
import AssignTax from "./assignTax";

const Tax = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    type: "",
    nature: "",
    percent: "",
    amount: "",
    date: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const [taxSettings, setTaxSettings] = useState("");

  const [loading, setLoading] = useState(false); // Loading state

  const TaxSettings = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}tax-types/`);
      setTaxSettings(response.data);
    } catch (error) {
      console.error("Error fetching tax names:", error);
    }
  };

  const fetchTax = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}taxes/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching tax data:", error);
    }
  }, [setData]);


  useEffect(() => {
    fetchTax();
    TaxSettings();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchTax, successModal]);

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
    axios.delete(`${SERVER_URL}taxes/${formData.id}/`);
    const updatedData = await axios.get(`${SERVER_URL}taxes/`);
    setData(updatedData.data);
    setShowModal(false);
    setSuccessModal(true);
    fetchTax();
  };

  const handleAddNew = () => {
    setFormData({
      type: "",
      nature: "",
      percent: "",
      amount: "",
      date: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addBonus = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (!formData.type || !formData.nature || !formData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }
    if (formData.nature === 'percentage') {

      if (formData.percent < 1 || formData.percent > 100) {
        setResMsg("Values Can't be Less than 1 or Greater then 100");
        setShowModal(false);
        setWarningModal(true);
        return;
      }

    } else if (formData.nature === 'fixedamount') {

      if (formData.amount < 1) {
        setResMsg("Values Can't be Negative or zero");
        setShowModal(false);
        setWarningModal(true);
        return;
      }
    }

    const bouneses = {
      type: formData.type,
      nature: formData.nature,
      percent: formData.nature == 'fixedamount' ? 0 : formData.percent,
      amount: formData.nature == 'percentage' ? 0 : formData.amount,
      date: formData.date,
    };
    try {
      axios.post(`${SERVER_URL}taxes/`, bouneses);
      const updatedData = await axios.get(`${SERVER_URL}taxes/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false);
      fetchTax();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (data) => {
    setFormData({
      id: data.id,
      type: data.type,
      nature: data.nature,
      percent: data.percent,
      amount: data.amount,
      date: data.date,
    });
    setShowEditForm(true);
  };

  const updateBonus = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      type: row.type,
      nature: row.nature,
      percent: formData.nature == 'fixedamount' ? 0 : formData.percent,
      amount: formData.nature == 'percentage' ? 0 : formData.amount,
      date: row.date,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.type || !formData.nature || !formData.date) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }
    if (formData.nature === 'percentage') {

      if (formData.percent < 1 || formData.percent > 100) {
        setResMsg("Values Can't be Less than 1 or Greater then 100");
        setShowModal(false);
        setWarningModal(true);
        return;
      }
    } else if (formData.nature === 'fixedamount') {

      if (formData.amount < 1) {
        setResMsg("Values Can't be Negative or zero");
        setShowModal(false);
        setWarningModal(true);
        return;
      }
    }
    const updateBounses = {
      id: formData.id,
      type: formData.type,
      nature: formData.nature,
      percent: formData.nature == 'fixedamount' ? 0 : formData.percent,
      amount: formData.nature == 'percentage' ? 0 : formData.amount,
      date: formData.date,
    };
    try {
      await axios.put(`${SERVER_URL}taxes/${formData.id}/`, updateBounses);
      const updatedData = await axios.get(`${SERVER_URL}taxes/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchTax();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.taxName.toLowerCase().includes(searchQuery.toLowerCase())
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
      const response = await axios.post(`${SERVER_URL}tax/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}taxes/`);
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
            : `Are you sure you want to ${modalType} this Tax?`
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
            : `Tax ${modalType}d successfully!`
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
            <FaPlus /> Add New Tax
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Tax</h3>
          <label>Tax Type</label>
          <input
            type="text"
            list="taxType" // Link to the datalist by id
            placeholder="Allowance Type"
            value={
              taxSettings.find((setting) => setting.id === formData.type)
                ?.type || ""
            } // Display the type based on the selected id
            onChange={(e) => {
              const selectedId = taxSettings.find(
                (setting) => setting.type === e.target.value
              )?.id;
              setFormData({ ...formData, type: selectedId });
            }}
          />

          <datalist id="taxType">
            {taxSettings.map((setting) => (
              // Display each allowance type from allSettings
              <option key={setting.id} value={setting.type}>
                {setting.type}
              </option>
            ))}
          </datalist>

          <label>Nature</label>
          <select
            value={formData.nature}
            onChange={(e) =>
              setFormData({ ...formData, nature: e.target.value })
            }
          >
            <option value="">Select Nature</option>
            <option value="fixedamount">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>

          {formData.nature === 'percentage' ? (
            <>
              <label>Percentage %</label>
              <input
                type="number"
                placeholder="Percentage %"
                value={formData.percent}
                onChange={(e) =>
                  setFormData({ ...formData, percent: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <label>Amount</label>
              <input
                type="number"
                placeholder="Tax Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </>
          )}


          <label>Date</label>
          <input
            type="date"
            placeholder="Tax Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <button className="submit-button" onClick={addBonus}>
            Add Tax
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Edit Tax</h3>
          <label>Tax Type</label>
          <input
            type="text"
            list="taxType" // Link to the datalist by id
            placeholder="Allowance Type"
            value={
              taxSettings.find((setting) => setting.id === formData.type)
                ?.type || ""
            } // Display the type based on the selected id
            onChange={(e) => {
              const selectedId = taxSettings.find(
                (setting) => setting.type === e.target.value
              )?.id;
              setFormData({ ...formData, type: selectedId });
            }}
          />

          <datalist id="taxType">
            {taxSettings.map((setting) => (
              // Display each allowance type from allSettings
              <option key={setting.id} value={setting.type}>
                {setting.type}
              </option>
            ))}
          </datalist>

          <label>Nature</label>
          <select
            value={formData.nature}
            onChange={(e) =>
              setFormData({ ...formData, nature: e.target.value })
            }
          >
            <option value="fixedamount">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>

          {formData.nature === 'percentage' ? (
            <>
              <label>Percentage %</label>
              <input
                type="number"
                placeholder="Percentage %"
                value={formData.percent}
                onChange={(e) =>
                  setFormData({ ...formData, percent: e.target.value })
                }

              />
            </>
          ) : (
            <>
              <label>Amount</label>
              <input
                type="number"
                placeholder="Tax Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </>
          )}



          <label>Date</label>
          <input
            type="date"
            placeholder="Tax Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <button
            className="submit-button"
            onClick={() => updateBonus(formData)}
          >
            Update Tax
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
              <th>Tax Type</th>
              <th>Nature</th>
              <th>Amount / Percentage</th>
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
                <td className="bold-fonts">{bonus.taxName}</td>
                <td>{bonus.nature}</td>
                <td>{bonus.amount == 0 ? bonus.percent : bonus.amount} {bonus.percent != 0 ? '%' : 'Rs'}</td>
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
      <div className="break-table">
        <AssignTax />
      </div>
    </div>
  );
};

export default Tax;
