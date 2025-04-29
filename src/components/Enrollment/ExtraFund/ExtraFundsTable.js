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
import { setExtraFundsData, resetExtraFundsData } from "../../../redux/extraFundsSlice";


const ExtraFundsTable = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const dispatch = useDispatch();
  const extraFundsData = useSelector((state) => state.extraFunds);

  const [formData, setFormData] = useState(
    extraFundsData || {
      id: "",
      name: "",
      created_date: "",
      extrafund_amount: "",
      desc: "",
      type: "payable",
    });

  const handleReset = () => {
    dispatch(resetExtraFundsData());
    setFormData({
      id: "",
      name: "",
      created_date: "",
      extrafund_amount: "",
      desc: "",
      type: "payable",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    created_date: "",
    extrafund_amount: "",
    desc: "",
    type: "payable",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setExtraFundsData(updatedFormData));
      return updatedFormData;
    });
  };


  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchLoan = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-ext/`);
      setData(response.data);
    } catch (error) {
    }
  }, [setData]);
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      setEmployees(response.data);
    } catch (error) {
    }
  };

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchLoan();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchLoan, successModal]);

  const [searchQuery, setSearchQuery] = useState("");



  // Delete an extraFundAmount
  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}pyr-ext-del/`, {
        id: formData.id,
      });
      fetchLoan();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addLoan = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      !formData.name ||
      !formData.created_date ||
      !formData.extrafund_amount ||
      !formData.desc ||
      !formData.type
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.extrafund_amount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const newLoan = {
      name: formData.name,
      created_date: formData.created_date,
      extrafund_amount: formData.extrafund_amount,
      desc: formData.desc,
      type: formData.type,
    };
    try {
      await axios.post(`${SERVER_URL}pyr-ext/`, newLoan);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false);
      fetchLoan();
      handleReset()
    } catch (error) {
    }
  };
  // Handle form data changes
  const handleEdit = (data) => {
    setEditFormData({
      id: data.id,
      name: data.name,
      created_date: data.created_date,
      extrafund_amount: data.extrafund_amount,
      desc: data.desc,
      type: data.type,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateLoan = (row) => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (
      !formData.name ||
      !formData.created_date ||
      !formData.extrafund_amount ||
      !formData.desc ||
      !formData.type
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.extrafund_amount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    try {
      const updateLoan = {
        id: editFormData.id,
        name: editFormData.name,
        created_date: editFormData.created_date,
        extrafund_amount: editFormData.extrafund_amount,
        desc: editFormData.desc,
        type: editFormData.type,
      };
      await axios.post(`${SERVER_URL}pyr-ext-up/`, updateLoan);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchLoan();
      handleReset()
    } catch (error) {
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.created_date?.toString().includes(searchQuery) ||
      item.extrafund_amount?.toLowerCase().includes(searchQuery) ||
      item.desc?.toLowerCase().includes(searchQuery) ||
      item.type?.toLowerCase().includes(searchQuery.toLowerCase())
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
      await axios.post(`${SERVER_URL}extfund/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pyr-ext/`);
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
            : formData.type === "NotPayable"
              ? `Are you sure you want to ${modalType} this Extra Fund as NOT PAYABLE amount?`
              : `Are you sure you want to ${modalType} this Extra Fund as PAYABLE amount?`
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
            : `Extra Fund ${modalType}d successfully!`
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
            <FaPlus /> Add New Extra Funds
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Extra Funds</h3>
          <label>Extra Funds Name</label>
          <input
            type="text"
            name="name"
            placeholder="Extra Funds Name"
            value={formData.name}
            onChange={handleInputChange}

          />
          <label>Created Date</label>
          <input
            type="date"
            name="created_date"
            placeholder="Created Date"
            value={formData.created_date}
            onChange={handleInputChange}

          />
          <label>Given Amount</label>
          <input
            type="number"
            name="extrafund_amount"
            placeholder="Given Amount"
            value={formData.extrafund_amount}
            onChange={handleInputChange}

          />

          <label>Select Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="payable">Payable</option>
            <option value="NotPayable">Not Payable</option>
          </select>

          <label>Description</label>
          <textarea
            type="text"
            name="desc"
            placeholder="Write description"
            value={formData.desc}
            onChange={handleInputChange}

          />
          <button className="submit-button" onClick={addLoan}>
            Add Extra Funds
          </button>
          <button className="cancel-button" onClick={handleReset}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Loan</h3>
          <label>Extra Funds Name</label>
          <input
            type="text"
            name="name"
            placeholder="Extra Funds Name"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({ ...editFormData, name: e.target.value })}
          />

          <label>Created Date</label>
          <input
            type="date"
            name="created_date"
            placeholder="Created Date"
            value={editFormData.created_date}
            onChange={(e) =>
              setEditFormData({ ...editFormData, created_date: e.target.value })}

          />

          <label>Given Amount</label>
          <input
            type="number"
            placeholder="Given Amount"
            value={editFormData.extrafund_amount}
            onChange={(e) =>
              setEditFormData({ ...editFormData, extrafund_amount: e.target.value })
            }
          />



          <label>Selected Type</label>
          <select
            disabled
            value={editFormData.type}
            onChange={(e) =>
              setEditFormData({ ...editFormData, type: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="payable">Payable</option>
            <option value="NotPayable">Not Payable</option>
          </select>



          <button
            className="submit-button"
            onClick={() => updateLoan(editFormData)}
          >
            Update Extra Funds
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
              <th>Name</th>
              <th>Created Date</th>
              <th>Extra Funds Amount</th>
              <th>Type</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((adv) => (
              <tr key={adv.id}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(adv.id)}
                    onChange={(event) => handleRowCheckboxChange(event, adv.id)}
                  />
                </td>
                <td>{adv.id}</td>
                <td className="bold-fonts">{adv.name}</td>
                <td>{adv.created_date}</td>
                <td className="bold-fonts">{adv.extrafund_amount}</td>
                <td>
                  <span
                    className={`status ${adv.type === "payable"
                      ? "absentStatus"
                      : adv.type === "Rejected"
                        ? "absentStatus"
                        : "presentStatus"
                      }`}
                  >
                    {adv.type}
                  </span>
                </td>
                <td>{adv.desc}</td>
                <td>
                  {adv.type.toLowerCase() === "payable" && (
                    <button
                      onClick={() => handleEdit(adv)}
                      style={{ background: "none", border: "none" }}
                    >
                      <FaEdit className="table-edit" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(adv.id)}
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

export default ExtraFundsTable;
