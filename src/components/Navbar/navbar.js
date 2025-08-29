// import React, { useEffect, useState } from "react";
// import "./navbar.css";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../redux/authSlice";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
// import { SERVER_URL } from "../../config";


// const menuItems = [
//   { label: "Logout", icon: faSignOutAlt, key: "logout" },
// ];

// const Navbar = ({ onMenuChange, selectedMenu, setSelectedMenu }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [companyLogo, setCompanyLogo] = useState(null);

//   const userInfo = useSelector((state) => state.auth.userInfo);

//   useEffect(() => {
//     const fetchCompanyLogo = async () => {
//       try {
//         const response = await axios.get(`${SERVER_URL}auth-cmp-reg/`);
//         if (response.data.context && response.data.context.length > 0) {
//           const logoPath = response.data.context[0].logo.replace(/\\/g, "/");
//           setCompanyLogo(logoPath);
//         }
//       } catch (error) {
//       }
//     };
//     fetchCompanyLogo();
//   }, []);

//   const handleNavigation = (key) => {
//     if (key === "logout") {
//       handleLogout();
//     }
//     setSelectedMenu(key);
//     onMenuChange(key);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <div className="navbar-container">
//       <div className="navbar">
//         <h2 className="navbar-selected">{selectedMenu}</h2>
//         {/* <div className="company-logo-wrapper">
//           {companyLogo && (
//             <img
//               src={`${SERVER_URL}${companyLogo}`}
//               alt="Company Logo"
//               className="navbar-company-logo"
//             />
//           )}
//         </div> */}

//         <div className="navbar-links">
//           <div className="dropdown">
//             <button className="setting-toggle ">

//               {userInfo?.profilePicture ? (
//                 <img
//                 src={`${SERVER_URL}${userInfo.profilePicture}`}
//                 alt="Profile"
//                 className="user-profile-picture"
//                 />
//               ) : (
//                 <div className="default-avatar">U</div>
//               )}
//             </button>
//             <ul className="setting-menu">
//               <li>
//                 <span>
//                   <FontAwesomeIcon icon={faUser} />
//                 </span>
//                 <span>{userInfo?.username}</span>
//               </li>
//               <hr />
//               {menuItems.map((item) => (
//                 <li
//                   key={item.key}
//                   onClick={() => handleNavigation(item.key)}
//                   style={{ color: "#ef4444" }}
//                 >
//                   <span>
//                     <FontAwesomeIcon icon={item.icon} />
//                   </span>
//                   <span>{item.label}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from "react";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { SERVER_URL } from "../../config";

const menuItems = [
  { label: "Toggle Dark Mode", icon: faMoon, key: "toggle-dark-mode" },
  { label: "Logout", icon: faSignOutAlt, key: "logout" },
];

const Navbar = ({ onMenuChange, selectedMenu, setSelectedMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyLogo, setCompanyLogo] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const userInfo = useSelector((state) => state.auth.userInfo);

  // Apply theme on load and whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}auth-cmp-reg/`);
        if (response.data.context && response.data.context.length > 0) {
          const logoPath = response.data.context[0].logo.replace(/\\/g, "/");
          setCompanyLogo(logoPath);
        }
      } catch (error) {
        console.error("Error fetching company logo", error);
      }
    };
    fetchCompanyLogo();
  }, []);

  const handleNavigation = (key) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "toggle-dark-mode") {
      setIsDarkMode((prev) => !prev);
    }
    setSelectedMenu(key);
    onMenuChange(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <h2 className="navbar-selected">{selectedMenu}</h2>

        <div className="navbar-links">
          <div className="dropdown">
            <button className="setting-toggle">
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
            <ul className="setting-menu">
              <li>
                <span>
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <span>{userInfo?.username}</span>
              </li>
              <hr />
              {/* {menuItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => handleNavigation(item.key)}
                  style={{
                    color: item.key === "logout" ? "#ef4444" : "inherit",
                  }}
                >
                  <span>
                    <FontAwesomeIcon
                      icon={
                        item.key === "toggle-dark-mode"
                          ? isDarkMode
                            ? faSun
                            : faMoon
                          : item.icon
                      }
                    />
                  </span>
                  <span>
                    {item.key === "toggle-dark-mode"
                      ? isDarkMode
                        ? "Light Mode"
                        : "Dark Mode"
                      : item.label}
                  </span>
                </li>
              ))} */}
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => {
                    if (item.key === "toggle-dark-mode") {
                      setIsDarkMode((prev) => !prev); // ✅ Toggle dark mode here
                    } else if (item.key === "logout") {
                      handleNavigation("logout"); // ✅ Logout and navigate
                    } else {
                      handleNavigation(item.key); // ✅ Navigate for other items
                    }
                  }}
                  style={{
                    color: item.key === "logout" ? "#ef4444" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  <span>
                    <FontAwesomeIcon
                      icon={
                        item.key === "toggle-dark-mode"
                          ? isDarkMode
                            ? faSun
                            : faMoon
                          : item.icon
                      }
                    />
                  </span>
                  <span>
                    {item.key === "toggle-dark-mode"
                      ? isDarkMode
                        ? "Light Mode"
                        : "Dark Mode"
                      : item.label}
                  </span>
                </li>
              ))}

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
