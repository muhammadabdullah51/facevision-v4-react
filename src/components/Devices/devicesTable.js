import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./devices.css"; // Custom CSS for styling
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";

const DeviceTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    cameraId: null,
    cameraName: "",
    cameraIp: "",
    port: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}device/`);
      const devices = await response.data.context;
      setData(devices);
      console.log(devices);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [setData]);

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchDevices();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchDevices, successModal]);

  const handleStatusToggle = useCallback(() => {
    setFormData((prevState) => ({
      ...prevState,
      status: prevState.status === "Active" ? "Inactive" : "Active",
    }));
  }, []);


  const handleDownload = async (rowData) => {
    const requestData = {
      cameraIp: rowData.cameraIp,
      port: rowData.port,
    };

    try {
      // Send the POST request
      const response = await axios.post(`${SERVER_URL}fetch-data/`, requestData);
      // }
    } catch (error) {
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
      const response = await axios.post(`${SERVER_URL}device/del/data`, payload);
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
    setFormData({
      cameraId: row.cameraId,
      cameraName: row.cameraName,
      cameraIp: row.cameraIp,
      port: row.port,
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
    setFormData({
      cameraId: null,
      cameraName: "",
      cameraIp: "",
      port: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchDevices();
  };

  const addDevice = async () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.cameraName === "" ||
      formData.cameraIp === "" ||
      formData.port === ""
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
      setSuccessModal(true);
      fetchDevices();
    } catch (error) {
      setWarningModal(true);
    }

    // Reset form data
    setFormData({
      cameraId: null,
      cameraName: "",
      cameraIp: "",
      port: "",
    });

    // Hide form
    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    setModalType("update");
    setFormData({
      cameraId: formData.cameraId,
      cameraName: formData.cameraName,
      cameraIp: formData.cameraIp,
      port: formData.port,
      status: formData.status,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (
      formData.cameraName === "" ||
      formData.cameraIp === "" ||
      formData.port === ""
    ) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updatedDevice = {
      cameraId: formData.cameraId,
      cameraName: formData.cameraName,
      cameraIp: formData.cameraIp,
      port: formData.port,
      // status: formData.status,
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
      setSuccessModal(true);

      const updatedData = await axios.get(`${SERVER_URL}device/`);
      setData(updatedData.data.context);
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
        <div className="add-device-form">
          <h3>Add New Device</h3>

          <input
            type="text"
            placeholder="Device Name"
            value={formData.cameraName}
            onChange={(e) =>
              setFormData({ ...formData, cameraName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Device IP"
            value={formData.cameraIp}
            onChange={(e) =>
              setFormData({ ...formData, cameraIp: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Device Port"
            value={formData.port}
            onChange={(e) => setFormData({ ...formData, port: e.target.value })}
          />
          {/* <div className="status-toggle">
            <label>Status: </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.status === "Active"}
                onChange={handleStatusToggle}
              />
              <span className="slider round"></span>
            </label>
            {formData.status}
          </div> */}
          <button className="submit-button" onClick={addDevice}>
            Add Device
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Edit Device Form */}
      {showEditForm && (
        <div className="add-device-form">
          <h3>Edit Device</h3>

          <input
            type="text"
            placeholder="Device Name"
            value={formData.cameraName}
            onChange={(e) =>
              setFormData({ ...formData, cameraName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Device IP"
            value={formData.cameraIp}
            onChange={(e) =>
              setFormData({ ...formData, cameraIp: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Device Port"
            value={formData.port}
            onChange={(e) => setFormData({ ...formData, port: e.target.value })}
          />
          {/* <div className="status-toggle">
            <label>Status: </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.status === "Active"}
                onChange={handleStatusToggle}
              />
              <span className="slider round"></span>
            </label>
            {formData.status}
          </div> */}
          <button className="submit-button" onClick={handleUpdate}>
            Update Device
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
