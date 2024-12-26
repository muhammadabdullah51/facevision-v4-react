import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faCamera, faTrash, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import "./profile.css";
import Default_picture from "../../assets/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../config";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
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

  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (userInfo?.password) {
      setPassword(userInfo.password);
    }
  }, [userInfo]);
  const dispatch = useDispatch()

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
          <img
            src={`${SERVER_URL}${userInfo.profilePicture}`}
            alt="Profile"
            className="profile-picture"
          />
          <input
            readOnly
            type="file"
            id="file-input"
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





        <div className="" style={{ position: "relative", display: "block", alignItems: "center" }}>
          <label>Password:</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              style={{
                width: "95%",
                paddingRight: "40px", // Adjust padding to fit the button inside
              }}
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "0%", // Position the button inside the input
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
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
        message={`Password ${modalType}d successfully!`}
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
  )
}

export default UserProfile
