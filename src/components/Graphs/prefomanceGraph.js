import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


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
