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
import { setOtfData, resetOtfData } from "../../../redux/otfSlice";

const OvertimeTable = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);


  const dispatch = useDispatch();
  const otfData = useSelector((state) => state.otf);


  const [formData, setFormData] = useState(
    otfData || {
      OTFormulaId: "",
      OTCode: "",
      ratePerHour: "",
      updateDate: "",
    });

  const handleReset = () => {
    dispatch(resetOtfData());
    setFormData({
      OTFormulaId: "",
      OTCode: "",
      ratePerHour: "",
      updateDate: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    OTFormulaId: "",
    OTCode: "",
    ratePerHour: "",
    updateDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setOtfData(updatedFormData));
      return updatedFormData;
    });
  };


  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchOTF = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-ot/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  }, [setData]);

  useEffect(() => {
    fetchOTF();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchOTF, successModal]);



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
    if (!editFormData.OTCode || !editFormData.ratePerHour || !editFormData.updateDate) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const updatedOTF = {
      OTFormulaId: editFormData.OTFormulaId,
      OTCode: editFormData.OTCode,
      ratePerHour: editFormData.ratePerHour,
      updateDate: editFormData.updateDate,
    };
    try {
      const res = await axios.post(`${SERVER_URL}pyr-ot-up/`, updatedOTF);
      console.log("Overtime updated successfully");
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setResMsg(res.data.msg)
      const updatedData = await axios.get(`${SERVER_URL}pyr-ot/`);
      setData(updatedData.data);
      handleReset();
    } catch (error) {
      console.error("Error updating overtime:", error);
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
    if (!formData.OTCode || !formData.ratePerHour || !formData.updateDate) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const newOTF = {
      OTCode: formData.OTCode,
      ratePerHour: formData.ratePerHour,
      updateDate: formData.updateDate,
    }

    try {
      const response = await axios.post(`${SERVER_URL}pyr-ot/`, newOTF);
      console.log("Overtime Added Successfully")
      setShowAddForm(false);
      setResMsg(response.data.msg)
      setShowModal(false);
      setSuccessModal(true)
      const updatedData = await axios.get(`${SERVER_URL}pyr-ot/`);
      setData(updatedData.data);
      handleReset()
    } catch (error) {
      console.log(error);
      setShowModal(false)
      setWarningModal(true);
    }

  }




  const handleDelete = async (OTFormulaId) => {
    setShowModal(true);
    setModalType("delete");
    setFormData({ ...formData, OTFormulaId: OTFormulaId })
  };
  const confirmDelete = async () => {
    await axios.post(`${SERVER_URL}pyr-ot-del/`, { OTFormulaId: formData.OTFormulaId, });
    const updatedData = await axios.get(`${SERVER_URL}pyr-ot/`);
    setData(updatedData.data);
    fetchOTF();
    setShowModal(false);
    setSuccessModal(true);
  }






  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.OTCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = filteredData.map((row) => row.OTFormulaId);
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
      await axios.post(`${SERVER_URL}otformula/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pyr-ot/`);
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
            : `Are you sure you want to ${modalType} this Overtime Formula?`
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
            : `Overtime Formula ${modalType}d successfully!`
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
            <FaPlus /> Add New Overtime Formula
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h4>Add New Overtime</h4>
          <label>Pay Code</label>
          <input
            type="text"
            name="OTCode"
            placeholder="Pay Code"
            value={formData.OTCode}
            onChange={handleInputChange}
          />
          <label>Rate Per Hour</label>
          <input
            type="number"
            name="ratePerHour"
            placeholder="Rate Per Hour"
            value={formData.ratePerHour}
            onChange={handleInputChange}
          />
          <label>Update Date</label>
          <input
            type="date"
            name="updateDate"
            placeholder="Update Date"
            value={formData.updateDate}
            onChange={handleInputChange}
          />
          <button className="submit-button" onClick={addOTF}>
            Add Overtime Formula
          </button>
          <button className="cancel-button" onClick={handleReset}>
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-leave-form">
          <h4>Edit Overtime Formula</h4>
          <label>Pay Code</label>
          <input
            type="text"
            placeholder="Pay Code"
            value={editFormData.OTCode}
            onChange={(e) =>
              setEditFormData({ ...editFormData, OTCode: e.target.value })
            }
          />
          <label>Rate Per Hour</label>
          <input
            type="number"
            placeholder="Rate Per Hour"
            value={editFormData.ratePerHour}
            onChange={(e) =>
              setEditFormData({ ...editFormData, ratePerHour: e.target.value })
            }
          />
          <label>Update Date</label>
          <input
            type="date"
            placeholder="Update Date"
            value={editFormData.updateDate}
            onChange={(e) =>
              setEditFormData({ ...editFormData, updateDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={() => updateOTF(editFormData)}>
            Update Overtime Formula
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
              <th>Pay Code</th>
              <th>Rate Per Hour</th>
              <th>Update Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.OTFormulaId}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(item.OTFormulaId)}
                    onChange={(event) => handleRowCheckboxChange(event, item.OTFormulaId)}
                  />
                </td>
                <td>{item.OTFormulaId}</td>
                <td>{item.OTCode}</td>
                <td>{item.ratePerHour}</td>
                <td>{item.updateDate}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.OTFormulaId)}
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

export default OvertimeTable;
