import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
// import "../Settings/Setting_Tabs/bonus.css";

const Bonuses = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchBouneses();
  }, []);

  const fetchBouneses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetchBouneses"
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching resignation data:", error);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    id: "",
    bonusName: "",
    bonusDuration: "",
    bonusAmount: "",
    bonusDate: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (data) => {
    setFormData({
      _id: data._id,
      id: data.id,
      bonusName: data.bonusName,
      bonusDuration: data.bonusDuration,
      bonusAmount: data.bonusAmount,
      bonusDate: data.bonusDate,
    });
    setFormMode("edit");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = async(id) => {
    axios.post("http://localhost:5000/api/deleteBouneses", { id });
    const updatedData = await axios.get('http://localhost:5000/api/fetchBouneses');
    setData(updatedData.data);
    fetchBouneses();
  };

  const handleAddNew = () => {
    setFormMode("add");
    setFormData({
      id: (data.length + 1).toString(),
      bonusName: "",
      bonusDuration: "",
      bonusAmount: "",
      bonusDate: "",
    });
    setShowForm(true);
  };

  const handleSaveItem = async () => {
    if (formMode === "add") {
      const bouneses = {
        id: parseInt(formData.id, 10),
        bonusName: formData.bonusName,
        bonusDuration: formData.bonusDuration,
        bonusAmount: formData.bonusAmount,
        bonusDate: formData.bonusDate,
      };
      try {
        axios.post(`http://localhost:5000/api/addBouneses`, bouneses);
        const updatedData = await axios.get(
          "http://localhost:5000/api/fetchBouneses"
        );
        setData(updatedData.data);
        fetchBouneses();
      } catch (error) {
        console.log(error);
      }
    } else if (formMode === "edit") {
      const updateBounses = {
        _id: formData._id,
        id: parseInt(formData.id, 10),
        bonusName: formData.bonusName,
        bonusDuration: formData.bonusDuration,
        bonusAmount: formData.bonusAmount,
        bonusDate: formData.bonusDate,
      };
      console.log(updateBounses);
      try {
        axios.post(`http://localhost:5000/api/updateBouneses`, updateBounses);
        const updatedData = await axios.get(
          "http://localhost:5000/api/fetchBouneses"
        );
        setData(updatedData.data);
        fetchBouneses();
      } catch (error) {
        console.log(error);
      }
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      bonusName: "",
      bonusDuration: "",
      bonusAmount: "",
      bonusDate: "",
    });
    setCurrentItemId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.bonusName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-container">
      <div className="leave-header">
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
        <button className="addLeave" onClick={handleAddNew}>
          <FontAwesomeIcon icon={faPlus} /> Add New Bonus
        </button>
      </div>

      {showForm && (
        <div className="add-leave-form">
          <h3>{formMode === "add" ? "Add New Bonus" : "Edit Bonus"}</h3>
          <input
            type="text"
            placeholder="Bonus ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            readOnly={formMode === "edit"}
          />
          <input
            type="text"
            placeholder="Bonus Name"
            value={formData.bonusName}
            onChange={(e) =>
              setFormData({ ...formData, bonusName: e.target.value })
            }
          />

          <select
            className="bonus-duration"
            value={formData.bonusDuration}
            onChange={(e) =>
              setFormData({ ...formData, bonusDuration: e.target.value })
            }
          >
            <option value="">Select Duration</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="3-Month">3-Month</option>
            <option value="6-Month">6-Month</option>
            <option value="Yearly">Yearly</option>
          </select>
          <input
            type="number"
            placeholder="Bonus Amount"
            value={formData.bonusAmount}
            onChange={(e) =>
              setFormData({ ...formData, bonusAmount: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Bonus Date"
            value={formData.bonusDate}
            onChange={(e) =>
              setFormData({ ...formData, bonusDate: e.target.value })
            }
          />
          <button className="submit-button" onClick={handleSaveItem}>
            {formMode === "add" ? "Add" : "Update"}
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}

      <div className="leave-table-outer">
        <table className="leave-table">
          <thead>
            <tr>
              <th>Bonus ID</th>
              <th>Bonus Name</th>
              <th>Bonus Duration</th>
              <th>Bonus Amount</th>
              <th>Bonus Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bonus) => (
              <tr key={bonus._id}>
                <td>{bonus.id}</td>
                <td>{bonus.bonusName}</td>
                <td>{bonus.bonusDuration}</td>
                <td>{bonus.bonusAmount}</td>
                <td>{bonus.bonusDate}</td>
                <td>
                  <button
                    // className="edit-button"
                    className="action-button edit"
                    onClick={() => handleEdit(bonus)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    // className="edit-button"
                    className="action-button delete"
                    onClick={() => handleDelete(bonus._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
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

export default Bonuses;
