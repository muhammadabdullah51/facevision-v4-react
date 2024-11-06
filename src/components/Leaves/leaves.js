import React, { useState, useEffect } from "react";
import LeaveTable from "./LeaveTable";
import axios from "axios";
import { SERVER_URL } from "../../config";


const Leaves = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchLeave();
    }, []);

    const fetchLeave = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}att-lv-cr/`);
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
