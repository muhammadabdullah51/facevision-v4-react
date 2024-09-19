import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from './departmentTable';

const Department = () => {
    const [data, setData] = useState([]);

    // Fetch departments when the component mounts
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Function to fetch department data from the server
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/fetchDepartment');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching department data:', error);
        }
    };

    return (
        <div>
            <TableComponent data={data} setData={setData} fetchDepartments={fetchDepartments} />
        </div>
    );
};

export default Department;
