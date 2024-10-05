import React, { useState, useEffect } from "react";
import VisitorTable from "./VisitorTable";
import AddVisitor from "../AddVisitors/addvisitors";
import axios from "axios";
const Visitors = () => {

    const [activeTab, setActiveTab] = useState('Visitors');
    const [data, setData] = useState([])
    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/fetchVisitor');
            console.log(response.data)
            setData(response.data);
        } catch (error) {
            console.error('Error fetching resignation data:', error);
        }
    };
    return (
        <div>
            {activeTab === 'Visitors' ? (
                <VisitorTable data={data} setData={setData} setActiveTab={setActiveTab} />
            ) : (
                <AddVisitor setData={setData} setActiveTab={setActiveTab} data={data} />
            )}
        </div>
    );
};

export default Visitors;
