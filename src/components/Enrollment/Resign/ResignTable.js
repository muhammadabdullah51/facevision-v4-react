import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import axios from "axios";

const ResignTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    id: null,
    employeeName: "",
    date: "",
    reason: "",
  });

  const fetchResign = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fetchResign');
      if (response.ok) {
        const resign = await response.json();
        setData(resign);
      } else {
        throw new Error('Failed to fetch resigns');
      }
    } catch (error) {
      console.error('Error fetching resigns data:', error);
    }
  };

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchResign();
  }, []);


  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Employee Name",
        accessor: "employeeName",
        Cell: ({ value }) => (
          <span className='bold-fonts'>{value}</span>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Reason",
        accessor: "reason",
        Cell: ({ value }) => (
          <span className='bold-fonts'>{value}</span>
        ),
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
      id: row.id,
      employeeName: row.employeeName,
      date: row.date,
      reason: row.reason,
    });
    setShowAddForm(false); // Hide Add Form
    setShowEditForm(true); // Show Edit Form
    fetchResign();
  };

  const handleDelete = (row) => {
    const id = row._id;
    axios.post('http://localhost:5000/api/deleteResign', {id})
    fetchResign();
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      employeeName: "",
      date: "",
      reason: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
    fetchResign();
  };

  const handleUpdate = () => {
    setShowAddForm(false);
    setShowEditForm(true);
    const updateResign = {
      _id: formData._id,
      id: formData.id,
      employeeName: formData.employeeName,
      date: formData.date,
      reason: formData.reason,
    }
    try {
      axios.post('http://localhost:5000/api/updateResign', updateResign)
      setShowAddForm(false); // Hide Add Form
      setShowEditForm(false);
      fetchResign();
    } catch (error) {
      console.log(error);
    }

  };

  const addResign = () => {
    setShowAddForm(false);
    setShowEditForm(true);
    console.log(formData);
    setFormData({
      id: null,
      employeeName: "",
      date: "",
      reason: "",
    });
    const resign = {
      employeeName: formData.employeeName,
      date: formData.date,
      reason: formData.reason,
    }
    try {
      axios.post(`http://localhost:5000/api/addResign`, resign)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="employee-table">
      <div className="table-header">
        <form className="form">
          <button type="submit">
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
          <FaPlus className="add-icon" /> Add Employee
        </button>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add Employee</h3>
          <input
            type="text"
            placeholder="Employee Name"
            value={formData.employeeName}
            onChange={(e) =>
              setFormData({ ...formData, employeeName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
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
        <div className="add-department-form">
          <h3>Edit Employee</h3>
          <input
            type="text"
            placeholder="Employee Name"
            value={formData.employeeName}
            onChange={(e) =>
              setFormData({ ...formData, employeeName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <button className="submit-button" onClick={handleUpdate}>
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
      <div className="employees-table">
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
