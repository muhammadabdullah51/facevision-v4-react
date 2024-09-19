import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import "../Settings/Setting_Tabs/bonus.css";

const Bonuses = () => {
  const [data, setData] = useState([
    { id: 1, bonusName: "Performance Bonus", bonusDuration: "Monthly", bonusAmount: "1000", bonusDate: "2024-09-01" },
    { id: 2, bonusName: "Holiday Bonus", bonusDuration: "Yearly", bonusAmount: "1500", bonusDate: "2024-12-25" },
    { id: 3, bonusName: "Quarterly Bonus", bonusDuration: "3-Month", bonusAmount: "1200", bonusDate: "2024-06-30" },
    { id: 4, bonusName: "Project Completion Bonus", bonusDuration: "6-Month", bonusAmount: "2000", bonusDate: "2024-11-15" },
    { id: 5, bonusName: "Retention Bonus", bonusDuration: "Yearly", bonusAmount: "2500", bonusDate: "2024-01-01" },
    { id: 6, bonusName: "Safety Bonus", bonusDuration: "Weekly", bonusAmount: "500", bonusDate: "2024-09-08" },
    { id: 7, bonusName: "Sales Target Bonus", bonusDuration: "Monthly", bonusAmount: "1800", bonusDate: "2024-10-01" },
    { id: 8, bonusName: "Attendance Bonus", bonusDuration: "3-Month", bonusAmount: "1300", bonusDate: "2024-07-01" },
    { id: 9, bonusName: "Special Recognition Bonus", bonusDuration: "6-Month", bonusAmount: "2200", bonusDate: "2024-11-30" },
    { id: 10, bonusName: "Team Achievement Bonus", bonusDuration: "Monthly", bonusAmount: "1600", bonusDate: "2024-08-15" }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentItemId, setCurrentItemId] = useState(null); // Store ID of item being edited
  const [formData, setFormData] = useState({
    id: "",
    bonusName: "",
    bonusDuration: "",
    bonusAmount: "",
    bonusDate: ""
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setFormData({
        id: itemToEdit.id,
        bonusName: itemToEdit.bonusName,
        bonusDuration: itemToEdit.bonusDuration,
        bonusAmount: itemToEdit.bonusAmount,
        bonusDate: itemToEdit.bonusDate
      });
      setCurrentItemId(id);
      setFormMode("edit");
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleAddNew = () => {
    setFormMode("add");
    setFormData({
      id: (data.length + 1).toString(),
      bonusName: "",
      bonusDuration: "",
      bonusAmount: "",
      bonusDate: ""
    });
    setShowForm(true);
  };

  const handleSaveItem = () => {
    if (formMode === "add") {
      const newItem = {
        id: parseInt(formData.id, 10),
        bonusName: formData.bonusName,
        bonusDuration: formData.bonusDuration,
        bonusAmount: formData.bonusAmount,
        bonusDate: formData.bonusDate
      };
      setData([...data, newItem]);
    } else if (formMode === "edit") {
      const updatedData = data.map((item) =>
        item.id === currentItemId ? { ...item, ...formData } : item
      );
      setData(updatedData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      bonusName: "",
      bonusDuration: "",
      bonusAmount: "",
      bonusDate: ""
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
            onChange={handleSearchChange}
            placeholder="Search by Bonus Name..."
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
            onChange={(e) =>
              setFormData({ ...formData, id: e.target.value })
            }
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
          
          <select className="bonus-duration"
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
              <tr key={bonus.id}>
                <td>{bonus.id}</td>
                <td>{bonus.bonusName}</td>
                <td>{bonus.bonusDuration}</td>
                <td>{bonus.bonusAmount}</td>
                <td>{bonus.bonusDate}</td>
                <td>
                  <button
                    // className="edit-button"
                    className="action-button edit"
                    onClick={() => handleEdit(bonus.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    // className="edit-button"
                    className="action-button delete"
                    onClick={() => handleDelete(bonus.id)}
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
