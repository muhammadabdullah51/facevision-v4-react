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
    _id: "",
    dptId: null,
    name: "",
    superior: "",
    empQty: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch departments data
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/fetchDepartment");
      if (response.ok) {
        const departments = await response.json();
        setData(departments);
      } else {
        throw new Error("Failed to fetch departments");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    } finally {
      setLoading(false);
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
      _id: row._id,
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
    setFormData({ ...formData, _id: dptId });
  };

  const confirmDelete = async () => {
    try {
      await axios.post(`http://localhost:5000/api/deleteDepartments`, {
        dptId: formData._id,
      });
      console.log(`Department deleted ID: ${formData._id}`);
      fetchDepartments();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error deleting department:", error);
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
    if (!formData.name || !formData.dptId) {
      alert("Please fill in all required fields.");
      return;
  }
    const newDepartment = {
      dptId: formData.dptId,
      name: formData.name,
      superior: formData.superior,
      empQty: formData.empQty,
    };

    try {
      axios.post("http://localhost:5000/api/addDepartments", newDepartment);
      console.log(newDepartment);
      console.log("Department added successfully:");
      setShowAddForm(false);
      const updatedData = await axios.get("http://localhost:5000/api/fetchDepartment"
      );
      setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
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
    console.log(row);
    setModalType("update");
    setFormData({
      _id: row._id,
      dptId: row.dptId,
      name: row.name,
      superior: row.superior,
      empQty: row.empQty,
    });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    const updatedDepartment = {
      _id: formData._id,
      dptId: formData.dptId,
      name: formData.name,
      superior: formData.superior,
      empQty: formData.empQty,
    };

    try {
      await axios.post(
        "http://localhost:5000/api/updateDepartments",
        updatedDepartment
      );
      console.log("Department updated successfully");
      fetchDepartments();
      setShowEditForm(false);
      // const updatedData = await axios.get('http://localhost:5000/api/fetchDepartment');
      // setData(updatedData.data);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };
  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this department?`}
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
        message={`Department ${modalType}d successfully!`}
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
          <FaPlus className="add-icon" /> Add New Department
        </button>
      </div>

      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add New Department</h3>
          <input
            type="text"
            placeholder="Department ID"
            value={formData.dptId}
            onChange={(e) =>
              setFormData({ ...formData, dptId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Superior"
            value={formData.superior}
            onChange={(e) =>
              setFormData({ ...formData, superior: e.target.value })
            }
          />
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
          <input
            type="text"
            placeholder="Department ID"
            value={formData.dptId}
            onChange={(e) =>
              setFormData({ ...formData, dptId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Superior"
            value={formData.superior}
            onChange={(e) =>
              setFormData({ ...formData, superior: e.target.value })
            }
          />
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
              <tr key={row._id}>
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
                    onClick={() => handleDelete(row._id)}
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
