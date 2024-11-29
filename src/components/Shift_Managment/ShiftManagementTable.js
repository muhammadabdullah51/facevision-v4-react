import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../Enrollment/Department/department.css";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";

const ShiftManagementTable = () => {
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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
  const [formData, setFormData] = useState({
    shiftId: "",
    name: "",
    entry_status: "",
    exit_status: "",
    start_time: "",
    end_time: "",
    entry_start_time: "",
    entry_end_time: "",
    exit_start_time: "",
    exit_end_time: "",
    holidays: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchShift = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}shft/`);
      console.log(response.data);
      setData(response.data);
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

  const handleDelete = (shiftId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, shiftId: shiftId });
  };
  const confirmDelete = async () => {
    await axios.post(`${SERVER_URL}shft-del/`, { shiftId: formData.shiftId });
    const updatedData = await axios.get(`${SERVER_URL}shft/`);
    setData(updatedData.data);
    fetchShift();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    setFormData({
      shiftId: "",
      name: "",
      entry_status: "",
      exit_status: "",
      start_time: "",
      end_time: "",
      entry_start_time: "",
      entry_end_time: "",
      exit_start_time: "",
      exit_end_time: "",
      holidays: [],
      // totalWorkingDays: "",
      // totalWorkingHours: "",
      // totalWorkingMinutes: "",
    });
    setSelectedItems([]);
    setShowAddForm(true);
  };

  const addShift = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.name === "" ||
      formData.start_time === "" ||
      formData.end_time === "" ||
      formData.exit_status === "" ||
      formData.entry_status === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const newItem = {
      name: formData.name,
      entry_status: formData.entry_status,
      exit_status: formData.exit_status,
      start_time: formData.start_time,
      end_time: formData.end_time,
      entry_start_time: formData.entry_start_time,
      entry_end_time: formData.entry_end_time,
      exit_start_time: formData.exit_start_time,
      exit_end_time: formData.exit_end_time,
      holidays: selectedItems,
    };
    try {
      const response = await axios.post(`${SERVER_URL}shft/`, newItem);
      console.log(response);
      console.log("Shift Added Successfully");
      setShowAddForm(false);
      setResMsg(response.data.msg);
      setShowModal(false);
      setSuccessModal(true);
      fetchShift();
      // setSelectedItems(null);

      const updatedData = await axios.get(`${SERVER_URL}shft/`);
      console.log(updatedData.data);
      setData(updatedData.data);
      // setShowAddForm(false)
    } catch (error) {
      console.log(error);
      setShowModal(false);
      setWarningModal(true);
    }
    setFormData({
      shiftId: "",
      name: "",
      entry_status: "",
      exit_status: "",
      start_time: "",
      end_time: "",
      entry_start_time: "",
      entry_end_time: "",
      exit_start_time: "",
      exit_end_time: "",
      totalWorkingDays: "",
      totalWorkingHours: "",
      totalWorkingMinutes: "",
      holidays: [],
    });
  };

  const handleEdit = (row) => {
    console.log("row", row);
    setFormData({
      shiftId: row.shiftId,
      name: row.name,
      entry_status: row.entry_status,
      exit_status: row.exit_status,
      start_time: row.start_time,
      end_time: row.end_time,
      entry_start_time: row.entry_start_time,
      entry_end_time: row.entry_end_time,
      exit_start_time: row.exit_start_time,
      exit_end_time: row.exit_end_time,
      holidays: row.holidays || [],
      totalWorkingDays: row.totalWorkingDays,
      totalWorkingHours: row.totalWorkingHours,
      totalWorkingMinutes: row.totalWorkingMinutes,
    });
    setSelectedItems(row.holidays || []);
    console.log("handleEdit", formData);
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateShift = async (row) => {
    setModalType("update");
    setFormData({
      shiftId: row.shiftId,
      name: row.name,
      entry_status: row.entry_status,
      exit_status: row.exit_status,
      start_time: row.start_time,
      end_time: row.end_time,
      entry_start_time: row.entry_start_time,
      entry_end_time: row.entry_end_time,
      exit_start_time: row.exit_start_time,
      exit_end_time: row.exit_end_time,
      holidays: row.holidays || [],
      totalWorkingDays: row.totalWorkingDays,
      totalWorkingHours: row.totalWorkingHours,
      totalWorkingMinutes: row.totalWorkingMinutes,
    });
    setSelectedItems(row.holidays || []);
    setShowModal(true);
    console.log("updateShift", formData);
  };

  const formatTime = (time) => {
    // Ensure the time exists and split to take only hours and minutes
    return time ? time.split(":").slice(0, 2).join(":") : "";
  };

  const confirmUpdate = async () => {
    if (
      !formData.name ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.entry_start_time ||
      !formData.exit_status ||
      !formData.entry_status
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    //  console.log(formData);

    const updatedShift = {
      shiftId: formData.shiftId,
      name: formData.name,
      entry_status: formData.entry_status,
      exit_status: formData.exit_status,
      start_time: formatTime(formData.start_time),
      end_time: formatTime(formData.end_time),
      entry_start_time: formatTime(formData.entry_start_time),
      entry_end_time: formatTime(formData.entry_end_time),
      exit_start_time: formatTime(formData.exit_start_time),
      exit_end_time: formatTime(formData.exit_end_time),
      holidays: selectedItems,
    };
    console.log("confirmEdit", formData);
    try {
      const res = await axios.post(`${SERVER_URL}shft-up/`, updatedShift);
      console.log("Shift updated successfully");
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      setSelectedItems([]);
      const updatedData = await axios.get(`${SERVER_URL}shft/`);
      setData(updatedData.data);
    } catch (error) {
      console.error("Error updating shift:", error);
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shiftId.toString().includes(searchQuery) ||
      item.start_time.toLowerCase().includes(searchQuery) ||
      item.end_time.toLowerCase().includes(searchQuery) ||
      item.exit_status.toLowerCase().includes(searchQuery) ||
      item.entry_status.toLowerCase().includes(searchQuery) ||
      item.holidays.map((holiday) => holiday.toLowerCase()).includes(searchQuery)
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
            <div>
              <label>On Entry Late</label>
              <select
                className="selectbox"
                name="entry_status"
                value={formData.entry_status}
                onChange={(e) =>
                  setFormData({ ...formData, entry_status: e.target.value })
                }
              >
                <option value="">Select Option</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
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
            <div>
              <label>On Exit Late</label>
              <select
                className="selectbox"
                name="exit_status"
                value={formData.exit_status}
                onChange={(e) =>
                  setFormData({ ...formData, exit_status: e.target.value })
                }
              >
                <option value="">Select Option</option>
                <option value="Late">Late</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
          </div>
          <h4>Select Holidays:</h4>
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
          <button className="submit-button" onClick={addShift}>
            Add Shift
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-department-form">
          <h3>Update Shift</h3>
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
            <div>
              <label>On Entry Late</label>
              <select
                className="selectbox"
                name="entry_status"
                value={formData.entry_status}
                onChange={(e) =>
                  setFormData({ ...formData, entry_status: e.target.value })
                }
              >
                <option value="">Select Option</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
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
            <div>
              <label>On Exit Late</label>
              <select
                className="selectbox"
                name="exit_status"
                value={formData.exit_status}
                onChange={(e) =>
                  setFormData({ ...formData, exit_status: e.target.value })
                }
              >
                <option value="">Select Option</option>
                <option value="Late">Late</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
          </div>
          <h4>Select Holidays:</h4>
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
                        holidays: checked
                          ? [...prevFormData.holidays, value]
                          : prevFormData.holidays.filter((i) => i !== value),
                      }));
                    }}
                  />
                  <span className="checkmark"></span>
                  {item}
                </label>
              </div>
            ))}
          </div>
          <button
            className="submit-button"
            onClick={() => updateShift(formData)}
          >
            Update Shift
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowEditForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="departments-table">
        <table className="table">
          <thead>
            <tr>
              <th>Shift ID</th>
              <th>Shift Name</th>
              <th>Entry Time</th>
              <th>On Entry Late</th>
              <th>Exit Time</th>
              <th>On Exit Late</th>
              <th>Holidays</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.shiftId}</td>
                <td>{item.name}</td>
                <td>{item.start_time}</td>
                <td>
                  <span
                    className={` ${
                      item.entry_status === "Late" ? "late" : "disconnected"
                    }`}
                  >
                    {item.entry_status}
                  </span>
                </td>
                <td>{item.end_time}</td>
                <td>
                  <span
                    className={` ${
                      item.exit_status === "Late" ? "late" : "not-late"
                    }`}
                  >
                    {item.exit_status}
                  </span>
                </td>
                <td className="accessible-items">
                  {Array.isArray(item.holidays) && item.holidays.length > 0
                    ? item.holidays.map((holiday, index) => (
                        <span key={index} style={{ marginRight: "5px" }}>
                          {holiday}
                        </span>
                      ))
                    : "No Holidays"}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.shiftId)}
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

export default ShiftManagementTable;
