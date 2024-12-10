import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faCamera, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import "./profile.css";
import Default_picture from "../../assets/profile.jpg";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config";

const UserProfile = () => {

     // State for profile data
  const [profileData, setProfileData] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  console.log(userInfo);


  


     // Handle input change
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profilePicture: URL.createObjectURL(file), // Update profile picture with selected file
      });
    }
  };
 // Handle form submission
  const handleUserSubmit = (e) => {
    e.preventDefault();
    console.log("Profile data saved:", profileData);
  };
  return (
      <div className="profile-settings">
        <h2>User Profile</h2>
        <form onSubmit={handleUserSubmit}>
          <div className="profile-picture-container">
            <img
              src={`${SERVER_URL}${userInfo.profilePicture}`}
              alt="Profile"
              className="profile-picture"
            />
            <input
              type="file"
              id="file-input"
              onChange={handleProfilePictureChange}
              style={{ display: "none" }}
            />
            {/* <div className="profile-buttons">
              <button
                type="button"
                onClick={() => document.getElementById("file-input").click()}
              >
                <FontAwesomeIcon icon={faCamera} /> Change picture
              </button>
              <button
                type="button"
                onClick={() =>
                  setProfileData({
                    ...profileData,
                    profilePicture: Default_picture,
                  })
                }
              >
                <FontAwesomeIcon icon={faTrash} /> Delete picture
              </button>
            </div> */}
          </div>

          <div>
            <label>Username:</label>
            <input
              type="text"
              name="profileName"
              value={userInfo.username}
              readOnly
              onChange={handleUserChange}
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="text"
              name="username"
              value={userInfo.email}
              onChange={handleUserChange}
            />
          </div>

          <div>
            <label>Phone No:</label>
            <input
              type="text"
              name="username"
              value={userInfo.phoneNumber}
              onChange={handleUserChange}
            />
          </div>
        </form>
      </div>
  )
}

export default UserProfile
