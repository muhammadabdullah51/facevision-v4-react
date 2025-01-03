import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/authSlice';
import axios from 'axios';
import Logo from '../../assets/faceVisionLogo.png';
import Google from '../../assets/google.png';
import Facebook from '../../assets/facebook.png';
import X from '../../assets/x.png';
import {SERVER_URL} from "../../config"

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [companyExists, setCompanyExists] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

     // Check if company info exists
     useEffect(() => {
        const checkCompanyInfo = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/auth-cmp-reg/`);
                setCompanyExists(response.data.companyExists);
            } catch (error) {
                console.error('Error checking company info:', error);
            }
        };
        checkCompanyInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (firstName && lastName && username && email && password && phoneNumber && profilePicture) {
            try {
                const formData = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'username': username,
                    'email': email,
                    'password': password,
                    'phoneNumber': phoneNumber,
                    'profilePicture': profilePicture,
                }
                // Send a POST request to the register endpoint with form data
                await axios.post(`${SERVER_URL}auth-rg/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                dispatch(login({ email }));
                navigate('/');
            } catch (error) {
                console.error('Error in registration:', error.response?.data?.message || error.message);
                alert('Registration failed.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={Logo} alt='faceVision' />
                    <h2>Welcome to 360 FaceVision</h2>
                    <p>Please enter your details to Sign Up</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="number"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Sign Up</button>
                </form>
                <div className="signup-link">
                    Already have an account? <a href="/">Sign In</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
