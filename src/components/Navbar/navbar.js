import React, { useEffect, useState } from 'react';
import './navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ selectedMenu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [companyLogo, setCompanyLogo] = useState(null);

    // Fetch user information from Redux store
    const userInfo = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        const fetchCompanyLogo = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/company');
                if (response.data.length > 0) {
                    // Get the logo path from the first company
                    const logoPath = response.data[0].logo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
                    setCompanyLogo(logoPath);
                }
            } catch (error) {
                console.error('Error fetching company logo:', error);
            }
        };

        fetchCompanyLogo();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="navbar">
          <h2 className="navbar-selected">{selectedMenu}</h2>
          <div className="company-logo-wrapper">
          {/* Display Company Logo in the middle */}
          {companyLogo && (
              <img 
              src={`http://localhost:5000/${companyLogo}`} // Corrected logo path
              alt="Company Logo"
              className="navbar-company-logo"
              />
            )}
            </div>
      
          <div className="navbar-links">
            <span className="navbar-email">{userInfo?.username}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>
      );
};

export default Navbar;
