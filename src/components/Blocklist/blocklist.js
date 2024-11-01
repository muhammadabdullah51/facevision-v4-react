import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import BlockListTable from "./blocklistTable.js";


const BlockEmployeeTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBlock();
}, []);


  const fetchBlock = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/fetchBlock');
        setData(response.data);
    } catch (error) {
        console.error('Error fetching Block data:', error);
    }
};
  return (
    <div>
      <BlockListTable data={data} setData={setData} />
    </div>
  );
};

export default BlockEmployeeTable;
