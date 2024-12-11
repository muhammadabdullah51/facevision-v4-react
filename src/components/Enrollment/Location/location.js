import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationTable from "./LocationTable";
import { SERVER_URL } from "../../../config";

const Location = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-loc/`);
      setData(response.data.context);
    } catch (error) {
    }
  };
  return <div>
    <LocationTable data={data} setData={setData} />
  </div>;
};

export default Location;
