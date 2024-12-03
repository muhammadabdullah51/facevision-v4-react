import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { SERVER_URL } from "../../config";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";

const BreakManagementTable = () => {
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
    const [loading, setLoading] = useState(false); // Loading state
  
    const [warningModal, setWarningModal] = useState(false);
    const [resMsg, setResMsg] = useState("");
  
    const fetchLvs = useCallback(async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}brk-sch/`);
        console.log(response.data);
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
        id: row.id,
        name: row.name,
        start_time: row.start_time,
        end_time: row.end_time,
      });
      setShowModal(true);
    };
    const confirmUpdate = async() => {
      if(!formData.name || !formData.start_time || !formData.end_time ){
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
        console.log("Leave updated successfullykjljkljkl");
        setShowEditForm(false);
        setShowModal(false);
        setSuccessModal(true);
        setResMsg(res.data.msg)
        const updatedData = await axios.get(`${SERVER_URL}brk-sch/`);
        setData(updatedData.data);
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
      if(!formData.name ||!formData.start_time ||!formData.end_time){
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
        console.log("Leave Added Successfully")
        setShowAddForm(false);
        setResMsg(response.data.msg)
        setShowModal(false);
        setSuccessModal(true)
        const updatedData = await axios.get(`${SERVER_URL}brk-sch/`);
        setData(updatedData.data);
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
      setFormData({...formData, id: id})
    };
    const confirmDelete = async () => {
      await axios.delete(`${SERVER_URL}brk-sch/${formData.id}/`);
      const updatedData = await axios.get(`${SERVER_URL}brk-sch/`);
      setData(updatedData.data);
      fetchLvs();
      setShowModal(false);
      setSuccessModal(true);
    }
    const resetForm = () => {
      setFormData({
        name: "",
        start_time: "",
        end_time: "",
      });
      handleCancel();
    };
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <div className="department-table">
        <ConirmationModal
          isOpen={showModal}
          message={`Are you sure you want to ${modalType} this Break?`}
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
          message={`Break ${modalType}d successfully!`}
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
          <button className="add-button" onClick={handleAdd}>
            <FaPlus /> Add New Break Schedule
          </button>
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
            <label>Break Start Time</label>
            <input
              type="time"
              placeholder="Break Start Time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
            }
            />
            <label>Break End Time</label>
            <input
              type="time"
              placeholder="Break End Time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
            />
         
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
            <label>Break Start Time</label>
            <input
              type="time"
              placeholder="Break Start Time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
            />
            <label>Break End Time</label>
            <input
              type="time"
              placeholder="Break End Time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
            />
           
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
