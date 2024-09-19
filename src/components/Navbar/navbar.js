import React from 'react';
import './navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Logout icon

const Navbar = ({ selectedMenu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Fetch user information from Redux store
    const userInfo = useSelector((state) => state.auth.userInfo);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="navbar">
            <h2 className="navbar-selected">{selectedMenu}</h2>
            <div className="navbar-links">
                <span className="navbar-email">{userInfo?.email}</span> 
                <button className="navbar-logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
