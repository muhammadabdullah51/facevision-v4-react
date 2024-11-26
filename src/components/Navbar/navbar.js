import React, { useEffect, useState } from "react";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons"; // Removed other icons
import { SERVER_URL } from "../../config";
import Settings from "../Settings/settings";
import { color } from "d3";

const menuItems = [
  { label: 'Logout', icon: faSignOutAlt, key: 'logout' },  // Only keeping logout
];

const Navbar = ({ onMenuChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyLogo, setCompanyLogo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard'); // Default menu state

  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}auth-cmp-reg/`);
        if (response.data.context && response.data.context.length > 0) {
          const logoPath = response.data.context[0].logo.replace(/\\/g, "/");
          setCompanyLogo(logoPath);
        }
      } catch (error) {
        console.error("Error fetching company logo:", error);
      }
    };
    fetchCompanyLogo();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleNavigation = (key) => {
    if (key === "logout") {
      handleLogout(); // Logout logic
    }
    setSelectedMenu(key); // Update the selected menu state
    onMenuChange(key); // Pass it to the parent component if needed
    setDropdownOpen(false); // Close the dropdown menu after selection
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Navigate to the home page or login page
  };

  const renderSettings = () => {
    switch (selectedMenu) {
      case "logout":
        return handleLogout(); // Logout and clear the screen
      default:
        return null; // Nothing is rendered for other cases
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <h2 className="navbar-selected">{selectedMenu}</h2>
        <div className="company-logo-wrapper">
          {companyLogo && (
            <img
              src={`${SERVER_URL}${companyLogo}`}
              alt="Company Logo"
              className="navbar-company-logo"
            />
          )}
        </div>

        <div className="navbar-links">
          <button
            className="setting-toggle"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
          >
            {userInfo?.profilePicture ? (
              <img
                src={`${SERVER_URL}${userInfo.profilePicture}`}
                alt="Profile"
                className="user-profile-picture"
              />
            ) : (
              <div className="default-avatar">U</div>
            )}
          </button>

          {dropdownOpen && (
            <ul className="setting-menu" onClick={(e) => e.stopPropagation()}>
              <li>
                <span><FontAwesomeIcon icon={faUser} /></span>
                <span>{userInfo?.username}</span>
              </li>
              <hr />
              {menuItems.map(item => (
                <li key={item.key} onClick={() => handleNavigation(item.key)} style={{color: '#ef4444'}}>
                  <span><FontAwesomeIcon icon={item.icon} /></span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default Navbar;
