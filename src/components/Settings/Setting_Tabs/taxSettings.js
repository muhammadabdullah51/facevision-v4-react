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

const TaxSettings = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    type: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchTax = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}tax-types/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching taxes data:", error);
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

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setShowAddForm(false);
    setShowEditForm(true);
  };
  const updateOTF = async (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      type: row.type,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.type) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const updatedOTF = {
      id: formData.id,
      type: formData.type,
    };
    try {
      const res = await axios.put(`${SERVER_URL}tax-types/${formData.id}/`, updatedOTF);
      console.log("Tax type updated successfully");
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setResMsg(res.data.msg);

      const updatedData = await axios.get(`${SERVER_URL}tax-types/`);
      setData(updatedData.data);
    } catch (error) {
      console.error("Error updating tax type:", error);
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const handleAdd = () => {
    setFormData({
      type: "",
    });
    setShowAddForm(true);
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

    try {
      await axios.post(`${SERVER_URL}tax-types/`, newOTF);
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
      const updatedData = await axios.get(`${SERVER_URL}tax-types/`);
      setData(updatedData.data);
      // setShowAddForm(false)
    } catch (error) {
      console.log(error);
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const handleDelete = async (id) => {
    setShowModal(true);
    setModalType("delete");
    setFormData({ ...formData, id: id });
    console.log(id)
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}tax-types/${formData.id}/`);
      const updatedData = await axios.get(`${SERVER_URL}tax-types/`);
      setData(updatedData.data);
      fetchTax(); // Ensure fetchTax properly refreshes data elsewhere in your app
      setShowModal(false);
      setSuccessModal(true);
      console.log("Tax type deleted successfully");
    } catch (error) {
      console.error("Error deleting tax type:", error);
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
      await axios.post(`${SERVER_URL}taxtype/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}tax-types/`);
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
            <FaPlus /> Add New Tax
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h4>Add New Tax</h4>
          <input
            type="text"
            placeholder="Tax Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <button className="submit-button" onClick={addOTF}>
            Add Tax
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-leave-form">
          <h4>Edit Tax</h4>

          <input
            type="text"
            placeholder="Tax Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />

          <button className="submit-button" onClick={() => updateOTF(formData)}>
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

export default TaxSettings;
