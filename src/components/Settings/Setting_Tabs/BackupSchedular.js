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
const BackupSchedular = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedItems, setSelectedItems] = useState([]);

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    sch: "",
    time: "",
    day: [],
    status: "",
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
      const response = await axios.get(`${SERVER_URL}sett-edtr-sch/`);
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
    setFormData({
      id: row.id,
      name: row.name,
      email: row.email,
      sch: row.sch,
      timeobj: row.timeobj,
      date: row.date,
      status: row.status,
      day: row.day || [],
    });
    setSelectedItems(row.day);
    console.log(row);
    setShowAddForm(false);
    setShowEditForm(true);
  };
  const updateOTF = async (row) => {
    setModalType("update");
    setFormData({
      id: row.id,
      name: row.name,
      email: row.email,
      sch: row.sch,
      time: row.timeobj,
      date: row.date,
      day: row.day || [],
      status: row.status,
    });
    console.log(formData)
    setSelectedItems(row.day || []);
    setShowModal(true);
    console.log("asdasdaas")

    console.log(selectedItems)
  };
  const confirmUpdate = async () => {
    console.log("confirmUpdate me agya hun me")
    console.log(selectedItems)
    if (
      !formData.name ||
      !formData.email ||
      !formData.sch ||
      !formData.time ||
      !formData.status
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.sch == "Weekly") {
      if (selectedItems.length < 1) {
        console.log("asdas");
        setResMsg("Please select at least one day for weekly schedule.");
        setShowModal(false);
        setWarningModal(true);
        return;
      }
    }

    setSelectedItems(formData.day || []);
    const updatedOTF = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      sch: formData.sch,
      time: formData.time,
      date: formData.date,
      status: formData.status,
      day: selectedItems,
    };
    try {
      const res = await axios.post(`${SERVER_URL}sett-edtr-sch-up/`, updatedOTF);
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setResMsg(res.data.msg);
      const updatedData = await axios.get(`${SERVER_URL}sett-edtr-sch/`);
      setData(updatedData.data);
    } catch (error) {
      console.error("Error updating Leave:", error);
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      email: "",
      sch: "",
      time: "",
      day: [],
      status: "",
    });
    setSelectedItems([]);
    setShowAddForm(true);
  };
  const addOTF = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.sch ||
      !formData.time ||
      !formData.status
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    if (formData.sch == "Weekly") {
      if (selectedItems.length < 1) {
        console.log("asdas");
        setResMsg("Please select at least one day for weekly schedule.");
        setShowModal(false);
        setWarningModal(true);
        return;
      }
    }
    const newOTF = {
      name: formData.name,
      email: formData.email,
      sch: formData.sch,
      time: formData.time,
      day: selectedItems,
      status: formData.status,
    };
    console.log(newOTF);

    try {
      const response = await axios.post(`${SERVER_URL}sett-edtr-sch/`, newOTF);
      setShowAddForm(false);
      setResMsg(response.data.msg);
      setShowModal(false);
      setSuccessModal(true);
      const updatedData = await axios.get(`${SERVER_URL}sett-edtr-sch/`);
      setData(updatedData.data);
      // setShowAddForm(false)
    } catch (error) {
      console.log(error);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    setShowModal(true);
    setModalType("delete");
    setFormData({ ...formData, id: id });
    console.log(formData.id)
  };
  const confirmDelete = async () => {
    await axios.post(`${SERVER_URL}sett-edtr-sch-del/`, { id: formData.id });
    const updatedData = await axios.get(`${SERVER_URL}sett-edtr-sch/`);
    setData(updatedData.data);
    fetchLvs();
    setShowModal(false);
    setSuccessModal(true);
  };
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      sch: "",
      time: "",
      day: [],
      status: "",
    });
    handleCancel();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
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
      const response = await axios.post(`${SERVER_URL}editor/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}sett-edtr-sch/`);
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
            : `Are you sure you want to ${modalType} this Backup Scheduler?`
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
            : `Backup Scheduler ${modalType}d successfully!`
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
            <FaPlus /> Add New Backup Scheduler
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-leave-form">
          <h4>Add Backup Scheduler</h4>
          <label>Name</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <label>Schedule</label>
          <select
            value={formData.sch}
            onChange={(e) => setFormData({ ...formData, sch: e.target.value })}
          >
            <option value="">Select Schedule</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>

          {formData.sch === "Daily" && (
            <>
              <label>Time</label>
              <input
                type="time"
                placeholder="Time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </>
          )}
          {formData.sch === "Monthly" && (
            <>
              <label>Time</label>
              <input
                type="datetime-local"
                placeholder="Time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </>
          )}
          {formData.sch === "Weekly" && (
            <>
              <div className="item-list-Selected">
                {days.map((item) => (
                  <div className="items" key={item}>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        value={item}
                        checked={selectedItems.includes(item)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setSelectedItems((prevItems) =>
                            checked
                              ? [...prevItems, value]
                              : prevItems.filter((i) => i !== value)
                          );
                        }}
                      />
                      <span className="checkmark"></span>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
              <label>Time</label>
              <input
                type="time"
                placeholder="Time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </>
          )}

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

          <button className="submit-button" onClick={addOTF}>
            Add Backup Scheduler
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-leave-form">
          <h4>Add Backup Scheduler</h4>
          <label>Name</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <label>Schedule</label>
          <select
            disabled
            value={formData.sch}
            onChange={(e) => setFormData({ ...formData, sch: e.target.value })}
          >
            <option value="">Select Schedule</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>

          {formData.sch === "Daily" && (
            <>
              <label>Time</label>
              <input
                type="time"
                placeholder="Time"
                value={formData.timeobj}
                onChange={(e) =>
                  setFormData({ ...formData, timeobj: e.target.value })
                }
              />
            </>
          )}
          {formData.sch === "Monthly" && (
            <>
              <label>Date</label>
              <input
                type="date"
                placeholder="Date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
              <label>Time</label>
              <input
                type="time"
                placeholder="Time"
                value={formData.timeobj}
                onChange={(e) =>
                  setFormData({ ...formData, timeobj: e.target.value })
                }
              />
            </>
          )}
          {formData.sch === "Weekly" && (
            <>
              <div className="item-list-Selected">
                {days.map((item) => (
                  <div className="items" key={item}>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        value={item}
                        checked={selectedItems.includes(item)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setSelectedItems((prevItems) =>
                            checked
                              ? [...prevItems, value]
                              : prevItems.filter((i) => i !== value)
                          );
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            day: checked
                              ? [...(prevFormData.day || []), value] // Ensure 'days' is an array
                              : (prevFormData.day || []).filter((i) => i !== value), // Safely filter
                          }));
                        }}
                      />
                      <span className="checkmark"></span>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
              <label>Time</label>
              <input
                type="time"
                placeholder="Time"
                value={formData.timeobj}
                onChange={(e) =>
                  setFormData({ ...formData, timeobj: e.target.value })
                }
              />
            </>
          )}

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

          <button className="submit-button" onClick={() => updateOTF(formData)}>
            Update Backup Scheduler
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
              <th>Name</th>
              <th>Email</th>
              <th>Scheduler</th>
              <th>Days</th>
              <th>Time</th>
              <th>Status</th>
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
                <td>{item.email}</td>
                <td>{item.sch}</td>
                <td className="accessible-items">
                  {Array.isArray(item.day) && item.day.length > 0
                    ? item.day.map((day, index) => (
                      <span key={index} style={{ marginRight: "5px" }}>
                        {day}
                      </span>
                    ))
                    : item.sch == "Monthly"
                      ? item.date
                      : "All Working days"}
                </td>
                <td>{item.timeobj}</td>
                <td>{item.status}</td>
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

export default BackupSchedular;
