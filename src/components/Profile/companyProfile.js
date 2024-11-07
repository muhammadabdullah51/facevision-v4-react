import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faCamera, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import "./profile.css";
import Default_picture from "../../assets/profile.jpg";

const CompanyProfile = () => {
    const [companyData, setCompanyData] = useState({
        companyName: "Danish",
        statuses: "On duty",
        aboutCompany: "Discuss only on work hours, unless you wanna discuss about tech 🎵",
        companyPicture: Default_picture, // Set imported default profile picture
      });
    
     
      const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({
          ...companyData,
          [name]: value,
        });
      };
    
    
      const handleCompanyPictureChange = (e) => {
        const file1 = e.target.files[0];
        if (file1) {
          setCompanyData({
            ...companyData,
            companyPicture: URL.createObjectURL(file1), // Update profile picture with selected file
          });
        }
      };
    
     
      const handleCompanySubmit = (e) => {
        e.preventDefault();
        console.log("Profile data saved:", companyData);
      };
  return (
        <div className="profile-settings">
        <h2>Company Profile</h2>
        <form onSubmit={handleCompanySubmit}>
          <div className="profile-picture-container">
            <img
              src={companyData.companyPicture}
              alt="Profile"
              className="profile-picture"
            />
            <input
              type="file"
              id="file-input"
              onChange={handleCompanyPictureChange}
              style={{ display: "none" }}
            />
            <div className="profile-buttons">
              <button
                type="button"
                onClick={() => document.getElementById("file-input").click()}
              >
                <FontAwesomeIcon icon={faCamera} /> Change picture
              </button>
              <button
                type="button"
                onClick={() =>
                  setCompanyData({
                    ...companyData,
                    companyPicture: Default_picture,
                  })
                }
              >
                <FontAwesomeIcon icon={faTrash} /> Delete picture
              </button>
            </div>
          </div>

          <div>
            <label>Profile Name:</label>
            <input
              type="text"
              name="profileName"
              value={companyData.companyName}
              onChange={handleCompanyChange}
            />
          </div>

         

          <div>
            <label>Status Recently:</label>
            <input
              type="text"
              name="status"
              value={companyData.statuses}
              onChange={handleCompanyChange}
            />
          </div>

          <div>
            <label>About Me:</label>
            <textarea
              name="about"
              value={companyData.aboutCompany}
              onChange={handleCompanyChange}
            />
          </div>

          <button className="profile-submit" type="submit">
            Save changes
          </button>
        </form>
      </div>
      
  )
}

export default CompanyProfile
