import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "./departmentTable";
import { SERVER_URL } from "../../../config";

const Department = () => {
  const [data, setData] = useState([]);

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to fetch department data from the server
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}pr-dpt/`
      );
      setData(response.data.context);

      
    } catch (error) {
    }
  };

  return (
    <div>
      <TableComponent
        data={data}
        setData={setData}
        fetchDepartments={fetchDepartments}
      />
    </div>
  );
};

export default Department;
