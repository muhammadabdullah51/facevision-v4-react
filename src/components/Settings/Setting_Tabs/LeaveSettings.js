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
import { setLvFData, resetLvFData } from "../../../redux/lvfSlice";


const LeaveTable = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const dispatch = useDispatch();
  const lvfData = useSelector((state) => state.lvf);


  const [formData, setFormData] = useState(
    lvfData || {
      leaveFormulaId: "",
      cutCode: "",
      cutRate: "",
    });

  const handleReset = () => {
    dispatch(resetLvFData());
    setFormData({
      id: "",
      type: "",
      nature: "",
      percent: "",
      amount: "",
      date: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    type: "",
    nature: "",
    percent: "",
    amount: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setLvFData(updatedFormData));
      return updatedFormData;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchLvs = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-lvf/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  }, [setData]);

  useEffect(() => {
    fetchLvs();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchLvs, successModal]);


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
    if (!editFormData.cutCode || !editFormData.cutRate) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const updatedOTF = {
      leaveFormulaId: editFormData.leaveFormulaId,
      cutCode: editFormData.cutCode,
      cutRate: editFormData.cutRate,
    };
    try {
      const res = await axios.post(`${SERVER_URL}pyr-lvf-up/`, updatedOTF);
      console.log("Leave updated successfullykjljkljkl");
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setResMsg(res.data.msg)
      const updatedData = await axios.get(`${SERVER_URL}pyr-lvf/`);
      setData(updatedData.data);
      handleReset()
    } catch (error) {
      console.error("Error updating Leave:", error);
      setShowModal(false);
      setWarningModal(true);
    }

  }


  const handleAdd = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addOTF = async () => {
    setModalType("create");
    setShowModal(true);
  }
  const confirmAdd = async () => {
    if (!formData.cutCode || !formData.cutRate) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const newOTF = {
      cutCode: formData.cutCode,
      cutRate: formData.cutRate,
    }

    try {
      const response = await axios.post(`${SERVER_URL}pyr-lvf/`, newOTF);
      console.log("Leave Added Successfully")
      setShowAddForm(false);
      setResMsg(response.data.msg)
      setShowModal(false);
      setSuccessModal(true)
      const updatedData = await axios.get(`${SERVER_URL}pyr-lvf/`);
      setData(updatedData.data);
      handleReset()
    } catch (error) {
      console.log(error);
      setShowModal(false)
      setWarningModal(true);
    }

  }




  const handleDelete = async (leaveFormulaId) => {
    setShowModal(true);
    setModalType("delete");
    setFormData({ ...formData, leaveFormulaId: leaveFormulaId })
  };
  const confirmDelete = async () => {
    await axios.post(`${SERVER_URL}pyr-lvf-del/`, { leaveFormulaId: formData.leaveFormulaId, });
    const updatedData = await axios.get(`${SERVER_URL}pyr-lvf/`);
    setData(updatedData.data);
    fetchLvs();
    setShowModal(false);
    setSuccessModal(true);
  }


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.cutCode.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = filteredData.map((row) => row.leaveFormulaId);
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
      await axios.post(`${SERVER_URL}lvformula/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pyr-lvf/`);
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
            : `Are you sure you want to ${modalType} this Leave Formula?`
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
            : `Leave Formula ${modalType}d successfully!`
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
            <FaPlus /> Add New Leave Formula
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h4>Add New Leave</h4>
          <label>Cut Code</label>
          <input
            type="text"
            name="cutCode"
            placeholder="Cut Code"
            value={formData.cutCode}
            onChange={handleInputChange}
          />
          <br />
          <label>Cut Per Hour</label>
          <input
            type="number"
            name="cutRate"
            placeholder="Cut Per Hour"
            value={formData.cutRate}
            onChange={handleInputChange}
          />

          <button className="submit-button" onClick={addOTF}>
            Add Leave Formula
          </button>
          <button className="cancel-button" onClick={handleReset}>
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-leave-form">
          <h4>Edit Leave Formula</h4>
          <label>Cut Code</label>
          <input
            type="text"
            placeholder="Cut Code"
            value={editFormData.cutCode}
            onChange={(e) =>
              setEditFormData({ ...editFormData, cutCode: e.target.value })
            }
          />
          <br />
          <label>Cut Per Hour</label>
          <input
            type="number"
            placeholder="Cut Per Hour"
            value={editFormData.cutRate}
            onChange={(e) =>
              setEditFormData({ ...editFormData, cutRate: e.target.value })
            }
          />

          <button className="submit-button" onClick={() => updateOTF(editFormData)}>
            Update Leave Formula
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
              <th>Formula ID</th>
              <th>Cut Code</th>
              <th>Cut Per Hour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.leaveFormulaId}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(item.leaveFormulaId)}
                    onChange={(event) => handleRowCheckboxChange(event, item.leaveFormulaId)}
                  />
                </td>
                <td>{item.leaveFormulaId}</td>
                <td>{item.cutCode}</td>
                <td>{item.cutRate}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.leaveFormulaId)}
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

export default LeaveTable;
