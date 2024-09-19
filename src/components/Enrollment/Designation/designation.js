import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DesignationTable from './designationTable';

const Designation = () => {
    const [data, setData] = useState([
      ])


      useEffect(() => {
        fetchDesignation();
    }, []);

      const fetchDesignation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/fetchDesignation');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching department data:', error);
        }
    };
    return (
        <div>
            <DesignationTable data={data} setData={setData}/>
        </div>
    );
};

export default Designation;
