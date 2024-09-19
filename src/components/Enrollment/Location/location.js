import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationTable from "./LocationTable";

const Location = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetchLocation');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };
  return <div>
    <LocationTable data={data} setData={setData} />
  </div>;
};

export default Location;
