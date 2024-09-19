import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/authSlice';
import './login.css'; // Import the CSS file
import Logo from '../../assets/faceVisionLogo.png';
import Google from '../../assets/google.png';
import Facebook from '../../assets/facebook.png';
import X from '../../assets/x.png';
import axios from 'axios';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && password) {
            try {
                // Send a POST request to the login endpoint
                await axios.post('http://localhost:5000/api/login', { email, password });
                dispatch(login({ email }));
                // Navigate to the company information page
                navigate('/companyInformation');
            } catch (error) {
                // Log error and show appropriate message to user
                console.error('Error in login:', error.response?.data?.message || error.message);
                alert('Login failed. Please check your email and password.');
            }
        } else {
            alert('Please enter both email and password.');
        }
    };
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={Logo} alt='faceVision' />
                    <h2>Welcome to 360 FaceVision</h2>
                    <p>Please enter your details to sign in</p>
                </div>
                <div className="social-buttons">
                    <button className="social-button google"><img src={Google} alt=' google' /></button>
                    <button className="social-button apple"><img src={Facebook} alt=' facebook' /></button>
                    <button className="social-button facebook"><img src={X} alt=' x' /></button>
                </div>
                <div className="divider">
                    <span>or</span>
                </div>
                <form onSubmit={handleSubmit}>
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
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" />
                            Remember for 30 days
                        </label>
                        <a href="/" className="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" className="login-button">Sign in</button>
                </form>
                <div className="signup-link">
                    Don't have an account? <a href="/">Create account</a>
                </div>
            </div>
        </div>
    );
};
export default Login;