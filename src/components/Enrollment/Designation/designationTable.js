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
    _id: "",
    dsgId: null,
    dsgCode: "",
    name: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDesignation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/fetchDesignation"
      );
      if (response.ok) {
        const designation = await response.json();
        setData(designation);
      } else {
        throw new Error("Failed to fetch designation");
      }
    } catch (error) {
      console.error("Error fetching designation data:", error);
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

  const handleEdit = (row) => {
    setFormData({
      _id: row._id,
      dsgId: row.dsgId,
      dsgCode: row.dsgCode,
      name: row.name,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleDelete = async (dsgId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: dsgId });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`http://localhost:5000/api/deleteDesignation`, {
        dsgId: formData._id,
      });
      console.log(`Designation deleted ID: ${formData._id}`);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchDesignation"
      );
      setData(updatedData.data);
      fetchDesignation();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setFormData({
      dsgId: null,
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
    if (!formData.name || !formData.dsgCode || !formData.dsgId) {
      alert("Please fill in all required fields.");
      return;
    }

    const designation = {
      dsgId: formData.dsgId,
      dsgCode: formData.dsgCode,
      name: formData.name,
    };
    try {
      axios.post(`http://localhost:5000/api/addDesignation`, designation);
      console.log(designation);
      console.log("Designation Added Succesfully");
      setShowAddForm(false);

      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchDesignation"
      );
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      fetchDesignation();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (row) => {
    console.log(row);
    setModalType("update");
    setFormData({
      _id: row._id,
      dsgId: row.dsgId,
      dsgCode: row.dsgCode,
      name: row.name,
    });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    const updatedDepartment = {
      _id: formData._id,
      dsgId: formData.dsgId,
      dsgCode: formData.dsgCode,
      name: formData.name,
    };

    try {
      await axios.post(
        "http://localhost:5000/api/updateDesignation",
        updatedDepartment
      );
      console.log("Designation updated successfully");
      fetchDesignation();
      setShowEditForm(false);
      // const updatedData = await axios.get('http://localhost:5000/api/fetchDepartment');
      // setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error updating Designation:", error);
    }
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this designation?`}
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
        message={`Designation ${modalType}d successfully!`}
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
        <button className="add-button" onClick={handleAdd}>
          <FaPlus className="add-icon" /> Add New Designation
        </button>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add New Designation</h3>
          <input
            type="text"
            placeholder="Designation ID"
            value={formData.dsgId}
            onChange={(e) =>
              setFormData({ ...formData, dsgId: e.target.value })
            }
          />
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
            placeholder="Designation ID"
            value={formData.dsgId}
            onChange={(e) =>
              setFormData({ ...formData, dsgId: e.target.value })
            }
          />
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
                      onClick={() => handleDelete(row._id)}
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
