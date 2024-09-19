import React, { useState, useEffect } from 'react';
import DevicesTable from './devicesTable.js'
import axios from 'axios';

const Devices = () => {
    const [data, setData] = useState([]);
    
    useEffect(()=>{
        fetchDevices();
    }, [])

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/fetchDevices');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching Devices data:', error);
        }
    };


    return (
        <div>
            <DevicesTable data={data} setData={setData} />
        </div>
    )
}

export default Devices;
