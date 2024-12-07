import React, { useState, useEffect } from "react";
import VisitorTable from "./VisitorTable";
import AddVisitor from "../AddVisitors/addvisitors";
import axios from "axios";
import { SERVER_URL } from "../../config";
const Visitors = () => {
  const [activeTab, setActiveTab] = useState("Visitors");
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}visitors/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching resignation data:", error);
    }
  };

  const handleEdit = (row) => {
    setIsEditMode(true);
    setEditData(row);
    console.log(row)
    setActiveTab("Add Visitors");
  };
  const handleAdd = () => {
    setIsEditMode(false);
    setEditData(null);
    setActiveTab("Add Visitors");
  }
  const renderTabContent = () => {
    if (activeTab === "Visitors") {
      return <VisitorTable data={data}  setActiveTab={setActiveTab} onEdit={handleEdit} onAdd={handleAdd} />;
    } else if (activeTab === "Add Visitors") {
      return <AddVisitor editData={editData}  isEditMode={isEditMode} setIsEditMode={setIsEditMode} setActiveTab={setActiveTab} />;
    }
    return null;
  }
  return (
    <>
        <div className="tab-content">{renderTabContent()}</div>
    </>
  );
};

export default Visitors;
