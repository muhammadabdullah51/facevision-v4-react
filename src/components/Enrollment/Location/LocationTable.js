import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import "./location.css"; // Custom CSS for styling
import axios from "axios";

const LocationTable = ({ data, setData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    id: null,
    locationCode: "",
    locationName: "",
    deviceQuantity: "",
    employeeQuantity: "",
    resignedQuantity: "",
  });

  // Call fetchDepartments when component mounts
  useEffect(() => {
    fetchLocation();
  }, []);

  const handleUpdate = async () => {
    const updateLocation = {
      _id: formData._id,
      locationCode: formData.locationCode,
      locationName: formData.locationName,
      deviceQuantity: formData.deviceQuantity,
      employeeQuantity: formData.employeeQuantity,
      resignedQuantity: formData.resignedQuantity,
    };
    console.log(updateLocation);
    try {
      axios.post(`http://localhost:5000/api/updateLocation`, updateLocation);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchLocation"
      );
      setData(updatedData.data);
      fetchLocation();
      setShowEditForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocation = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fetchLocation");
      if (response.ok) {
        const location = await response.json();
        setData(location);
      } else {
        throw new Error("Failed to fetch location");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Location Code",
        accessor: "locationCode",
      },
      {
        Header: "Location Name",
        accessor: "locationName",
        Cell: ({ value }) => <span className="bold-fonts">{value}</span>,
      },
      {
        Header: "Device Quantity",
        accessor: "deviceQuantity",
      },
      {
        Header: "Employee Quantity",
        accessor: "employeeQuantity",
      },
      {
        Header: "Resigned Quantity",
        accessor: "resignedQuantity",
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
      locationCode: row.locationCode,
      locationName: row.locationName,
      deviceQuantity: row.deviceQuantity,
      employeeQuantity: row.employeeQuantity,
      resignedQuantity: row.resignedQuantity,
    });
    setShowAddForm(false); // Hide Add Form
    setShowEditForm(true); // Show Edit Form
  };

  const handleDelete = async (row) => {
    const id = row._id;
    axios.post(`http://localhost:5000/api/deleteLocation`, { id });
    console.log(id);
    const updatedData = await axios.get(
      "http://localhost:5000/api/fetchLocation"
    );
    setData(updatedData.data);
    fetchLocation();
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      locationCode: "",
      locationName: "",
      deviceQuantity: "",
      employeeQuantity: "",
      resignedQuantity: "",
    });
    setShowAddForm(true);
    setShowEditForm(false); // Hide Edit Form
  };

  const addLocation = async () => {
    setShowAddForm(false);
    setShowEditForm(true);
    console.log(formData);

    const location = {
      locationCode: formData.locationCode,
      locationName: formData.locationName,
      deviceQuantity: formData.deviceQuantity,
      employeeQuantity: formData.employeeQuantity,
      resignedQuantity: formData.resignedQuantity,
    };
    try {
      axios.post("http://localhost:5000/api/addLocation", location);
      const updatedData = await axios.get(
        "http://localhost:5000/api/fetchLocation"
      );
      setData(updatedData.data);
      fetchLocation();
      setShowAddForm(false);
      setShowEditForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="location-table">
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
          <FaPlus className="add-icon" /> Add New Location
        </button>
      </div>
      {showAddForm && !showEditForm && (
        <div className="add-department-form">
          <h3>Add New Location</h3>
          <input
            type="text"
            placeholder="Location Code"
            value={formData.locationCode}
            onChange={(e) =>
              setFormData({ ...formData, locationCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location Name"
            value={formData.locationName}
            onChange={(e) =>
              setFormData({ ...formData, locationName: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Device Quantity"
            value={formData.deviceQuantity}
            onChange={(e) =>
              setFormData({ ...formData, deviceQuantity: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Employee Quantity"
            value={formData.employeeQuantity}
            onChange={(e) =>
              setFormData({ ...formData, employeeQuantity: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Resigned Quantity"
            value={formData.resignedQuantity}
            onChange={(e) =>
              setFormData({ ...formData, resignedQuantity: e.target.value })
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
            value={formData.locationCode}
            onChange={(e) =>
              setFormData({ ...formData, locationCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location Name"
            value={formData.locationName}
            onChange={(e) =>
              setFormData({ ...formData, locationName: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Device Quantity"
            value={formData.deviceQuantity}
            onChange={(e) =>
              setFormData({ ...formData, deviceQuantity: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Employee Quantity"
            value={formData.employeeQuantity}
            onChange={(e) =>
              setFormData({ ...formData, employeeQuantity: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Resigned Quantity"
            value={formData.resignedQuantity}
            onChange={(e) =>
              setFormData({ ...formData, resignedQuantity: e.target.value })
            }
          />
          <button className="submit-button" onClick={handleUpdate}>
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
