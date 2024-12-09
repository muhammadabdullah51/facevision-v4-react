import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const LineChartComponent = ({data}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                {/* Green line for check-ins */}
                <Line type="monotone" dataKey="check_in_count" stroke="#28a745" strokeWidth={2} dot={false} />
                {/* Red line for check-outs */}
                <Line type="monotone" dataKey="check_out_count" stroke="#dc3545" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;
