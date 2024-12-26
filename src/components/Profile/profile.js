import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faCamera, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import "./profile.css";
import Default_picture from "../../assets/profile.jpg";
import UserProfile from "./userProfile";
import CompanyProfile from "./companyProfile";

function ProfileSettings() {
 
 

  return (
    <>
    <div className="profiles">
      <UserProfile/>
      {/* <UserProfile/> */}
      
    </div>

    </>
  );
}

export default ProfileSettings;
