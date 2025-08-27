import React from "react";
import "./profile.css";
import UserProfile from "./userProfile";
import CompanyProfile from "./companyProfile";

function ProfileSettings() {
 
 

  return (
    <>
    <div className="profiles">
      <UserProfile/>
      <CompanyProfile/>
      <div className="footer-profile">
        <h5>Powered by Axix Technologies</h5>
      </div>
      
    </div>

    </>
  );
}

export default ProfileSettings;
