import React, { useEffect, useState } from 'react';
import LineChartComponent from './lineChart';
import './linechart.css';
import { SERVER_URL } from '../../config';
import axios from 'axios';

const DashboardCard = () => {
    const [data, setData] = useState([])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}checkin-chart/`);
                setData(res.data);
            } catch (error) {
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-card">
            <div>
                <h4>Weekly Attendance</h4>
                <p>Weekly CheckIn CheckOut</p>
                <h2>Check In/Out</h2>
                <p>In/Out Flow</p>
            </div>
            <div className="line-chart-container">
                <LineChartComponent data={data}/>
            </div>
            <div className="earnings-info">
            <p>Today's CheckIns <span className="positive">{data[data.length - 1]?.check_in_count || 0}</span></p>
            <p>Today's CheckOuts <span className="negative ">{data[data.length - 1]?.check_out_count || 0}</span></p>
            </div>
        </div>
    );
};

export default DashboardCard;
