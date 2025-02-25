import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./devices.css";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";

import { useDispatch, useSelector } from "react-redux";
import { setHDeviceData, resetHDeviceData } from "../../redux/deviceSlice";


const DeviceTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [locations, setLocations] = useState([]);

  const fetchloc = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-loc/`);
      const location = response.data.context;
      setLocations(location);
    } catch (error) {
    }
  };


  const dispatch = useDispatch();
  const deviceData = useSelector((state) => state.device);

  const [formData, setFormData] = useState(
    deviceData || {
      cameraId: null,
      cameraName: "",
      cameraIp: "",
      port: "",
      locId: "",
    });

  const handleReset = () => {
    dispatch(resetHDeviceData());
    setFormData({
      cameraId: null,
      cameraName: "",
      cameraIp: "",
      port: "",
      locId: "",

    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const [editFormData, setEditFormData] = useState({
    cameraId: null,
    cameraName: "",
    cameraIp: "",
    port: "",
    locId: "",
    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      dispatch(setHDeviceData(updatedFormData));
      return updatedFormData;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchDevices = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}device/`);
      const devices = await response.data.context;
      setData(devices);
      console.log(devices);
    } catch (error) {
    }
  }, [setData]);

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchDevices();
    fetchloc();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchDevices, successModal]);



  const handleDownload = async (rowData) => {
    const requestData = {
      cameraIp: rowData.cameraIp,
      port: rowData.port,
    };

    try {
      await axios.post(`${SERVER_URL}fetch-data/`, requestData);
    } catch (error) {
      console.log(error);
    }
  };



  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [data, searchQuery]
  );

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = filteredData.map((row) => row.cameraId);
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
        // Add the row ID to selected IDs
        return [...prevSelectedIds, rowId];
      } else {
        // Remove the row ID from selected IDs
        const updatedIds = prevSelectedIds.filter((id) => id !== rowId);
        if (updatedIds.length !== filteredData.length) {
          setSelectAll(false); // Uncheck "Select All" if a row is deselected
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
    } else if (selectedIds.length < 1) {
      setResMsg("No rows selected for deletion.");
      setShowModal(false);
      setWarningModal(true);
    }
  };


  const confirmBulkDelete = async () => {
    try {
      const payload = { ids: selectedIds };
      await axios.post(`${SERVER_URL}device/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}device/`);
      setData(updatedData.data.context);
      setShowModal(false);
      setSelectedIds([]);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting rows:", error);
    } finally {
      setShowModal(false);
    }
  };


  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            id="delete-checkbox"
            type="checkbox"
            checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
            onChange={handleSelectAllChange} // Function to handle "Select All"
          />
        ),
        Cell: ({ row }) => (
          <input
            id="delete-checkbox"
            type="checkbox"
            checked={selectedIds.includes(row.original.cameraId)} // Use an appropriate unique field for row identification
            onChange={(event) => handleRowCheckboxChange(event, row.original.cameraId)} // Row selection handler
          />
        ),
        id: "selection",
      },
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Device Name",
        accessor: "cameraName",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Device IP",
        accessor: "cameraIp",
        Cell: ({ row, value }) => (
          <span className="bold-fonts">
            {row.original.status === "Connected" && (
              <span className="green-dot"></span>
            )}
            {row.original.status !== "Connected" && (
              <span className="red-dot"></span>
            )}
            {value}
          </span>
        ),
      },
      {
        Header: "Device Port",
        accessor: "port",
      },
      {
        Header: "Location",
        accessor: "locName",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status ${value === "Connected" ? "connected" : "disconnected"
              }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div>
            <button
              onClick={() => handleEdit(row.original)}
              style={{ background: "none", border: "none" }}
            >
              <FaEdit className="table-edit" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              style={{ background: "none", border: "none" }}
            >
              <FaTrash className="table-delete" />
            </button>
            <button
              onClick={() => handleDownload(row.original)}
              style={{ background: "none", border: "none" }}
            >
              <FaDownload className="table-edit" />
            </button>
          </div>
        ),
      },
    ],
    [filteredData, selectedIds] // Ensure the columns are updated when the filteredData or selectedIds change
  );




  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    gotoPage,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const handleEdit = (row) => {
    console.log(row.locId);
    setEditFormData({
      cameraId: row.cameraId,
      cameraName: row.cameraName,
      cameraIp: row.cameraIp,
      port: row.port,
      locId: row.locId,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleDelete = async (row) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, cameraId: row.cameraId });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}device-del/`, {
        cameraId: formData.cameraId,
      });
      const updatedData = await axios.get(`${SERVER_URL}device/`);
      setData(updatedData.data.context);
      fetchDevices();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    fetchDevices();
  };

  const addDevice = async () => {
    setModalType("create");
    setShowModal(true);
    console.log(formData);
  };
  const confirmAdd = async () => {
    if (
      formData.cameraName === "" ||
      formData.cameraIp === "" ||
      formData.port === "" ||
      formData.locId === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const newDevice = {
      cameraName: formData.cameraName,
      cameraIp: formData.cameraIp,
      port: formData.port,
      locId: formData.locId,
    };

    try {
      const res = await axios.post(`${SERVER_URL}device/`, newDevice);
      setShowAddForm(false);
      setResMsg(res.data.msg);
      if (res.data.status) {
        setShowModal(false);
        setSuccessModal(true);
        fetchDevices();
      } else {
        setShowModal(false);
        setWarningModal(true);
      }
      const updatedData = await axios.get(`${SERVER_URL}device/`);
      setData(updatedData.data.context);
      setShowAddForm(false);
      setShowEditForm(false);
      setShowModal(false);
      fetchDevices();
      handleReset()
    } catch (error) {
      setWarningModal(true);
    }


    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (
      editFormData.cameraName === "" ||
      editFormData.cameraIp === "" ||
      editFormData.port === "" ||
      editFormData.locId === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updatedDevice = {
      cameraId: editFormData.cameraId,
      cameraName: editFormData.cameraName,
      cameraIp: editFormData.cameraIp,
      port: editFormData.port,
      locId: editFormData.locId,
    };

    try {
      const res = await axios.post(`${SERVER_URL}device-up/`, updatedDevice);
      fetchDevices();

      setShowEditForm(false);
      setShowModal(false);
      setResMsg(res.data.msg);
      if (res.data.status) {
        setSuccessModal(true);
        fetchDevices();
      } else {
        setShowModal(false);
        setWarningModal(true);
      }

      const updatedData = await axios.get(`${SERVER_URL}device/`);
      setData(updatedData.data.context);
      handleReset()
    } catch (error) {
      setWarningModal(true);
    }
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Device?`
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
            : `Device ${modalType}d successfully!`
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
        <div className="add-delete-conainer" >
          <button className="add-button" onClick={handleAdd}>
            <FaPlus className="add-icon" /> Add New Device
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {/* Add Device Form */}
      {showAddForm && (
        <div className="add-department-form add-leave-form">
          <h3>Add New Device</h3>
          <label>Device Name</label>
          <input
            type="text"
            name="cameraName"
            placeholder="Device Name"
            value={formData.cameraName}
            onChange={handleInputChange}
          />
          <label>Device IP</label>
          <input
            type="text"
            name="cameraIp"
            placeholder="Device IP"
            value={formData.cameraIp}
            onChange={handleInputChange}
          />
          <label>Device Port</label>
          <input
            type="text"
            name="port"
            placeholder="Device Port"
            value={formData.port}
            onChange={handleInputChange}
          />
          <label>Select Location</label>
          <select
            value={formData.locId}
            onChange={(e) =>
              setFormData({ ...formData, locId: e.target.value })
            }
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.locId} value={loc.locId}>
                {loc.name}
              </option>
            ))}
          </select>
          <button className="submit-button" onClick={addDevice}>
            Add Device
          </button>
          <button
            className="cancel-button"
            onClick={handleReset}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Edit Device Form */}
      {showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Edit Device</h3>
          <label>Device ID</label>
          <input
            type="text"
            placeholder="Device Name"
            value={editFormData.cameraName}
            onChange={(e) =>
              setEditFormData({ ...editFormData, cameraName: e.target.value })
            }
          />
          <label>Device IP</label>
          <input
            type="text"
            placeholder="Device IP"
            value={editFormData.cameraIp}
            onChange={(e) =>
              setEditFormData({ ...editFormData, cameraIp: e.target.value })
            }
          />
          <label>Device Port</label>
          <input
            type="text"
            placeholder="Device Port"
            value={editFormData.port}
            onChange={(e) => setEditFormData({ ...editFormData, port: e.target.value })}
          />
          <select
            value={editFormData.locId}
            onChange={(e) =>
              setEditFormData({ ...editFormData, locId: e.target.value })
            }
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.locId} value={loc.locId}>
                {loc.name}
              </option>
            ))}
          </select>
          <button className="submit-button" onClick={() => handleUpdate(editFormData)}>
            Update Device
          </button>
          <button
            className="cancel-button"
            onClick={handleReset}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="departments-table">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pageOptions.length}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={({ selected }) => gotoPage(selected)}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default DeviceTable;
