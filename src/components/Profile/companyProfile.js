import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./profile.css"; // Using the same CSS file
import Default_picture from "../../assets/profile.jpg";
import { SERVER_URL } from "../../config";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    employees: "",
    industry: "",
    description: "",
    logo: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch company data on component mount
  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (successModal) {
      const timeout = setTimeout(() => {
        setSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successModal]);

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/auth-cmp-reg/`);
      if (response.data.status && response.data.context.length > 0) {
        const company = response.data.context[0];
        setCompanyData({
          companyName: company.companyName || "",
          employees: company.employees || "",
          industry: company.industry || "",
          description: company.description || "",
          logo: company.logo || ""
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setResMsg("Failed to load company data. Please try again.");
      setWarningModal(true);
    }
  };

  // Handle file selection for logo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload logo to server
  const handleImageUpload = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('cmpId', 1); // Adjust based on your actual company ID
    formData.append('logo', selectedFile);

    try {
      const response = await axios.post(`${SERVER_URL}/auth-cmp-reg/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessModal(true);
        setResMsg("Company logo updated successfully!");
        setSelectedFile(null);
        
        // Update the company data with the new logo
        if (response.data.context && response.data.context.length > 0) {
          const updatedCompany = response.data.context[0];
          setCompanyData(prev => ({
            ...prev,
            logo: updatedCompany.logo
          }));
        }
        
        setImagePreview("");
      }
    } catch (error) {
      console.error("Error updating company logo:", error);
      setResMsg("Failed to update company logo. Please try again.");
      setWarningModal(true);
    }
  };

  // Handle logo deletion
  const handleDeleteLogo = async () => {
    try {
      const response = await axios.delete(`${SERVER_URL}/auth-cmp-reg/`, {
        data: {
          cmpId: 1 // Adjust based on your actual company ID
        }
      });

      if (response.status === 200) {
        setSuccessModal(true);
        setResMsg("Company logo removed successfully!");
        
        // Update the company data to remove the logo
        setCompanyData(prev => ({
          ...prev,
          logo: ""
        }));
      }
    } catch (error) {
      console.error("Error deleting company logo:", error);
      setResMsg("Failed to delete company logo. Please try again.");
      setWarningModal(true);
    }
  };

  return (
    <div className="profile-settings">
      <h2>Company Profile</h2>
      <form>
        <div className="profile-picture-container">
          <div 
            className="profile-image-wrapper"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src={imagePreview || (companyData.logo ? `${SERVER_URL}${companyData.logo}` : Default_picture)}
              alt="Company Logo"
              className="profile-picture"
            />
            {isHovering && (
              <label className="profile-image-overlay">
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
          
          {selectedFile && (
            <div className="upload-button-container">
              <button
                type="button"
                onClick={handleImageUpload}
                className="upload-button"
              >
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setImagePreview("");
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          )}
          
          {/* <div className="profile-buttons">
            <button
              type="button"
              onClick={() => document.getElementById("file-input").click()}
            >
              <FontAwesomeIcon icon={faCamera} /> Change picture
            </button>
            <button
              type="button"
              onClick={handleDeleteLogo}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete picture
            </button>
          </div> */}
        </div>

        <div>
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={companyData.companyName}
            readOnly
          />
        </div>

        <div>
          <label>Industry:</label>
          <input
            type="text"
            name="industry"
            value={companyData.industry}
            readOnly
          />
        </div>

        <div>
          <label>Number of Employees:</label>
          <input
            type="text"
            name="employees"
            value={companyData.employees}
            readOnly
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={companyData.description}
            readOnly
          />
        </div>
      </form>
      
      <ConirmationModal
        isOpen={showModal}
        message="Are you sure you want to update your company logo?"
        onConfirm={() => {
          setShowModal(false);
          handleImageUpload();
        }}
        onCancel={() => {
          setShowModal(false);
          setSelectedFile(null);
          setImagePreview("");
        }}
        animationData={updateAnimation}
      />
      <ConirmationModal
        isOpen={successModal}
        message={resMsg}
        onConfirm={() => setSuccessModal(false)}
        onCancel={() => setSuccessModal(false)}
        animationData={successAnimation}
        successModal={successModal}
      />
      <ConirmationModal
        isOpen={warningModal}
        message={resMsg}
        onConfirm={() => setWarningModal(false)}
        onCancel={() => setWarningModal(false)}
        animationData={warningAnimation}
        warningModal={warningModal}
      />
    </div>
  );
};

export default CompanyProfile;