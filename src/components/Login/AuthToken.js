import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../redux/authSlice'; // Import the correct action
import './login.css'; 
import Logo from '../../assets/faceVisionLogo.png';

import axios from 'axios';
import { SERVER_URL } from '../../config';

const AuthToken = () => {
    const [companyId, setCompanyId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for UX
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (companyId && accessToken) {
            setLoading(true); // Start loading
            const payLoad = {
                cmpId: companyId,
                accessToken: accessToken,
            }
            console.log(payLoad);
            try {
                const response = await axios.post(`${SERVER_URL}auth-vrf/`, payLoad);
                if (response.data.status==200) {
                    dispatch(
                        setAuthToken({
                            cmpId: companyId,
                            accessToken: accessToken,
                        })
                    // Dispatch the setAuthToken action with company_id and accessToken
                    );

                    // Optionally store the authToken locally
                    localStorage.setItem('authToken', JSON.stringify( payLoad ));

                    // // Navigate to the next page
                    // navigate('/dashboard');
                } else {
                    alert(response.data.msg || 'Failed to authenticate. Please try again.');
                }
            } catch (error) {
                console.error('Authentication error:', error.response?.data?.message || error.message);
                alert(error.response?.data?.message || 'Authentication failed. Please try again.');
            } finally {
                setLoading(false); // End loading
            }
        } else {
            alert('Please enter both Company ID and Access Token.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={Logo} alt="FaceVision Logo" />
                    <h2>Welcome to 360 FaceVision</h2>
                    <p>Please enter the Authotization Key to authenticate</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="company_id">Company ID</label>
                        <input
                            id="company_id"
                            type="text"
                            placeholder="Enter The Company ID"
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="access_token">Access Token</label>
                        <input
                            id="access_token"
                            type="text"
                            placeholder="Enter The Access Token"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                {/* <div className="signup-link">
                  Already entered the access token? <a href="/">Login</a>
              </div> */}
            </div>
        </div>
    );
};

export default AuthToken;
