import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./profile.css";
import Default_picture from "../../assets/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../config";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { updatePassword } from "../../redux/authSlice";

const UserProfile = () => {
  const [profileData, setProfileData] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [resMsg, setResMsg] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo?.password) {
      setPassword(userInfo.password);
    }
  }, [userInfo]);

  useEffect(() => {
    if (successModal) {
      const timeout = setTimeout(() => {
        setSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successModal]);

  // Handle input change
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle file selection
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

  // Upload image to server
  const handleImageUpload = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('id', userInfo.id);
    formData.append('username', userInfo.username);
    formData.append('profilePicture', selectedFile);

    try {
      const response = await axios.post(`${SERVER_URL}/users/profile-picture/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessModal(true);
        setModalType("update");
        setResMsg("Profile picture updated successfully!");
        setSelectedFile(null);
        
        // Reload the page to reflect the new image
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setResMsg("Failed to update profile picture. Please try again.");
      setWarningModal(true);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setResMsg("Password cannot be empty!");
      setWarningModal(true);
      return;
    }

    try {
      const response = await axios.put(`${SERVER_URL}/auth-pswd/${userInfo.id}/`, { password });

      if (response.status === 200) {
        dispatch(updatePassword(password));
        setModalType("update");
        setSuccessModal(true);
        setPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setResMsg("Failed to update password. Please try again.");
      setWarningModal(true);
    }
  };

  return (
    <div className="profile-settings">
      <h2>User Profile</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setModalType("update");
          setShowModal(true);
        }}
      >
        <div className="profile-picture-container">
          <div 
            className="profile-image-wrapper"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src={imagePreview || `${SERVER_URL}${userInfo.profilePicture}` || Default_picture}
              alt="Profile"
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
            readOnly
          />
        </div>

        <div>
          <label>Phone No:</label>
          <input
            type="text"
            name="username"
            value={userInfo.phoneNumber}
            onChange={handleUserChange}
            readOnly
          />
        </div>

        <div className="profile-password" >
          <label>Password:</label>
          <div style={{ position: "relative" }}>
            <input
            className="profile-password-pw" 
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />

            <button
              type="button"
              id="password-buton"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon style={{ color: "gray" }} icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button type="submit" className="submit-button" style={{ marginTop: "2vh" }}>
            Change Password
          </button>
        </div>
      </form>
      
      <ConirmationModal
        isOpen={showModal}
        message={`Are you sure you want to ${modalType} your password?`}
        onConfirm={() => {
          setShowModal(false);
          handlePasswordSubmit();
        }}
        onCancel={() => setShowModal(false)}
        animationData={modalType === "update" ? updateAnimation : null}
      />
      <ConirmationModal
        isOpen={successModal}
        message={resMsg || `Password ${modalType}d successfully!`}
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

export default UserProfile;