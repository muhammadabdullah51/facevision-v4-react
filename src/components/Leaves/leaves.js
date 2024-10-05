import React, { useState, useEffect } from "react";
import LeaveTable from "./LeaveTable";
import axios from "axios";


const Leaves = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchLeave();
    }, []);

    const fetchLeave = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/fetchLeave');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching resignation data:', error);
        }
    };

    return (
        <div>
            <LeaveTable data={data} setData={setData} />
        </div>
    );
};

export default Leaves;
