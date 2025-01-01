import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./location.css"; // Custom CSS for styling
import axios from "axios";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";

import { SERVER_URL } from "../../../config";

const LocationTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 8;
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [formData, setFormData] = useState({
    locId: null,
    locCode: "",
    name: "",
    deviceQty: "",
    empQty: "",
    resignQty: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}pr-loc/`);
      const location = response.data.context;
      setData(location);

    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [setData]);

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchLocation();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchLocation, successModal]);

  const handleUpdate = async (row) => {
    setModalType("update");
    setFormData({
      locId: row.locId,
      locCode: row.locCode,
      name: row.name,
      deviceQty: row.deviceQty,
      empQty: row.empQty,
      resignQty: row.resignQty,
    });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (
      formData.locCode === "" ||
      formData.name === "" ||
      formData.deviceQty === "" ||
      formData.empQty === ""
    ) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    const updateLocation = {
      locId: formData.locId,
      locCode: formData.locCode,
      name: formData.name,
      deviceQty: formData.deviceQty,
      empQty: formData.empQty,
      resignQty: formData.resignQty,
    };

    try {
      const response = await axios.post(`${SERVER_URL}pr-loc-up/`, updateLocation);
      fetchLocation(); // Fetch the updated locations
      setShowEditForm(false); // Close the edit form
      setShowModal(false); // Close the confirmation modal
      setResMsg(response.data.msg)
      if (response.data.status) {
        setSuccessModal(true);
        fetchLocation();
      } else {
        setShowModal(false);
        setWarningModal(true);
      }
      setSuccessModal(true); // Show the success modal
    } catch (error) {
      setWarningModal(true);
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
      const allIds = filteredData.map((row) => row.locId);
      setSelectedIds(allIds);
      console.log(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowCheckboxChange = (event, rowId) => {
    const isChecked = event.target.checked;
    console.log(rowId);

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
      const response = await axios.post(`${SERVER_URL}loc/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pr-loc/`);
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
            onChange={handleSelectAllChange}
          />
        ),
        Cell: ({ row }) => (
          <input
            id="delete-checkbox"
            type="checkbox"
            checked={selectedIds.includes(row.original.locId)}
            onChange={(event) => handleRowCheckboxChange(event, row.original.locId)}
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
        Header: "Location ID",
        accessor: "locId",
      },
      {
        Header: "Location Code",
        accessor: "locCode",
      },
      {
        Header: "Location Name",
        accessor: "name",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Device Quantity",
        accessor: "deviceQty",
      },
      {
        Header: "Employee Quantity",
        accessor: "empQty",
      },
      {
        Header: "Resigned Quantity",
        accessor: "resignQty",
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
          </div>
        ),
      },
    ],
    [selectAll, selectedIds]
  );




 

  const currentPageData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
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
    usePagination,
    useRowSelect
  );

  const handleEdit = (row) => {
    setFormData({
      locId: row.locId,
      locCode: row.locCode,
      name: row.name,
      deviceQty: row.deviceQty,
      empQty: row.empQty,
      resignQty: row.resignQty,
    });
    setShowAddForm(false); // Hide Add Form
    setShowEditForm(true); // Show Edit Form
  };

  const handleDelete = async (row) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, locId: row.locId });
  };
  const confirmDelete = async () => {
    try {
      await axios.post(`${SERVER_URL}pr-loc-del/`, { locId: formData.locId });
      const updatedData = await axios.get(`${SERVER_URL}pr-loc/`);
      setData(updatedData.data.context);
      fetchLocation();
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  const handleAdd = () => {
    setFormData({
      locId: null,
      locCode: "",
      name: "",
      deviceQty: "",
      empQty: "",
      resignQty: "",
    });
    setShowAddForm(true);
    setShowEditForm(false); // Hide Edit Form
  };

  const addLocation = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (
      formData.locId === "" ||
      formData.locCode === "" ||
      formData.name === "" ||
      formData.deviceQty === "" ||
      formData.empQty === ""
    ) {
      setResMsg("Please fill in all required fields.")
      setShowModal(false);
      setWarningModal(true);
      return;
    }


    const location = {
      locCode: formData.locCode,
      name: formData.name,
      deviceQty: formData.deviceQty,
      empQty: formData.empQty,
      resignQty: formData.resignQty,
    };
    try {
      const res = await axios.post(`${SERVER_URL}pr-loc/`, location);
      setShowAddForm(false);
      setResMsg(res.data.msg)
      if (res.data.status) {
        setShowModal(false);
        setSuccessModal(true);
        fetchLocation();
      } else {
        setShowModal(false);
        setWarningModal(true);
      }


      const updatedData = await axios.get(`${SERVER_URL}pr-loc/`);
      setData(updatedData.data.context);
      setShowAddForm(false);
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      fetchLocation();
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
            : `Are you sure you want to ${modalType} this Location?`
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
            : `Location ${modalType}d successfully!`
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
            <FaPlus className="add-icon" /> Add New Location
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add New Location</h3>
          <input
            type="text"
            placeholder="Location Code"
            value={formData.locCode}
            onChange={(e) =>
              setFormData({ ...formData, locCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Device Quantity"
            value={formData.deviceQty}
            onChange={(e) =>
              setFormData({ ...formData, deviceQty: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Employee Quantity"
            value={formData.empQty}
            onChange={(e) =>
              setFormData({ ...formData, empQty: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Resigned Quantity"
            value={formData.resignQty}
            onChange={(e) =>
              setFormData({ ...formData, resignQty: e.target.value })
            }
          />
          <button className="submit-button" onClick={addLocation}>
            Add Location
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
          <h3>Edit Location</h3>
          <input
            type="text"
            placeholder="Location Code"
            value={formData.locCode}
            onChange={(e) =>
              setFormData({ ...formData, locCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Device Quantity"
            value={formData.deviceQty}
            onChange={(e) =>
              setFormData({ ...formData, deviceQty: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Employee Quantity"
            value={formData.empQty}
            onChange={(e) =>
              setFormData({ ...formData, empQty: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Resigned Quantity"
            value={formData.resignQty}
            onChange={(e) =>
              setFormData({ ...formData, resignQty: e.target.value })
            }
          />
          <button
            className="submit-button"
            onClick={() => handleUpdate(formData)}
          >
            Update Location
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
        <table {...getTableProps()} className="table">
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
      <div className="pagination">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageOptions.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={10}
          onPageChange={({ selected }) => gotoPage(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default LocationTable;
