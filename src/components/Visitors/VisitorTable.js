import React, { useState, useMemo } from 'react';
import { useTable, usePagination, useRowSelect } from 'react-table';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import './visitors.css'
import axios from 'axios';

const VisitorTable = ({ data, setData, activeTab, setActiveTab }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        _id: '',
        id: null,
        visitorName: '',
        crftNo: '',
        createTime: '',
        exitTime: '',
        email: '',
        phoneNo: '',
        visitingDepartment: '',
        host: '',
        visitingReason: '',
        carryingGoods: '',
        image: '',
    });

    // Define visitor table columns
    const columns = useMemo(
        () => [
            {
                Header: 'Serial No',
                accessor: 'srNo',
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: 'Visitor ID',
                accessor: 'id',
            },
            {
                Header: 'Visitor Name',
                accessor: 'visitorName',
                Cell: ({ row  }) => (
                    <span className='bold-fonts'>{row.original.firstName} {row.original.lastName}</span>
                ),
            },
            {
                Header: 'Crft No',
                accessor: 'crftNo',
            },
            {
                Header: 'Create Time',
                accessor: 'createTime',
            },
            {
                Header: 'Exit Time',
                accessor: 'exitTime',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Phone No',
                accessor: 'phoneNo',
            },
            {
                Header: 'Visiting Department',
                accessor: 'visitingDepartment',
                Cell: ({ value }) => (
                    <span className='bold-fonts'>{value}</span>
                ),
            },
            {
                Header: 'Host',
                accessor: 'host',
            },
            {
                Header: 'Visiting Reason',
                accessor: 'visitingReason',
                Cell: ({ value }) => (
                    <span className='bold-fonts'>{value}</span>
                ),
            },
            {
                Header: 'Carrying Goods',
                accessor: 'carryingGoods',
            },
            {
                Header: 'Image',
                accessor: 'image',
            },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <div>
                        <button onClick={() => handleEdit(row.original)} style={{ background: 'none', border: 'none' }}>
                            <FaEdit className='table-edit' />
                        </button>
                        <button onClick={() => handleDelete(row.original)} style={{ background: 'none', border: 'none' }}>
                            <FaTrash className='table-delete' />
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
            data.filter(row =>
                Object.values(row).some(
                    val => String(val).toLowerCase().includes(searchQuery.toLowerCase())
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

    // Handle Edit
    const handleEdit = (row) => {
        setFormData({
            id: row.id,
            visitorName: row.visitorName,
            crftNo: row.crftNo,
            createTime: row.createTime,
            exitTime: row.exitTime,
            email: row.email,
            phoneNo: row.phoneNo,
            visitingDepartment: row.visitingDepartment,
            host: row.host,
            visitingReason: row.visitingReason,
            carryingGoods: row.carryingGoods,
            image: row.image
        });

    };

    // Handle Delete
    const handleDelete = (row) => {
        const id = row._id
        axios.post('http://localhost:5000/api/deleteVisitor', { id })
    };

    const handleAdd = () => {
        setActiveTab('Add Visitor');  // Update the activeTab state from parent
    };

    const handleUpdate = () => {

    };

    return (
        <div className='visitor-table'>
            <div className='table-header'>
                <form className="form">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="input"
                        required
                        type="text"
                    />
                </form>
                <button className="add-button" onClick={handleAdd}>
                    <FaPlus className="add-icon" /> Add New Visitor
                </button>
            </div>
            <div className="departments-table">
                <table {...getTableProps()} className="table">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={pageOptions.length}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={({ selected }) => gotoPage(selected)}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
}

export default VisitorTable
