import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../Enrollment/Department/department.css";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";

const ShiftsTable = () => {
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const defaultFormData = {
    shiftId: "",
    employees: "",
    name: "",
    start_time: "",
    entry_start_time: "",
    entry_end_time: "",
    end_time: "",
    exit_start_time: "",
    exit_end_time: "",
    totalWorkingDays: "",
    totalWorkingHours: "",
    totalWorkingMinutes: "",
  } 
  const [formData, setFormData] = useState(defaultFormData);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchShift = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/fetchShift");
      if (response.ok) {
        const shift = await response.json();
        setData(shift);
      } else {
        throw new Error("Failed to fetch shift");
      }
    } catch (error) {
      console.error("Error fetching shift data:", error);
    } finally {
      setLoading(false);
    }
  }, [setData]);

  useEffect(() => {
    fetchShift();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchShift, successModal]);

 
  const handleEdit = (data) => {
    setFormData({
      _id: data._id,
      shiftId: data.shiftId,
      name: data.name,
      employees: data.employees,
      start_time: data.start_time,
      entry_start_time: data.entry_start_time,
      entry_end_time: data.entry_end_time,
      end_time: data.end_time,
      exit_start_time: data.exit_start_time,
      exit_end_time: data.exit_end_time,
      totalWorkingDays: data.totalWorkingDays,
      totalWorkingHours: data.totalWorkingHours,
      totalWorkingMinutes: data.totalWorkingMinutes,
    });
    console.log(formData)
    setShowAddForm(false);
    setShowEditForm(true);
  };



  const handleDelete = (shiftId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: shiftId });
  };
  const confirmDelete = async () => {
    axios.post("http://localhost:5000/api/deleteShift", {
      shiftId: formData._id,
    });
    const updatedData = await axios.get("http://localhost:5000/api/fetchShift");
    setData(updatedData.data);
    fetchShift();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    setFormData({
      shiftId: (data.length + 1).toString(),
      name: "",
      employees: "",
      start_time: "",
      entry_start_time: "",
      entry_end_time: "",
      end_time: "",
      exit_start_time: "",
      exit_end_time: "",
      totalWorkingDays: "",
      totalWorkingHours: "",
      totalWorkingMinutes: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const addShift = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    const newItem = {
      shiftId: parseInt(formData.shiftId, 10),
      employees: formData.employees,
      name: formData.name,
      start_time: formData.start_time,
      entry_start_time: formData.entry_start_time,
      entry_end_time: formData.entry_end_time,
      end_time: formData.end_time,
      exit_start_time: formData.exit_start_time,
      exit_end_time: formData.exit_end_time,
      totalWorkingDays: formData.totalWorkingDays,
      totalWorkingHours: formData.totalWorkingHours,
      totalWorkingMinutes: formData.totalWorkingMinutes,
    };
    try {
      await axios.post(`http://localhost:5000/api/addShift`, newItem);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchshift"
      );
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      setShowAddForm(false)
      fetchShift();
    } catch (error) {
      console.log(error);
    }
  };

  const updateShift = async(row) => {
    setModalType("update");
    setFormData({
      _id: row._id,
      shiftId: row.shiftId,
      employees: row.employees,
      name: row.name,
      start_time: row.start_time,
      entry_start_time: row.entry_start_time,
      entry_end_time: row.entry_end_time,
      end_time: row.end_time,
      exit_start_time: row.exit_start_time,
      exit_end_time: row.exit_end_time,
      totalWorkingDays: row.totalWorkingDays,
      totalWorkingHours: row.totalWorkingHours,
      totalWorkingMinutes: row.totalWorkingMinutes,
    });
    setShowModal(true);
  }
  const confirmUpdate = async () => {
    const updatedShift = {
      _id: formData._id,
      shiftId: parseInt(formData.shiftId, 10),
      employees: formData.employees,
      name: formData.name,
      start_time: formData.start_time,
      entry_start_time: formData.entry_start_time,
      entry_end_time: formData.entry_end_time,
      end_time: formData.end_time,
      exit_start_time: formData.exit_start_time,
      exit_end_time: formData.exit_end_time,
      totalWorkingDays: formData.totalWorkingDays,
      totalWorkingHours: formData.totalWorkingHours,
      totalWorkingMinutes: formData.totalWorkingMinutes,
    }
    try {
      await axios.post(`http://localhost:5000/api/updateShift`, updatedShift);
      setShowModal(false);
      setSuccessModal(true);
      fetchShift();
    } catch (error) {
      console.log(error);
    }

  }


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this Shift?`}
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
        message={`Shift ${modalType}d successfully!`}
        onConfirm={() => setSuccessModal(false)}
        onCancel={() => setSuccessModal(false)}
        animationData={successAnimation}
        successModal={successModal}
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
            type="button"
            onClick={() => setSearchQuery("")} 
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
        <button className="add-button" onClick={handleAdd}>
          <FaPlus></FaPlus>
          Add New Shift
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add New Shift</h3>
          <input
            type="text"
            placeholder="Shift ID"
            value={formData.shiftId}
            onChange={(e) =>
              setFormData({ ...formData, shiftId: e.target.value })
            }
          />
          <input
            type="Number"
            placeholder="Employees"
            value={formData.employees}
            onChange={(e) =>
              setFormData({ ...formData, employees: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Shift Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <h5>Entry Time Configuration</h5>
          <div className="form-time">
            <div>
              <label>Start Time</label>
              <input
                type="time"
                placeholder="Start Time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Entry Start Time</label>
              <input
                type="time"
                placeholder="Entry Start Time"
                value={formData.entry_start_time}
                onChange={(e) =>
                  setFormData({ ...formData, entry_start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Entry End Time</label>
              <input
                type="time"
                placeholder="Entry End Time"
                value={formData.entry_end_time}
                onChange={(e) =>
                  setFormData({ ...formData, entry_end_time: e.target.value })
                }
              />
            </div>
          </div>
          <h5>Exit Time Configuration</h5>
          <div className="form-time">
            <div>
              <label>End Time</label>
              <input
                type="time"
                placeholder="End Time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Exit Start Time</label>
              <input
                type="time"
                placeholder="Exit Start Time"
                value={formData.exit_start_time}
                onChange={(e) =>
                  setFormData({ ...formData, exit_start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Exit End Time</label>
              <input
                type="time"
                placeholder="Exit End Time"
                value={formData.exit_end_time}
                onChange={(e) =>
                  setFormData({ ...formData, exit_end_time: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label>Monthly Working Days</label>
            <input
              type="number"
              placeholder="Monthly Working Days"
              value={formData.totalWorkingDays}
              onChange={(e) =>
                setFormData({ ...formData, totalWorkingDays: e.target.value })
              }
            />
          </div>
          <div>
            <label>Daily Working Hours</label>
            <input
              type="number"
              placeholder="Daily Working Hours"
              value={formData.totalWorkingHours}
              onChange={(e) =>
                setFormData({ ...formData, totalWorkingHours: e.target.value })
              }
            />
          </div>
          <div>
            <label>Working Minutes</label>
            <input
              type="number"
              placeholder="Working Minutes"
              value={formData.totalWorkingMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalWorkingMinutes: e.target.value,
                })
              }
            />
          </div>
          <button className="submit-button" onClick={addShift}>
            Add Shift
          </button>
          <button className="cancel-button" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-department-form">
          <h3>Edit Shift</h3>
          <input
            type="text"
            placeholder="Shift ID"
            value={formData.shiftId}
            onChange={(e) =>
              setFormData({ ...formData, shiftId: e.target.value })
            }
          />
          <input
            type="Number"
            placeholder="Employees"
            value={formData.employees}
            onChange={(e) =>
              setFormData({ ...formData, employees: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Shift Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <h5>Entry Time Configuration</h5>
          <div className="form-time">
            <div>
              <label>Start Time</label>
              <input
                type="time"
                placeholder="Start Time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Entry Start Time</label>
              <input
                type="time"
                placeholder="Entry Start Time"
                value={formData.entry_start_time}
                onChange={(e) =>
                  setFormData({ ...formData, entry_start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Entry End Time</label>
              <input
                type="time"
                placeholder="Entry End Time"
                value={formData.entry_end_time}
                onChange={(e) =>
                  setFormData({ ...formData, entry_end_time: e.target.value })
                }
              />
            </div>
          </div>
          <h5>Exit Time Configuration</h5>
          <div className="form-time">
            <div>
              <label>End Time</label>
              <input
                type="time"
                placeholder="End Time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Exit Start Time</label>
              <input
                type="time"
                placeholder="Exit Start Time"
                value={formData.exit_start_time}
                onChange={(e) =>
                  setFormData({ ...formData, exit_start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Exit End Time</label>
              <input
                type="time"
                placeholder="Exit End Time"
                value={formData.exit_end_time}
                onChange={(e) =>
                  setFormData({ ...formData, exit_end_time: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label>Monthly Working Days</label>
            <input
              type="number"
              placeholder="Monthly Working Days"
              value={formData.totalWorkingDays}
              onChange={(e) =>
                setFormData({ ...formData, totalWorkingDays: e.target.value })
              }
            />
          </div>
          <div>
            <label>Daily Working Hours</label>
            <input
              type="number"
              placeholder="Daily Working Hours"
              value={formData.totalWorkingHours}
              onChange={(e) =>
                setFormData({ ...formData, totalWorkingHours: e.target.value })
              }
            />
          </div>
          <div>
            <label>Working Minutes</label>
            <input
              type="number"
              placeholder="Working Minutes"
              value={formData.totalWorkingMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalWorkingMinutes: e.target.value,
                })
              }
            />
          </div>
          <button className="submit-button" onClick={updateShift(formData)}>
            Update Shift
          </button>
          <button className="cancel-button" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </div>
      )}

      <div className="shift-table">
        <table className="table">
          <thead>
            <tr>
              <th>Shift ID</th>
              <th>Shift Name</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.shiftId}>
                <td>{item.shiftId}</td>
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
                    onClick={() => handleDelete(item._id)}
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

export default ShiftsTable;
