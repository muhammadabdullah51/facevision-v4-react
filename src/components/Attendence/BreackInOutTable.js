import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import ReactPaginate from "react-paginate";
import axios from "axios";
import "./attendence.css";
import { SERVER_URL } from "../../config";

const BreackInOutTable = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    break_name: "",
  });

  const fetchAtt = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}rp-break-time-records/`);
      setData(response.data);
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    fetchAtt();
  }, [fetchAtt]);

  // Extract unique break names for the dropdown
  const breakNames = useMemo(
    () => [...new Set(data.map((item) => item.break_name))],
    [data]
  );

  // Filter data based on the selected break name
  const filteredData = useMemo(() => {
    if (!formData.break_name) {
      return data.flatMap((item) => item.check_in_out_records);
    }
    return data
      .filter((item) => item.break_name === formData.break_name)
      .flatMap((item) => item.check_in_out_records);
  }, [data, formData.break_name]);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Employee ID",
        accessor: "empId",
      },
      {
        Header: "Employee Name",
        Cell: ({ row }) => (
          <span className="bold-fonts">
            {row.original.lName} {row.original.fName}
          </span>
        ),
      },
      {
        Header: "Time",
        accessor: "time",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status ${
              value === "checkin"
                ? "presentStatus"
                : value === "checkout"
                ? "lateStatus"
                : "none"
            }`}
          >
            {value}
          </span>
        ),
      },
    ],
    []
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
    usePagination
  );

  return (
    <div className="department-table">
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
              />
            </svg>
          </button>
        </form>
        <div className="search-select">

        <select
          value={formData.break_name}
          onChange={(e) =>
            setFormData({ ...formData, break_name: e.target.value })
          }
          className="break-select"
          >
          <option value="">All Breaks</option>
          {breakNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
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

export default BreackInOutTable;
