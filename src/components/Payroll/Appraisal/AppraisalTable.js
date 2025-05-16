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
import { setAppraisalsData, resetAppraisalsData } from "../../../redux/appraisalsSlice";


const AppraisalTable = () => {
  const [data, setData] = useState([]);
  // const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);


  const dispatch = useDispatch();
  const appr = useSelector((state) => state.appraisals);

  const [formData, setFormData] = useState(
    appr || {
      id: "",
      name: "",
      created_date: "",
      appraisal_amount: "",
      desc: "",
    });
  const handleReset = () => {
    dispatch(resetAppraisalsData());
    setFormData({
      id: "",
      name: "",
      created_date: "",
      appraisal_amount: "",
      desc: "",
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    created_date: "",
    appraisal_amount: "",
    desc: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setAppraisalsData(updatedFormData));
      return updatedFormData;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchAppraisals = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-appr/`);
      setData(response.data);
    } catch (error) {
    }
  }, [setData]);
  // const fetchEmployees = async () => {
  //   try {
  //     const response = await axios.get(`${SERVER_URL}pr-emp/`);
  //     setEmployees(response.data);
  //   } catch (error) {
  //   }
  // };

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchAppraisals();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchAppraisals, successModal]);

  const [searchQuery, setSearchQuery] = useState("");



  // Delete an appraisal
  const handleDelete = async (id) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, id: id });

  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}pyr-appr/${formData.id}/`);

      fetchAppraisals();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAddNew = () => {

    setShowAddForm(true);
    setShowEditForm(false);
  };
  const addAppraisal = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.name === "" ||
      formData.created_date === "" ||
      formData.appraisal_amount === "" ||
      formData.desc === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.appraisal_amount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.desc.length > 250 ) {
            setResMsg("Reason Can't be Bigger than 250 characters");
            setShowModal(false);
            setWarningModal(true);
            return;
        }
    const newAppraisal = {
      name: formData.name,
      created_date: formData.created_date,
      appraisal_amount: formData.appraisal_amount,
      desc: formData.desc,
    };
    try {
      await axios.post(`${SERVER_URL}pyr-appr/`, newAppraisal);
      const updatedData = await axios.get(`${SERVER_URL}pyr-appr/`);
      setData(updatedData.data);
      setShowAddForm(false);
      setShowModal(false);
      setSuccessModal(true);
      fetchAppraisals();
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
      appraisal_amount: data.appraisal_amount,
      desc: data.desc,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateAppraisal = (row) => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    console.log(editFormData)
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (
      editFormData.id === "" ||
      editFormData.name === "" ||
      editFormData.created_date === "" ||
      editFormData.appraisal_amount === "" ||
      editFormData.desc === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (editFormData.appraisal_amount < 1) {
      setResMsg("Values Can't be Negative or zero");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (editFormData.desc.length > 250) {
      setResMsg("Reason Can't be Bigger than 250 characters");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    try {
      const updateAppraisal = {
        name: editFormData.name,
        created_date: editFormData.created_date,
        appraisal_amount: editFormData.appraisal_amount,
        desc: editFormData.desc,

      };
      console.log(updateAppraisal)

      await axios.put(`${SERVER_URL}pyr-appr/${editFormData.id}/`, updateAppraisal);
      const updatedData = await axios.get(`${SERVER_URL}pyr-appr/`);
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowEditForm(false);
      fetchAppraisals();
      handleReset();
    } catch (error) {
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.created_date?.toString().includes(searchQuery) ||
      item.appraisal_amount?.toLowerCase().includes(searchQuery)
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
      await axios.post(`${SERVER_URL}crapp/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pyr-appr/`);
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
            : `Are you sure you want to ${modalType} this Appraisal?`
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
            : `Appraisals ${modalType}d successfully!`
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
            <FaPlus /> Add New Appraisal
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h3>Add New Appraisal</h3>

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Appraisal Name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <label>Appraisal Amount</label>
          <input
            type="Number"
            name="appraisal_amount"
            placeholder="Amount"
            value={formData.appraisal_amount}
            onChange={handleInputChange}
          />


          <label>Created Date</label>
          <input
            type="Date"
            name="created_date"
            placeholder="Date"
            value={formData.created_date}
            onChange={handleInputChange}
          />

          <label>Description</label>

          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={handleInputChange}
          />

          <button className="submit-button" onClick={addAppraisal}>
            Add Appraisal
          </button>
          <button className="cancel-button" onClick={handleReset}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-leave-form">
          <h3>Update Appraisal</h3>

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Appraisal Name"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({ ...editFormData, name: e.target.value })
            }
          />

          <label>Appraisal Amount</label>
          <input
            type="Number"
            placeholder="Appraisal"
            value={editFormData.appraisal_amount}
            onChange={(e) =>
              setEditFormData({ ...editFormData, appraisal_amount: e.target.value })
            }
          />

          <label>Date</label>
          <input
            type="Date"
            placeholder="Date"
            value={editFormData.created_date}
            onChange={(e) => setEditFormData({ ...editFormData, created_date: e.target.value })}
          />

          <label>Description</label>
          <textarea
            name="desc"
            placeholder="Description"
            value={editFormData.desc}
            onChange={(e) => setEditFormData({ ...editFormData, desc: e.target.value })}
          />

          <button
            className="submit-button"
            onClick={() => updateAppraisal(editFormData)}
          >
            Update Appraisal
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
              <th>Appraisals Name</th>
              <th>Amount</th>
              <th>Created Date</th>
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
                <td>{adv.appraisal_amount}</td>
                <td>{adv.created_date}</td>
                <td>{adv.desc}</td>

                <td>
                  <button
                    onClick={() => handleEdit(adv)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
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

export default AppraisalTable;
