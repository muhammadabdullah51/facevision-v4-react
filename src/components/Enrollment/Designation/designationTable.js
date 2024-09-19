import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./designation.css"; // Custom CSS for styling
import axios from "axios";


const DesignationTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    id: null,
    designationCode: "",
    designationName: "",
  });

  const fetchDesignation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fetchDesignation');
      if (response.ok) {
        const designation = await response.json();
        setData(designation);
      } else {
        throw new Error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchDesignation();
  }, []);


  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (row) => {
    setFormData({
      _id: row._id,
      designationCode: row.designationCode,
      designationName: row.designationName,
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };


  const handleDelete = (id) => {
    try {
      axios.post(`http://localhost:5000/api/deleteDesignation`,{id})
      console.log(id);
      fetchDesignation();
    } catch (error) {
      console.log(error)
    }
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      designationCode: "",
      designationName: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchDesignation()
  };

  const handleUpdate = () => {
      const updateDesignation={
      _id: formData._id,
      designationCode: formData.designationCode,
      designationName: formData.designationName
    }
    try {
      axios.post(`http://localhost:5000/api/updateDesignation`,updateDesignation);
      fetchDesignation();
      setShowEditForm(false);

    } catch (error) {
      console.log(error)
    }
  };

  const addDesignation = () => {
    setShowAddForm(false);
    setShowEditForm(true);
    console.log(formData);
    setFormData({
      id: null,
      designationCode: "",
      designationName: "",
    });
    const designation={
      designationCode: formData.designationCode,
      designationName: formData.designationName
    }
    try {
      axios.post(`http://localhost:5000/api/addDesignation`,designation)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="designation-table">
      <div className="table-header">
        <form className="form">
          <button>
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
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
            required
            type="text"
          />
          <button className="reset" type="reset">
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
              ></path>
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
            placeholder="Designation Code"
            value={formData.designationCode}
            onChange={(e) =>
              setFormData({ ...formData, designationCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Designation Name"
            value={formData.designationName}
            onChange={(e) =>
              setFormData({ ...formData, designationName: e.target.value })
            }
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
            value={formData.designationCode}
            onChange={(e) =>
              setFormData({ ...formData, designationCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Designation Name"
            value={formData.designationName}
            onChange={(e) =>
              setFormData({ ...formData, designationName: e.target.value })
            }
          />
          <button className="submit-button" onClick={handleUpdate}>
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
      <div className="designations-table">
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Designation Code</th>
              <th>Designation Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.designationCode}</td>
                <td className='bold-fonts'>{row.designationName}</td>
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
          pageCount={Math.ceil(filteredData.length / 10)} // Adjust 10 to your page size
          marginPagesDisplayed={2}
          pageRangeDisplayed={10}
          onPageChange={({ selected }) => {
            // Implement page change logic here
          }}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default DesignationTable;
