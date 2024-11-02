import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DesignationTable from './designationTable';
import { SERVER_URL } from '../../../config';

const Designation = () => {
    const [data, setData] = useState([
      ])


      useEffect(() => {
        fetchDesignation();
    }, []);

      const fetchDesignation = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}pr-dsg/`);
            setData(response.data.context);
        } catch (error) {
            console.error('Error fetching designation data:', error);
        }
    };
    return (
        <div>
            <DesignationTable data={data} setData={setData}/>
        </div>
    );
};

export default Designation;
