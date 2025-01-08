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

const AttendanceSettings = () => {
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    holidayId: "",
    holidayName: "",
    startDate: "",
    endDate: "",
    status: "",
    type: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");


  const fetchBouneses = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}sett-adv-att/`);
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
    axios.post(`${SERVER_URL}sett-adv-att-del/`, {
      id: formData.id,
    });
    const updatedData = await axios.get(`${SERVER_URL}sett-adv-att/`);
    setData(updatedData.data);
    setShowModal(false);
    setSuccessModal(true);
    fetchBouneses();
  };

  const handleAddNew = () => {
    setFormData({
      holidayId: "",
      holidayName: "",
      startDate: "",
      endDate: "",
      status: "",
      type: "",
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
      !formData.holidayId ||
      !formData.holidayName ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.status ||
      !formData.type
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }

    const bouneses = {
      holidayId: formData.holidayId,
      holidayName: formData.holidayName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      type: formData.type,
    };
    try {
      axios.post(`${SERVER_URL}sett-adv-att/`, bouneses);
      const updatedData = await axios.get(`${SERVER_URL}sett-adv-att/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false);
      fetchBouneses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (data) => {
    setFormData({

      id: data.id,
      holidayId: data.holidayId,
      holidayName: data.holidayName,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      type: data.type,
    });
    setShowEditForm(true);
  };

  const updateBonus = (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      holidayId: row.holidayId,
      holidayName: row.holidayName,
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      type: row.type,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (
      !formData.holidayId ||
      !formData.holidayName ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.status ||
      !formData.type
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
    }
    const updateBounses = {
      id: formData.id,
      holidayId: formData.holidayId,
      holidayName: formData.holidayName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      type: formData.type,
    };
    console.log(updateBounses);
    try {
      await axios.post(`${SERVER_URL}sett-adv-att-up/`, updateBounses);
      const updatedData = await axios.get(`${SERVER_URL}sett-adv-att/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchBouneses();
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  const filteredData = data.filter((item) =>
    item.holidayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.holidayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      await axios.post(`${SERVER_URL}holiday/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}sett-adv-att/`);
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
            : `Are you sure you want to ${modalType} this Custom Holiday?`
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
            : `Custom Holiday ${modalType}d successfully!`
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
            <FaPlus /> Add Custom Holiday
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add Custom Holiday</h3>
          <label>Holiday ID</label>
          <input
            type="text"
            placeholder="Holiday ID"
            value={formData.holidayId}
            onChange={(e) =>
              setFormData({ ...formData, holidayId: e.target.value })
            }
          />
          <label>Holiday Name</label>
          <input
            type="text"
            placeholder="Holiday Name"
            value={formData.holidayName}
            onChange={(e) =>
              setFormData({ ...formData, holidayName: e.target.value })
            }
          />

          <h5>Holiday Duration</h5>

          <div className="form-time">
            <label>From</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <label>To</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>

          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <label>Holiday Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Select Holiday Type</option>
            <option value="Occasional Holidays">Occasional Holidays</option>
            <option value="Exceptional Holidays">Exceptional Holidays</option>
          </select>

          <button className="submit-button" onClick={addBonus}>
            Add Holiday
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Edit Holiday</h3>
          <label>Holiday ID</label>
          <input
            type="text"
            placeholder="Holiday ID"
            value={formData.holidayId}
            onChange={(e) =>
              setFormData({ ...formData, holidayId: e.target.value })
            }
          />
          <label>Holiday Name</label>
          <input
            type="text"
            placeholder="Holiday Name"
            value={formData.holidayName}
            onChange={(e) =>
              setFormData({ ...formData, holidayName: e.target.value })
            }
          />

          <h5>Holiday Duration</h5>

          <div className="form-time">
            <label>From</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <label>To</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>

          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <label>Holiday Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Select Holiday Type</option>
            <option value="Occasional Holidays">Occasional Holidays</option>
            <option value="Exceptional Holidays">Exceptional Holidays</option>
          </select>
          <button
            className="submit-button"
            onClick={() => updateBonus(formData)}
          >
            Update Holiday
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
              <th>Holiday ID</th>
              <th>Holiday Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((hol) => (
              <tr key={hol.holidayId}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(hol.id)}
                    onChange={(event) => handleRowCheckboxChange(event, hol.id)}
                  />
                </td>
                <td>{hol.holidayId}</td>
                <td className="bold-fonts">{hol.holidayName}</td>
                <td>{hol.startDate}</td>
                <td>{hol.endDate}</td>
                <td>{hol.status}</td>
                <td>{hol.type}</td>
                <td>
                  <button
                    // className="edit-button"
                    onClick={() => handleEdit(hol)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(hol.id)}
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

export default AttendanceSettings;
