import React, { useState, useEffect } from "react";
import ResignTable from "./ResignTable";
import axios from "axios";

const Resign = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchResign();
}, []);


  const fetchResign = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/fetchResign');
        setData(response.data);
    } catch (error) {
        console.error('Error fetching resignation data:', error);
    }
};
  return (
    <div>
      <ResignTable data={data} setData={setData} />
    </div>
  );
};

export default Resign;
