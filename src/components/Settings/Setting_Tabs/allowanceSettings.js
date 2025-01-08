import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./leave.css";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";

import { useDispatch, useSelector } from "react-redux";
import { setAllowanceSettingData, resetAllowanceSettingData } from "../../../redux/allowanceSettingSlice";


const AllowanceSettings = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const dispatch = useDispatch();
  const alcSettingData = useSelector((state) => state.allowanceSetting);

  const [formData, setFormData] = useState(
    alcSettingData || {
    id: "",
    type: "",
  });

  const handleReset = () => {
    dispatch(resetAllowanceSettingData());
    setFormData({
      id: "",
      type: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    type: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setAllowanceSettingData(updatedFormData));
      return updatedFormData;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchTax = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}allowance-types/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching allowances data:", error);
    }
  }, [setData]);

  useEffect(() => {
    fetchTax();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchTax, successModal]);

  
  const handleEdit = (row) => {
    setEditFormData({ ...row });
    setShowAddForm(false);
    setShowEditForm(true);
  };
  const updateOTF = async (row) => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!editFormData.type) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const updatedOTF = {
      type: editFormData.type,
    };

    try {
      const res = await axios.put(`${SERVER_URL}allowance-types/${editFormData.id}/`, updatedOTF);
      console.log("Allowance updated successfully");
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setResMsg(res.data.msg);

      const updatedData = await axios.get(`${SERVER_URL}allowance-types/`);
      setData(updatedData.data);
      handleReset()
    } catch (error) {
      console.error("Error updating allowance:", error);
      setShowModal(false);
      setWarningModal(true);
    }
  };


  const handleAdd = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addOTF = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (!formData.type) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const newOTF = {
      type: formData.type,
    };

    console.log("Payload to be sent:", newOTF); // Log payload for debugging

    try {
      const response = await axios.post(`${SERVER_URL}allowance-types/`, newOTF);
      console.log("Response from server:", response.data);
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);

      const updatedData = await axios.get(`${SERVER_URL}allowance-types/`);
      setData(updatedData.data);
      handleReset()
    } catch (error) {
      console.error("Error adding allowance:", error.response?.data || error.message);
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const handleDelete = async (id) => {
    setShowModal(true);
    setModalType("delete");
    setFormData({ ...formData, id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}allowance-types/${formData.id}/`);
      const updatedData = await axios.get(`${SERVER_URL}allowance-types/`);
      setData(updatedData.data);
      fetchTax(); // Ensure this properly refreshes the data elsewhere in your app
      setShowModal(false);
      setSuccessModal(true);
      console.log("Allowance deleted successfully");
    } catch (error) {
      console.error("Error deleting allowance:", error);
      setShowModal(false);
      setWarningModal(true);
    }
  };

 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
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
      await axios.post(`${SERVER_URL}alwctype/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}allowance-types/`);
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
          <button className="add-button" onClick={handleAdd}>
            <FaPlus /> Add New Allowance
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h4>Add New Allowance</h4>
          <input
            type="text"
            name="type"
            placeholder="Allowance Type"
            value={formData.type}
            onChange={handleInputChange}
          />
          <button className="submit-button" onClick={addOTF}>
            Add Allowance
          </button>
          <button className="cancel-button" onClick={handleReset}>
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-leave-form">
          <h4>Edit Allowance</h4>

          <input
            type="text"
            placeholder="Allowance Type"
            value={editFormData.type}
            onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
          />

          <button className="submit-button" onClick={() => updateOTF(editFormData)}>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(event) => handleRowCheckboxChange(event, item.id)}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

export default AllowanceSettings;
