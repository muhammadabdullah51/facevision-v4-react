import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./designation.css";
import axios from "axios";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../../config";

const DesignationTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 8;
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [formData, setFormData] = useState({
    dsgId: null,
    dsgCode: "",
    name: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");


  const fetchDesignation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}pr-dsg/`);
      const designation = await response.data.context;
      setData(designation);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [setData]);

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchDesignation();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchDesignation, successModal]);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const currentPageData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );



  const handleDelete = async (dsgId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, dsgId: dsgId });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}pr-dsg-del/`, { dsgId: formData.dsgId, });
      const updatedData = await axios.get(`${SERVER_URL}pr-dsg/`);
      setData(updatedData.data.context);
      fetchDesignation();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };




  const handleAdd = () => {
    setFormData({
      dsgCode: "",
      name: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchDesignation();
  };

  const addDesignation = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (!formData.name || !formData.dsgCode) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }

    const designation = {
      dsgCode: formData.dsgCode,
      name: formData.name,
    };
    try {
      const response = await axios.post(`${SERVER_URL}pr-dsg/`, designation);
      setShowAddForm(false);
      setResMsg(response.data.msg)
      if (response.data.status) {
        setShowModal(false);
        setSuccessModal(true);
        fetchDesignation();
      } else {
        setShowModal(false);
        setWarningModal(true);
      }

      const updatedData = await axios.get(`${SERVER_URL}pr-dsg/`);
      setData(updatedData.data.context);
    } catch (error) {
      setWarningModal(true);
    }
  };


  const handleEdit = (row) => {
    setFormData({
      dsgId: row.dsgId,
      dsgCode: row.dsgCode,
      name: row.name,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };
  const handleUpdate = async (row) => {
    setModalType("update");
    setFormData({
      dsgId: row.dsgId,
      dsgCode: row.dsgCode,
      name: row.name,
    });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (!formData.name || !formData.dsgCode) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updatedDepartment = {
      dsgId: formData.dsgId,
      dsgCode: formData.dsgCode,
      name: formData.name,
    };

    try {
      const res = await axios.post(`${SERVER_URL}pr-dsg-up/`, updatedDepartment);
      fetchDesignation();
      setShowEditForm(false);
      setShowModal(false);
      setResMsg(res.data.msg)
      if (res.data.status) {
        setSuccessModal(true);
        fetchDesignation();
      } else {
        setShowModal(false);
        setWarningModal(true);
      }
      setSuccessModal(true);
      const updatedData = await axios.get(`${SERVER_URL}pr-dsg/`);
      setData(updatedData.data.context);
    } catch (error) {
      setWarningModal(true);
    }
  };


  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = currentPageData.map((row) => row.dsgId);
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
        if (updatedIds.length !== currentPageData.length) {
          setSelectAll(false);
        }
        return updatedIds;
      }
    });
    console.log(selectedIds);
  };
  useEffect(() => {
    if (selectedIds.length === currentPageData.length && currentPageData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedIds, currentPageData]);


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
      const response = await axios.post(`${SERVER_URL}dsg/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pr-dsg/`);
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

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Designation?`
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
            : `Designation ${modalType}d successfully!`
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

          <button className="add-button" onClick={handleAdd}>
            <FaPlus className="add-icon" /> Add New Designation
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>

      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add New Designation</h3>

          <input
            type="text"
            placeholder="Designation Code"
            value={formData.dsgCode}
            onChange={(e) =>
              setFormData({ ...formData, dsgCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Designation Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <button className="submit-button" onClick={addDesignation}>
            Add Designation
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {showEditForm && (
        <div className="add-department-form">
          <h3>Edit Designation</h3>

          <input
            type="text"
            placeholder="Designation Code"
            value={formData.dsgCode}
            onChange={(e) =>
              setFormData({ ...formData, dsgCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Designation Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <button
            className="submit-button"
            onClick={() => handleUpdate(formData)}
          >
            Update Designation
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
              <th>
                <input
                  id="delete-checkbox"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th>S.No</th>
              <th>Designation ID</th>
              <th>Designation Code</th>
              <th>Designation Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((row, index) => (
              <tr key={row.dsgId}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(row.dsgId)}
                    onChange={(event) => handleRowCheckboxChange(event, row.dsgId)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{row.dsgId}</td>
                <td>{row.dsgCode}</td>
                <td className="bold-fonts">{row.name}</td>
                <td>
                  <div>
                    <button
                      onClick={() => handleEdit(row)}
                      style={{ background: "none", border: "none" }}
                    >
                      <FaEdit className="table-edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.dsgId)}
                      style={{ background: "none", border: "none" }}
                    >
                      <FaTrash className="table-delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredData.length / rowsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default DesignationTable;
