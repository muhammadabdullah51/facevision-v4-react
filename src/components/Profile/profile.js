import React from "react";
import "./profile.css";
import UserProfile from "./userProfile";

function ProfileSettings() {
 
 

  return (
    <>
    <div className="profiles">
      <UserProfile/>
      {/* <UserProfile/> */}
      <div className="footer-profile">
        <h5>Powered by Axix Technologies</h5>
      </div>
      
    </div>

    </>
  );
}

export default ProfileSettings;
