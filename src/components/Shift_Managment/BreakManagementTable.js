import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { SERVER_URL } from "../../config";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";

const BreakManagementTable = ({ onDataUpdate }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    start_time: "",
    end_time: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchBreaks = useCallback(async () => {
 
    try {
      const response = await axios.get(`${SERVER_URL}brk-sch/`);
      setData(response.data);
      onDataUpdate(response.data);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    } 
  }, [setData]);

  useEffect(() => {
    fetchBreaks();

    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchBreaks, successModal]);



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
      name: row.name,
      start_time: row.start_time,
      end_time: row.end_time,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.name || !formData.start_time || !formData.end_time) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const updatedOTF = {
      id: formData.id,
      name: formData.name,
      start_time: formData.start_time,
      end_time: formData.end_time,
    };
    try {
      const res = await axios.put(`${SERVER_URL}brk-sch/${formData.id}/`, updatedOTF);
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setResMsg(res.data.msg)
      const updatedData = await axios.get(`${SERVER_URL}brk-sch/`);
      setData(updatedData.data);
      onDataUpdate(updatedData.data)
    } catch (error) {
      console.error("Error updating Leave:", error);
      setShowModal(false);
      setWarningModal(true);
    }

  }


  const handleAdd = () => {
    setFormData({
      name: "",
      start_time: "",
      end_time: "",
    });
    setShowAddForm(true);
  };
  const addOTF = async () => {
    setModalType("create");
    setShowModal(true);
  }
  const confirmAdd = async () => {
    if (!formData.name || !formData.start_time || !formData.end_time) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const newOTF = {
      name: formData.name,
      start_time: formData.start_time,
      end_time: formData.end_time,
    }

    try {
      const response = await axios.post(`${SERVER_URL}brk-sch/`, newOTF);
      setShowAddForm(false);
      setResMsg(response.data.msg)
      setShowModal(false);
      setSuccessModal(true)
      const updatedData = await axios.get(`${SERVER_URL}brk-sch/`);
      setData(updatedData.data);
      onDataUpdate(updatedData.data)

      // setShowAddForm(false)
    } catch (error) {
      console.log(error);
      setShowModal(false)
      setWarningModal(true);
    }

  }




  const handleDelete = async (id) => {
    setShowModal(true);
    setModalType("delete");
    setFormData({ ...formData, id: id })
  };
  const confirmDelete = async () => {
    await axios.delete(`${SERVER_URL}brk-sch/${formData.id}/`);
    const updatedData = await axios.get(`${SERVER_URL}brk-sch/`);
    setData(updatedData.data);
    onDataUpdate(updatedData.data)

    fetchBreaks();
    setShowModal(false);
    setSuccessModal(true);
  }


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      await axios.post(`${SERVER_URL}break/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}brk-sch/`);
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
            : `Are you sure you want to ${modalType} this Break?`
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
            : `Break ${modalType}d successfully!`
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
            <FaPlus /> Add New Break Schedule
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h4>Add New Break Schedule</h4>
          <label>Break Name</label>
          <input
            type="text"
            placeholder="Break Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <label style={{ margin: '0 10px' }}>Break Start Time</label>
          <input
            type="time"
            placeholder="Break Start Time"
            value={formData.start_time}
            onChange={(e) =>
              setFormData({ ...formData, start_time: e.target.value })
            }
          />
          <label style={{ margin: '0 10px' }}>Break End Time</label>
          <input
            type="time"
            placeholder="Break End Time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
          />
          <br />

          <button className="submit-button" onClick={addOTF}>
            Add Break Schedule
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-leave-form">
          <h4>Edit Break Schedule</h4>
          <label>Break Name</label>
          <input
            type="text"
            placeholder="Break Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <label style={{ margin: '0 10px' }}>Break Start Time</label>
          <input
            type="time"
            placeholder="Break Start Time"
            value={formData.start_time}
            onChange={(e) =>
              setFormData({ ...formData, start_time: e.target.value })
            }
          />
          <label style={{ margin: '0 10px' }}>Break End Time</label>
          <input
            type="time"
            placeholder="Break End Time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
          />
          <br />

          <button className="submit-button" onClick={() => updateOTF(formData)}>
            Update Break Schedule
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
              <th>Break Name</th>
              <th>Break Start Time</th>
              <th>Break End Time</th>
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
                <td>{item.name}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
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

export default BreakManagementTable
