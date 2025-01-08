import React, { useState } from "react";
import axios from "axios";
import SERVER_URL from "../../../config";
import { FaDownload } from "react-icons/fa";
import Lottie from "react-lottie";
import successAnimation from "../../../assets/Lottie/successAnim.json";

const BackupComponent = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Helper function to validate .db files
  const isValidFile = (file) => {
    return file && file.name.endsWith(".db");
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (isValidFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      alert("Only .db files are allowed!");
    }
    // Reset file input value to allow re-selecting the same file
    event.target.value = null;
  };

  // Handle drag-and-drop events
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (isValidFile(droppedFile)) {
      setFile(droppedFile);
    } else {
      alert("Only .db files are allowed!");
    }
  };

  // Upload backup
  const uploadBackup = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${SERVER_URL}backup/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
      setShowSuccess(true);
      setFile(null); // Clear the file
    } catch (error) {
      console.error("Error uploading backup:", error);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadBackup(file);
    } else {
      alert("Please select a .db file to upload");
    }
  };

  // Cancel upload
  const cancelUpload = () => {
    setFile(null);
  };

  // Download backup
  const downloadBackup = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}backup/download/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.db");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading backup:", error);
    }
  };

  const successOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="backup-container">
    {showSuccess ? (
      <div className="success-animation">
        <Lottie options={successOptions} height={150} width={150} />
        <p style={{textAlign:'center'}}>Restore Completed Successfully!</p>
      </div>
    ) : (
      <>
        <div className="download-btn">
          <button className="add-button download-backup" onClick={downloadBackup}>
            <FaDownload /> Download Backup
          </button>
        </div>
        <div
          className={`drag-drop-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? <p>{file.name}</p> : <p>Drag and drop a .db file here, or click to select a file</p>}
          <input type="file" onChange={handleFileChange} id="fileInput" hidden accept=".db" />
          <label htmlFor="fileInput" className="choose-file">
            Choose File
          </label>
        </div>
        {file && (
          <div className="upload-backup">
            <button className="submit-button" onClick={handleUpload}>
              Restore Backup
            </button>
            <button className="cancel-button" onClick={cancelUpload}>
              Cancel
            </button>
          </div>
        )}
        {/* <BackupSchedular/> */}
      </>
    )}
  </div>
);
};


export default BackupComponent;
