import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const LeaveTable = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentItemId, setCurrentItemId] = useState(null); // Store ID of item being edited
  const [cutCode, cuttOTCode] = useState("");
  const [cutRate, setcutRate] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveFormulaId: "",
    cutCode: "",
    cutRate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchLvs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}pyr-ot/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    } finally {
      setLoading(false);
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

  

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setShowAddForm(false);
    setShowEditForm(true);
  };
  const updateOTF = async(row) => {
    setModalType("update");
    setFormData({ 
      leaveFormulaId: row.leaveFormulaId,
      cutCode: row.cutCode,
      cutRate: row.cutRate,
    });
    setShowModal(true);
  };
  const confirmUpdate = async() => {
    if(!formData.cutCode || !formData.cutRate ){
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    } 

    const updatedOTF = {
      leaveFormulaId: formData.leaveFormulaId,
      cutCode: formData.cutCode,
      cutRate: formData.cutRate,
    };
    try {
      const res = await axios.post(`${SERVER_URL}pyr-ot-up/`, updatedOTF);
      console.log("Overtime updated successfullykjljkljkl");
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setResMsg(res.data.msg)
      const updatedData = await axios.get(`${SERVER_URL}pyr-ot/`);
      setData(updatedData.data);
    } catch (error) {
      console.error("Error updating overtime:", error);
      setShowModal(false);
      setWarningModal(true);
    }

  }


  const handleAdd = () => {
    setFormData({
      cutCode: "",
      cutRate: "",
    });
    setShowAddForm(true);
  };
  const addOTF = async () => {
    setModalType("create");
    setShowModal(true);
  }
  const confirmAdd = async () => {
    if(!formData.cutCode ||!formData.cutRate ||!formData.updateDate){
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
      const response = await axios.post(`${SERVER_URL}pyr-ot/`, newOTF);
      console.log("Overtime Added Successfully")
      setShowAddForm(false);
      setResMsg(response.data.msg)
      setShowModal(false);
      setSuccessModal(true)
      const updatedData = await axios.get(`${SERVER_URL}pyr-ot/`);
      setData(updatedData.data);
      // setShowAddForm(false)
    } catch (error) {
      console.log(error);
      setShowModal(false)
      setWarningModal(true);
    }

  }




  const handleDelete = async (leaveFormulaId) => {
    setShowModal(true);
    setModalType("delete");
    setFormData({...formData, leaveFormulaId: leaveFormulaId})
  };
  const confirmDelete = async () => {
    await axios.post(`${SERVER_URL}pyr-ot-del/`, {leaveFormulaId: formData.leaveFormulaId,});
    const updatedData = await axios.get(`${SERVER_URL}pyr-ot/`);
    setData(updatedData.data);
    fetchLvs();
    setShowModal(false);
    setSuccessModal(true);
  }
  const resetForm = () => {
    setFormData({
      leaveFormulaId: "",
      cutCode: "",
      cutRate: "",
    });
    handleCancel();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.cutCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this Overtime Formula?`}
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
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
        message={`Overtime Formula ${modalType}d successfully!`}
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
          <button className="reset" type="reset">
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
        <button className="add-button" onClick={handleAdd}>
          <FaPlus /> Add New Overtime Formula
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h4>Add New Overtime</h4>
          <input
            type="text"
            placeholder="Pay Code"
            value={formData.cutCode}
            onChange={(e) =>
              setFormData({ ...formData, cutCode: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Rate Per Hour"
            value={formData.cutRate}
            onChange={(e) =>
              setFormData({ ...formData, cutRate: e.target.value })
            }
          />
       
          <button className="submit-button" onClick={addOTF}>
            Add Overtime Formula
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-leave-form">
          <h4>Edit Overtime Formula</h4>
          <input
            type="text"
            placeholder="Pay Code"
            value={formData.cutCode}
            onChange={(e) =>
              setFormData({ ...formData, cutCode: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Rate Per Hour"
            value={formData.cutRate}
            onChange={(e) =>
              setFormData({ ...formData, cutRate: e.target.value })
            }
          />
         
          <button className="submit-button" onClick={() => updateOTF(formData)}>
            Update Overtime Formula
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
              <th>Formula ID</th>
              <th>Pay Code</th>
              <th>Rate Per Hour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.leaveFormulaId}>
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
