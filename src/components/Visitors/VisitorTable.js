import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./visitors.css";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";

const VisitorTable = ({
  // data,
  // setData,
  activeTab,
  setActiveTab,
  onEdit,
  onAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    visitorsId: null,
    fName: "",
    lName: "",
    certificationNo: "",
    createTime: "",
    exitTime: "",
    email: "",
    contactNo: "",
    visitingDept: "",
    host: "",
    cardNumber: "",
    visitingReason: "",
    carryingGoods: "",
  });
  // Helper function to format datetime
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    return (
      <>
        <span>{`${day}-${month}-${year}`}</span>
        <br />
        <span>{`${hours}:${minutes} ${ampm}`}</span>
      </>
    );
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
      const allIds = filteredData.map((row) => row.id);
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
      await axios.post(`${SERVER_URL}vistor/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}visitors/`);
      setData(updatedData.data);
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
            checked={selectedIds.includes(row.original.id)} 
            onChange={(event) => handleRowCheckboxChange(event, row.original.id)}
          />
        ),
        id: "selection",
      },
      {
        Header: "Visitor ID",
        accessor: "visitorsId",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Visitor Name",
        accessor: "visitorName",
        Cell: ({ row }) => (
          <span className="bold-fonts">
            {row.original.fName} {row.original.lName}
          </span>
        ),
      },
      {
        Header: "Crft No",
        accessor: "certificationNo",
      },
      {
        Header: "Create Time",
        accessor: "createTime",
        Cell: ({ value }) => formatDateTime(value),
      },
      {
        Header: "Exit Time",
        accessor: "exitTime",
        Cell: ({ value }) => formatDateTime(value),
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone No",
        accessor: "contactNo",
      },
      {
        Header: "Visiting Department",
        accessor: "visitingDept",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Host",
        accessor: "host",
      },
      {
        Header: "Card No.",
        accessor: "cardNumber",
      },
      {
        Header: "Visiting Reason",
        accessor: "visitingReason",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Carrying Goods",
        accessor: "carryingGoods",
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
    [filteredData, selectedIds] // Dependencies for updates
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


  const fetchVisitors = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}visitors/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching resignation data:", error);
    }
  }, [setData])

  useEffect(() => {
    fetchVisitors();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchVisitors, successModal]);


  // Handle Edit
  const handleEdit = (row) => {
    onEdit(row)
  };


  const handleDelete = async (row) => {
    setModalType("delete");
    setShowModal(true);
    setFormData(row.id);

  };


  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}visitors/${formData}/`);
      const updatedData = await axios.get(`${SERVER_URL}visitors/`);
      setData(updatedData.data);
      fetchVisitors();
      setShowModal(false);
      setSuccessModal(true);

    } catch (error) {
    }
  }

  const handleAdd = () => {
    onAdd()
  };



  return (
    <div className="visitor-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Visitor?`
        }
        onConfirm={() => {
          if (modalType === "delete selected") confirmBulkDelete();
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
            : `Visitor ${modalType}d successfully!`
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
            <FaPlus className="add-icon" /> Add New Visitor
          </button>

          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>
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
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => gotoPage(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default VisitorTable;
