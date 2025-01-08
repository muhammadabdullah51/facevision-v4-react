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
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../../config";

const ResignTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employees, setEmployees] = useState([]); // State for employee data
  const [formData, setFormData] = useState({
    resignId: "",
    employee: "",
    date: "",
    reason: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const fetchResign = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp-rsgn/`);
      const resign = await response.data;
      setData(resign);
    } catch (error) {
    }
  }, [setData]);
  // Fetch employee data
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`); /// Update this URL accordingly
      setEmployees(response.data);
    } catch (error) {
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
      const allIds = filteredData.map((row) => row.resignId);
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
      await axios.post(`${SERVER_URL}rsgn/del/data`, payload);
      const updatedData = await axios.get(`${SERVER_URL}pr-emp-rsgn/`);
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
            checked={selectedIds.includes(row.original.resignId)}
            onChange={(event) => handleRowCheckboxChange(event, row.original.resignId)}
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
        Header: "Employee Name",
        accessor: "empName",
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
              onClick={() => handleDelete(row.original.resignId)}
              style={{ background: "none", border: "none" }}
            >
              <FaTrash className="table-delete" />
            </button>
          </div>
        ),
      },
    ],
    [filteredData, selectedIds]
  );







  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "S.No",
  //       accessor: "serial",
  //       Cell: ({ row }) => row.index + 1,
  //     },
  //     {
  //       Header: "Employee Name",
  //       accessor: "empName",
  //       Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
  //     },
  //     {
  //       Header: "Date",
  //       accessor: "date",
  //     },
  //     {
  //       Header: "Reason",
  //       accessor: "reason",
  //       Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
  //     },
  //     {
  //       Header: "Action",
  //       accessor: "action",
  //       Cell: ({ row }) => (
  //         <div>
  //           <button
  //             onClick={() => handleDelete(row.original.resignId)}
  //             style={{ background: "none", border: "none" }}
  //           >
  //             <FaTrash className="table-delete" />
  //           </button>
  //         </div>
  //       ),
  //     },
  //   ],
  //   []
  // );



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

  const handleDelete = async (resignId) => {
    setModalType("delete");
    setShowModal(true);
    setFormData({ resignId });
  };
  const confirmDelete = async () => {
    await axios.post(`${SERVER_URL}pr-emp-rsgn-del/`, {
      resignId: formData.resignId,
    });
    const updatedData = await axios.get(`${SERVER_URL}pr-emp-rsgn/`);
    setData(updatedData.data);
    fetchResign();
    setShowModal(false);
    setSuccessModal(true);
  };

  const handleAdd = () => {
    setFormData({
      employee: "",
      date: "",
      reason: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchResign();
  };

  const addResign = () => {
    setModalType("create");
    setShowModal(true);
  };
  const confirmAdd = async () => {
    if (!formData.employee || !formData.date || !formData.reason) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    setShowAddForm(false);
    setShowEditForm(true);
    setFormData({
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
      axios.post(`${SERVER_URL}pr-emp-rsgn/`, resign);
      const updatedData = await axios.get(`${SERVER_URL}pr-emp-rsgn/`);
      setData(updatedData.data);
      fetchResign();
      setShowAddForm(false);
      setShowEditForm(false);
      setShowModal(false);
      setSuccessModal(true);
    } catch (error) {
    }
  };

  return (
    <div className="department-table">
      <ConirmationModal
        isOpen={showModal}
        message={
          modalType === "delete selected"
            ? "Are you sure you want to delete selected items?"
            : `Are you sure you want to ${modalType} this Resign?`
        }
        onConfirm={() => {
          if (modalType === "create") confirmAdd();
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
            : `Resign ${modalType}d successfully!`
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
            <FaPlus className="add-icon" /> Add Employee
          </button>
          <button className="add-button submit-button" onClick={handleBulkDelete}>
            <FaTrash className="add-icon" /> Delete Bulk
          </button>
        </div>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form add-leave-form">
          <h3>Add Employee</h3>
          <label>Select Employee</label>
          <input
            list="employeesList"
            value={
              employees.find((emp) => emp.empId === formData.employee)
                ? `${employees.find((emp) => emp.empId === formData.employee)
                  .empId
                } ${employees.find((emp) => emp.empId === formData.employee)
                  .fName
                } ${employees.find((emp) => emp.empId === formData.employee)
                  .lName
                }`
                : formData.employee // Display the selected or typed value
            }
            onChange={(e) => {
              const value = e.target.value;

              // Match the input value with employees' `empId`, `fName`, or `lName`
              const selectedEmployee = employees.find(
                (emp) =>
                  `${emp.empId} ${emp.fName} ${emp.lName}` === value ||
                  emp.empId === value ||
                  emp.fName === value ||
                  emp.lName === value
              );

              setFormData({
                ...formData,
                employee: selectedEmployee ? selectedEmployee.empId : value, // Update with empId if matched
              });
            }}
            placeholder="Search or select an employee"
          />

          <datalist id="employeesList">
            {employees.map((emp) => (
              <option
                key={emp.empId}
                value={`${emp.empId} ${emp.fName} ${emp.lName}`} // Options in the format "empId fName lName"
              />
            ))}
          </datalist>

            <label>Date</label>
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <label>Reason</label>
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
