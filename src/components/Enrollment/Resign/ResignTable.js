import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import axios from "axios";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";

const ResignTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]); // State for employee data
  const [formData, setFormData] = useState({
    _id: "",
    resignId: null,
    employee: "",
    date: "",
    reason: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchResign = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/fetchResign");
      if (response.ok) {
        const resign = await response.json();
        setData(resign);
      } else {
        throw new Error("Failed to fetch resigns");
      }
    } catch (error) {
      console.error("Error fetching resigns data:", error);
    }
  }, [setData]);
  // Fetch employee data
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetchEmployees"
      ); // Update this URL accordingly
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchResign();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchResign, successModal]);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Employee Name",
        accessor: "employee",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Reason",
        accessor: "reason",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
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
    []
  );

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [data, searchQuery]
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
      _id: row._id,
      resignId: row.resignId,
      employee: row.employee,
      date: row.date,
      reason: row.reason,
    });
    setShowAddForm(false); // Hide Add Form
    setShowEditForm(true); // Show Edit Form
    fetchResign();
  };

  const handleDelete = (resignId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ ...formData, _id: resignId });
  };
  const confirmDelete = async () => {
    const resignId = formData._id;
    await axios.post("http://localhost:5000/api/deleteResign", { resignId });
    const updatedData = await axios.get(
      "http://localhost:5000/api/fetchResign"
    );
    setData(updatedData.data);
    fetchResign();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    setFormData({
      resignId: null,
      employee: "",
      date: "",
      reason: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchResign();
  };

  const handleUpdate = async (row) => {
    setModalType("update");
    setFormData({
      _id: row._id,
      resignId: row.resignId,
      employee: row.employee,
      date: row.date,
      reason: row.reason,
    });
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    setShowAddForm(false);
    setShowEditForm(true);
    const updateResign = {
      _id: formData._id,
      resignId: formData.id,
      employee: formData.employee,
      date: formData.date,
      reason: formData.reason,
    };
    try {
      axios.post("http://localhost:5000/api/updateResign", updateResign);
      // const updatedData = await axios.get(
      //   "http://localhost:5000/api/fetchResign"
      // );
      // setData(updatedData.data);
      fetchResign();
      setShowAddForm(false); // Hide Add Form
      setShowEditForm(false);
      setShowModal(false); // Close the confirmation modal
      setSuccessModal(true); // Show the success modal
    } catch (error) {
      console.log(error);
    }
  };

  const addResign = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    setShowAddForm(false);
    setShowEditForm(true);
    console.log(formData);
    setFormData({
      resignId: null,
      employee: "",
      date: "",
      reason: "",
    });
    const resign = {
      employee: formData.employee,
      date: formData.date,
      reason: formData.reason,
    };
    try {
      axios.post(`http://localhost:5000/api/addResign`, resign);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchResign"
      );
      setData(updatedData.data);
      setShowAddForm(false);
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
      fetchResign();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} this Resign?`}
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
        message={`Resign ${modalType}d successfully!`}
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
          <FaPlus className="add-icon" /> Add Employee
        </button>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Add Employee</h3>
          {/* <input
            type="text"
            placeholder="Employee Name"
            value={formData.employee}
            onChange={(e) =>
              setFormData({ ...formData, employee: e.target.value })
            }
          /> */}
          <select
            value={formData.employee}
            onChange={(e) =>
              setFormData({ ...formData, employee: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <button className="submit-button" onClick={addResign}>
            Add Employee
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
        <div className="add-department-form add-leave-form">
          <h3>Edit Employee</h3>
          <select
            value={formData.employee}
            onChange={(e) =>
              setFormData({ ...formData, employee: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={`${emp.fName} ${emp.lName}`}>
                {emp.fName} {emp.lName}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <button
            className="submit-button"
            onClick={() => handleUpdate(formData)}
          >
            Update Employee
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
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => gotoPage(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default ResignTable;
