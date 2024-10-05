import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./department.css"; // Custom CSS for styling
import axios from "axios";

const TableComponent = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    id: null,
    departmentName: "",
    superior: "",
    employeeQty: "",
  });

  // Fetch departments data
  const fetchDepartments = async () => {
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
    }
  };

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEdit = (row) => {
    setFormData({
      _id: row._id,
      id: row.id,
      departmentName: row.departmentName,
      superior: row.superior,
      employeeQty: row.employeeQty,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    try {
      axios.post(`http://localhost:5000/api/deleteDepartments`, { id });
      console.log(`Department deleted ID: ${id}`);
      const updatedData = await axios.get('http://localhost:5000/api/fetchDepartment');
      setData(updatedData.data)
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      departmentName: "",
      superior: "",
      employeeQty: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchDepartments();
  };

  const addDepartment = async () => {
    const newDepartment = {
      departmentName: formData.departmentName,
      superior: formData.superior,
      employeeQty: formData.employeeQty,
    };

    try {
      axios.post(`http://localhost:5000/api/addDepartments`, newDepartment);
      console.log(newDepartment);
      console.log("Department added successfully:");
      setShowAddForm(false); 
      const updatedData = await axios.get('http://localhost:5000/api/fetchDepartment');
      setData(updatedData.data)
      fetchDepartments(); 
    } catch (error) {
      console.error("Error adding department:", error);
    }

    // Reset the form data
    setFormData({
      id: null,
      departmentName: "",
      superior: "",
      employeeQty: "",
    });
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const updateDepartment = async () => {
    const updatedDepartment = {
      _id: formData._id,
      id: formData.id,
      departmentName: formData.departmentName,
      superior: formData.superior,
      employeeQty: formData.employeeQty,
    };

    try {
      await axios.put(
        `http://localhost:5000/api/updateDepartments`,
        updatedDepartment
      );
      console.log("Department updated successfully");
      setShowEditForm(false); // Close edit form
      fetchDepartments(); // Refresh the department list
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };
  return (
    <div className="department-table">
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
            placeholder="Department Name"
            value={formData.departmentName}
            onChange={(e) =>
              setFormData({ ...formData, departmentName: e.target.value })
            }
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
            value={formData.employeeQty}
            onChange={(e) =>
              setFormData({ ...formData, employeeQty: e.target.value })
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
            placeholder="Department Name"
            value={formData.departmentName}
            onChange={(e) =>
              setFormData({ ...formData, departmentName: e.target.value })
            }
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
            value={formData.employeeQty}
            onChange={(e) =>
              setFormData({ ...formData, employeeQty: e.target.value })
            }
          />
          <button className="submit-button" onClick={updateDepartment}>
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
              <th>Department Name</th>
              <th>Superior</th>
              <th>Employee Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={row._id}>
                <td>{index + 1}</td>
                <td>{row.departmentName}</td>
                <td>{row.superior}</td>
                <td>{row.employeeQty}</td>
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
          pageCount={Math.ceil(filteredData.length / 10)}
          onPageChange={({ selected }) => {
            /* pagination logic */
          }}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default TableComponent;
