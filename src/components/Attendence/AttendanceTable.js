import React, { useState, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import ReactPaginate from "react-paginate";
import './attendence.css'

const AttendanceTable = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Location",
        accessor: "Location",
      },
      {
        Header: "Employee ID",
        accessor: "Employee ID",
      },
      {
        Header: "Employee Name",
        accessor: "Employee Name",
        Cell: ({ value }) => (
          <span className='bold-fonts'>{value}</span>
        ),
      },
      {
        Header: "Time",
        accessor: "Time",
      },
      {
        Header: "Status",
        accessor: "Status",
        Cell: ({ value }) => (
          <span
          className={`status ${
            value === "Present"
              ? "presentStatus"
              : value === "Absent"
              ? "absentStatus"
              : value === "Late"
              ? "lateStatus"
              : 'none'
          }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Date",
        accessor: "Date",
      },
    ],
    []
  );

  // Filter data based on search query
  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [data, searchQuery]
  );

  // Set up the table
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
    usePagination
  );

  return (
    <div className="location-table">
      <div className="table-header">
        <form className="form">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="input"
            type="text"
          />
          <button
            className="reset"
            type="button"
            onClick={() => setSearchQuery("")}
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
              ></path>
            </svg>
          </button>
        </form>
      </div>

      <div className="locations-table">
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

export default AttendanceTable;
