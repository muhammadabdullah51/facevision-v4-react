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
import BreakManagementTable from "./BreakManagementTable";
import { useDispatch, useSelector } from "react-redux";
import { saveFormState, saveSelectedItems } from "../../redux/ShiftSlice";
import Select from "react-select";

const ShiftManagementTable = () => {
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [brk, setBrk] = useState("");
  const [childBrk, setChildBrk] = useState("");

  const handleBreaks = async (updatedbreak) => {
    try {
      setChildBrk(updatedbreak);
      const response = await axios.get(`${SERVER_URL}brk-sch/`);
      setChildBrk(response.data);
    } catch (error) {
      console.error("Error fetching break:", error);
    }
  }

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const savedFormState = useSelector((state) => state.forms.formStates.shifts || {});
  const savedSelectedItems = useSelector((state) => state.forms.selectedItems.shifts || []);

  const dispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState(savedSelectedItems);

  const [formData, setFormData] = useState(
    savedFormState || {
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
      bkId: "",
    });
  const [editFormData, setEditFormData] = useState(
    {
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
      bkId: "",
    });

  // Saving form state
  useEffect(() => {
    dispatch(saveFormState({ formName: "shifts", data: formData }));
  }, [formData, dispatch]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      dispatch(saveSelectedItems({ formName: "shifts", items: selectedItems }));
    }
  }, [selectedItems, dispatch]);


  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchShift = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}shft/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  }, [setData]);

  const fetchBreak = useCallback(

    async () => {
      try {
        const response = await axios.get(`${SERVER_URL}brk-sch/`);
        setBrk(response.data);
      } catch (error) {
        console.error("Error fetching break:", error);
      }
    }, [setBrk]
  )

  useEffect(() => {
    fetchShift();
    fetchBreak();
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
    setFormData(
      savedFormState || {
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
        bkId: "",
      });
    setSelectedItems([]);
    setShowAddForm(true);
    setShowEditForm(false);
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
      formData.entry_status === "" ||
      formData.bkId === ""
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
      bkId: formData.bkId,
    };
    try {
      const response = await axios.post(`${SERVER_URL}shft/`, newItem);
      setShowAddForm(false);
      setResMsg(response.data.msg);
      setShowModal(false);
      setSuccessModal(true);
      fetchShift();
      // setSelectedItems(null);

      // Reset formData and selectedItems
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
        bkId: "",
      });
      setSelectedItems([]);

      const updatedData = await axios.get(`${SERVER_URL}shft/`);
      setData(updatedData.data);
      // setShowAddForm(false)
    } catch (error) {
      setShowModal(false);
      setWarningModal(true);
    }
  };

  const handleEdit = (row) => {
    setEditFormData({
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
      bkId: row.bkId,
    });
    setSelectedItems(row.holidays || []);
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const updateShift = async (row) => {
    setModalType("update");
    setEditFormData({
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
      bkId: row.bkId,
    });
    setSelectedItems(row.holidays || []);
    setShowModal(true);
  };

  const formatTime = (time) => {
    // Ensure the time exists and split to take only hours and minutes
    return time ? time.split(":").slice(0, 2).join(":") : "";
  };

  const confirmUpdate = async () => {
    if (
      !editFormData.name ||
      !editFormData.start_time ||
      !editFormData.end_time ||
      !editFormData.entry_start_time ||
      !editFormData.exit_status ||
      !editFormData.entry_status ||
      editFormData.bkId === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const updatedShift = {
      shiftId: editFormData.shiftId,
      name: editFormData.name,
      entry_status: editFormData.entry_status,
      exit_status: editFormData.exit_status,
      start_time: formatTime(editFormData.start_time),
      end_time: formatTime(editFormData.end_time),
      entry_start_time: formatTime(editFormData.entry_start_time),
      entry_end_time: formatTime(editFormData.entry_end_time),
      exit_start_time: formatTime(editFormData.exit_start_time),
      exit_end_time: formatTime(editFormData.exit_end_time),
      bkId: editFormData.bkId,
      holidays: selectedItems,
    };
    try {
      const res = await axios.post(`${SERVER_URL}shft-up/`, updatedShift);
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      // Reset formData and selectedItems
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
        bkId: "",
      });
      setSelectedItems([]);
      const updatedData = await axios.get(`${SERVER_URL}shft/`);
      setData(updatedData.data);
    } catch (error) {
      console.error("Error updating shift:", error);
      setShowModal(false);
      setWarningModal(true);
    }
  };

  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shiftId.toString().includes(searchQuery) ||
      item.start_time.toLowerCase().includes(searchQuery) ||
      item.end_time.toLowerCase().includes(searchQuery) ||
      item.exit_status.toLowerCase().includes(searchQuery) ||
      item.entry_status.toLowerCase().includes(searchQuery) ||
      item.holidays
        .map((holiday) => holiday.toLowerCase())
        .includes(searchQuery)
  );

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = filteredData.map((row) => row.shiftId);
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
      await axios.post(`${SERVER_URL}shft/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}shft/`);
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

  const dayOptions = days.map((day) => ({ value: day, label: day }));
  const handleSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    // Update selected items
    setSelectedItems(selectedValues);

    // Update editFormData
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      holidays: selectedValues,
    }));
    
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Shift?`
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
            : `Shift ${modalType}d successfully!`
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
        <div className="add-delete-conainer">

          <button className="add-button" onClick={handleAdd}>
            <FaPlus></FaPlus>
            Add New Shift
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-department-form add-leave-form">
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
          <h4>Break</h4>
          <select
            value={formData.bkId} // Bind to the selected bkId
            onChange={(e) => {
              setFormData({
                ...formData,
                bkId: e.target.value, // Update bkId in formData
              });
            }}
          >
            <option value="">Select Break</option> {/* Placeholder option */}
            {childBrk.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <h4>Select Holidays:</h4>
          <div className="item-list-Selected">


            {/* {days.map((item) => (
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
            ))} */}

            <Select
              isMulti
              style={{paddd:'100%'}}
              options={dayOptions}
              value={selectedItems.map((item) => ({ value: item, label: item }))}
              onChange={(selectedOptions) => {
                setSelectedItems(selectedOptions.map((option) => option.value));
              }}
              placeholder="Select days"
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 1050, // Set a higher z-index for the dropdown
                }),
              }}
            />
          
          </div>
          <button className="submit-button" onClick={addShift}>
            Add Shift
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowAddForm(false)
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
                bkId: "",
              });
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {!showAddForm && showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Update Shift</h3>
          <input
            type="text"
            placeholder="Shift Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
          />
          <h5>Entry Time Configuration</h5>
          <div className="form-time">
            <div>
              <label>Start Time</label>
              <input
                type="time"
                placeholder="Start Time"
                value={editFormData.start_time}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Entry Start Time</label>
              <input
                type="time"
                placeholder="Entry Start Time"
                value={editFormData.entry_start_time}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, entry_start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Entry End Time</label>
              <input
                type="time"
                placeholder="Entry End Time"
                value={editFormData.entry_end_time}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, entry_end_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>On Entry Late</label>
              <select
                className="selectbox"
                name="entry_status"
                value={editFormData.entry_status}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, entry_status: e.target.value })
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
                value={editFormData.end_time}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, end_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Exit Start Time</label>
              <input
                type="time"
                placeholder="Exit Start Time"
                value={editFormData.exit_start_time}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, exit_start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>Exit End Time</label>
              <input
                type="time"
                placeholder="Exit End Time"
                value={editFormData.exit_end_time}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, exit_end_time: e.target.value })
                }
              />
            </div>
            <div>
              <label>On Exit Late</label>
              <select
                className="selectbox"
                name="exit_status"
                value={editFormData.exit_status}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, exit_status: e.target.value })
                }
              >
                <option value="">Select Option</option>
                <option value="Late">Late</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
          </div>
          <h4>Break</h4>
          <select
            value={editFormData.bkId} // Bind to the selected bkId
            onChange={(e) => {
              setEditFormData({
                ...editFormData,
                bkId: e.target.value, // Update bkId in formData
              });
            }}
          >
            <option value="">Select Break</option> {/* Placeholder option */}
            {brk.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {/* Display the name */}
              </option>
            ))}
          </select>
          <h4>Select Holidays:</h4>
          <div className="item-list-Selected">
            {/* {days.map((item) => (
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
                      setEditFormData((prevFormData) => ({
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
            ))} */}


            <Select
              isMulti
              options={dayOptions}
              value={selectedItems.map((item) => ({ value: item, label: item }))}
              onChange={handleSelectChange}
              placeholder="Select holidays"
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 1050, // Set a higher z-index for the dropdown
                }),
              }}
            />
          
          </div>
          <button
            className="submit-button"
            onClick={() => updateShift(editFormData)}
          >
            Update Shift
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowEditForm(false)
              setEditFormData({
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
                bkId: "",
              });
            }}
          >
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
              <th>Shift ID</th>
              <th>Shift Name</th>
              <th>Entry Time</th>
              <th>On Entry Late</th>
              <th>Exit Time</th>
              <th>On Exit Late</th>
              <th>Break</th>
              <th>Holidays</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(item.shiftId)}
                    onChange={(event) => handleRowCheckboxChange(event, item.shiftId)}
                  />
                </td>
                <td>{item.shiftId}</td>
                <td>{item.name}</td>
                <td>{item.start_time}</td>
                <td>
                  <span
                    className={` ${item.entry_status === "Late" ? "late" : "not-late"
                      }`}
                  >
                    {item.entry_status}
                  </span>
                </td>
                <td>{item.end_time}</td>
                <td>
                  <span
                    className={` ${item.exit_status === "Late" ? "late" : "not-late"
                      }`}
                  >
                    {item.exit_status}
                  </span>
                </td>
                <td>{item.breakname}</td>
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
      <div className="break-table">
        <BreakManagementTable onDataUpdate={handleBreaks} />
      </div>
    </div>
  );
};

export default ShiftManagementTable;
