import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./department.css";
import axios from "axios";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../../config";


const TableComponent = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7;
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };



  const [formData, setFormData] = useState({
    // _id: "",
    dptId: null,
    name: "",
    superior: "",
    empQty: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  // Fetch departments data
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-dpt/`);
      setData(response.data.context);
    } catch (error) {
    } finally {
    }
  }, [setData]);

  useEffect(() => {
    fetchDepartments();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchDepartments, successModal]);

  const handleEdit = (row) => {
    setFormData({
      // _id: row._id,
      dptId: row.dptId,
      name: row.name,
      superior: row.superior,
      empQty: row.empQty,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleDelete = (dptId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, dptId: dptId });
  };

  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}pr-dpt-del/`, {
        dptId: formData.dptId,
      });
      const updatedData = await axios.get(`${SERVER_URL}pr-dpt/`
      );
      setData(updatedData.data.context);
      fetchDepartments();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAdd = () => {
    setFormData({
      dptId: null,
      name: "",
      superior: "",
      empQty: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchDepartments();
  };

  const addDepartment = () => {
    setModalType("create");
    setShowModal(true);
  };

  const confirmAdd = async () => {
    if (!formData.name) {
      setResMsg("Please fill in atleast Department Name fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const newDepartment = {
      // dptId: formData.dptId,
      'name': formData.name,
      'superior': formData.superior,
      'empQty': formData.empQty,
    };

    try {
      const response = await axios.post(`${SERVER_URL}pr-dpt/`, newDepartment);
      setShowAddForm(false);
      setResMsg(response.data.msg)
      if (response.data.status) {
        setShowModal(false);
        setSuccessModal(true);
        fetchDepartments();
      } else {
        setShowModal(false);
        setWarningModal(true);
      }
      const updatedData = await axios.get(`${SERVER_URL}pr-dpt/`
      );
      setData(updatedData.data.context);

    } catch (error) {
      setWarningModal(true);
    }

    // Reset the form data
    setFormData({
      dptId: null,
      name: "",
      superior: "",
      empQty: "",
    });
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const currentPageData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const updateDepartment = async (row) => {
    setModalType("update");
    setFormData({
      // _id: row._id,
      dptId: row.dptId,
      name: row.name,
      superior: row.superior,
      empQty: row.empQty,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!formData.name) {
      setResMsg("Please fill in atleast Department Name fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updatedDepartment = {
      // _id: formData._id,
      dptId: formData.dptId,
      name: formData.name,
      superior: formData.superior,
      empQty: formData.empQty,
    };

    try {
      await axios.post(
        `${SERVER_URL}pr-dpt-up/`,
        updatedDepartment
      );
      fetchDepartments();
      setShowEditForm(false);
      const updatedData = await axios.get(`${SERVER_URL}pr-dpt/`);
      setData(updatedData.data.context);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };





  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = currentPageData.map((row) => row.dptId);
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
        if (updatedIds.length !== currentPageData.length) {
          setSelectAll(false); // Uncheck "Select All" if a row is deselected
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
    } else if (selectedIds.length < 1) {
      setResMsg("No rows selected for deletion.");
      setShowModal(false);
      setWarningModal(true);
    }
  };


  const confirmBulkDelete = async () => {
    try {
      const payload = { ids: selectedIds };
      await axios.post(`${SERVER_URL}dpt/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pr-dpt/`);
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
            : `Are you sure you want to ${modalType} this Department?`
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
            : `Department ${modalType}d successfully!`
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

          <button className="add-button " onClick={handleAdd}>
            <FaPlus className="add-icon" /> Add New Department
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add New Department</h3>
          <label>Department Name</label>
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label>Superior Name</label>
          <input
            type="text"
            placeholder="Superior"
            value={formData.superior}
            onChange={(e) =>
              setFormData({ ...formData, superior: e.target.value })
            }
            />
            <label>Employee Quantity</label>
          <input
            type="number"
            placeholder="Employee Qty"
            value={formData.empQty}
            onChange={(e) =>
              setFormData({ ...formData, empQty: e.target.value })
            }
          />
          <button className="submit-button" onClick={addDepartment}>
            Add Department
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
          <h3>Edit Department</h3>
          <label>Department Name</label>
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label>Superior Name</label>
          <input
            type="text"
            placeholder="Superior"
            value={formData.superior}
            onChange={(e) =>
              setFormData({ ...formData, superior: e.target.value })
            }
          />
          <label>Employee Quantity</label>
          <input
            type="number"
            placeholder="Employee Qty"
            value={formData.empQty}
            onChange={(e) =>
              setFormData({ ...formData, empQty: e.target.value })
            }
          />

          <button
            className="submit-button"
            onClick={() => updateDepartment(formData)}
          >
            Update Department
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
            <tr className="thead-row">
              <th>
                <input
                  id="delete-checkbox"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th>S.No</th>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Superior</th>
              <th>Employee Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((row, index) => (
              <tr key={row.dptId}>
                <td>
                  <input
                    type="checkbox"
                    id="delete-checkbox"
                    checked={selectedIds.includes(row.dptId)}
                    onChange={(event) => handleRowCheckboxChange(event, row.dptId)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{row.dptId}</td>
                <td>{row.name}</td>
                <td>{row.superior}</td>
                <td>{row.empQty}</td>
                <td>
                  <button
                    onClick={() => handleEdit(row)}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaEdit className="table-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.dptId)}
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

export default TableComponent;
