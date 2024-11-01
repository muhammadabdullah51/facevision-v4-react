import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./visitors.css";
import axios from "axios";

const VisitorTable = ({ data, setData, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    _id: "",
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
    image: "",
  });
   // Helper function to format datetime
   const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
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
  

  // Define visitor table columns
  const columns = useMemo(
    () => [
      {
        Header: "Serial No",
        accessor: "srNo",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Visitor ID",
        accessor: "visitorsId",
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
        Header: "Image",
        accessor: "image",
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

  // Filter the data based on search input
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

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetchVisitor"
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching resignation data:", error);
    }
  };

  // Handle Edit
  const handleEdit = (row) => {
    setFormData({
      visitorsId: row.visitorsId,
      fName: row.fName,
      lName: row.lName,
      certificationNo: row.certificationNo,
      createTime: row.createTime,
      exitTime: row.exitTime,
      email: row.email,
      contactNo: row.contactNo,
      visitingDept: row.visitingDept,
      host: row.host,
      cardNumber: row.cardNumber,
      visitingReason: row.visitingReason,
      carryingGoods: row.carryingGoods,
      image: row.image,
    });
  };

  // Handle Delete
  const handleDelete = async (row) => {
    const visitorsId = row._id;
    axios.post("http://localhost:5000/api/deleteVisitor", { visitorsId });
    const updatedData = await axios.get(
      "http://localhost:5000/api/fetchVisitor"
    );
    setData(updatedData.data);
    fetchVisitors();
  };

  const handleAdd = () => {
    setActiveTab("Add Visitor"); // Update the activeTab state from parent
  };

  const handleUpdate = () => {};

  return (
    <div className="visitor-table">
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
          <FaPlus className="add-icon" /> Add New Visitor
        </button>
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
