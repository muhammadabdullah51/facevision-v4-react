import React, { useState, useEffect } from 'react';
import DevicesTable from './devicesTable.js'
import axios from 'axios';
import { SERVER_URL } from '../../config.js';

const Devices = () => {
    const [data, setData] = useState([]);
    
    useEffect(()=>{
        fetchDevices();
    }, [])

    const fetchDevices = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}device/`);
            setData(response.data.context);
        } catch (error) {
        }
    };


    return (
        <div>
            <DevicesTable data={data} setData={setData} />
        </div>
    )
}

export default Devices;
