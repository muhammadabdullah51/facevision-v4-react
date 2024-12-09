import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { SERVER_URL } from '../../config';

// const data = [
//     {
//         day: 'Jun', Present: 10, Absent: 5, Late: 2,
//     },
//     {
//         day: 'Jul', Present: 15, Absent: 8, Late: 4,
//     },
//     {
//         day: 'Aug', Present: 18, Absent: 12, Late: 2,
//     },
//     {
//         day: 'Sep', Present: 25, Absent: 10, Late: 5,
//     },
//     {
//         day: 'Oct', Present: 15, Absent: 9, Late: 3,
//     },
//     {
//         day: 'Nov', Present: 20, Absent: 11, Late: 4,
//     },
//     {
//         day: 'Dec', Present: 22, Absent: 13, Late: 6,
//     },
// ];

const PerformanceChart = ({data}) => {

  

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* <Bar dataKey="Present" stackId="a" fill="#116BE9" />
                <Bar dataKey="Absent" stackId="a" fill="#599EFF" />
                <Bar dataKey="Late" stackId="a" fill="#34BDEB" /> */}
                <Bar dataKey="present" stackId="a" fill="#5833A7" />
                <Bar dataKey="absent" stackId="a" fill="#7341DA" />
                <Bar dataKey="late" stackId="a" fill="#7670eb" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PerformanceChart;
