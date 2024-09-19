import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
    {
        name: 'Jun', Pending: 10, Paid: 5, Rejected: 2,
    },
    {
        name: 'Jul', Pending: 15, Paid: 8, Rejected: 4,
    },
    {
        name: 'Aug', Pending: 18, Paid: 12, Rejected: 2,
    },
    {
        name: 'Sep', Pending: 25, Paid: 10, Rejected: 5,
    },
    {
        name: 'Oct', Pending: 15, Paid: 9, Rejected: 3,
    },
    {
        name: 'Nov', Pending: 20, Paid: 11, Rejected: 4,
    },
    {
        name: 'Dec', Pending: 22, Paid: 13, Rejected: 6,
    },
];

const PerformanceChart = () => {
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Pending" stackId="a" fill="#116BE9" />
                <Bar dataKey="Paid" stackId="a" fill="#599EFF" />
                <Bar dataKey="Rejected" stackId="a" fill="#34BDEB" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PerformanceChart;
