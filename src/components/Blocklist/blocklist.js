import React, { useState,  useEffect } from "react";
import axios from "axios";
import BlockListTable from "./blocklistTable.js";
import { SERVER_URL } from "../../config.js";


const BlockEmployeeTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBlock();
}, []);


  const fetchBlock = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}blocklist/`);
        setData(response.data);
    } catch (error) {
    }
};
  return (
    <div>
      <BlockListTable data={data} setData={setData} />
    </div>
  );
};

export default BlockEmployeeTable;
