import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './companyPage.css';
import { SERVER_URL } from '../../config';

const Information = () => {
    const [companyName, setCompanyName] = useState('');
    const [employees, setEmployees] = useState('');
    const [logo, setLogo] = useState(null);
    const [description, setDescription] = useState('');
    const [industry, setIndustry] = useState('');
    const navigate = useNavigate();

    const handleLogoUpload = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (companyName && employees && description && industry && logo) {
            
            const formData = {
                'companyName': companyName,
                'employees': employees,
                'logo': logo,
                'industry': industry,
                'description': description, 
            }

            try {
                const response = await axios.post(`${SERVER_URL}auth-cmp-reg/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Navigate to dashboard or another page after successful form submission
                navigate('/Signup');
            } catch (error) {
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="company-container">
            <div className="company-card">
                <div className="company-header">
                    <h2>Enter Your Company Information</h2>
                    <p>Please provide the details of your company</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            placeholder="Enter company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Number of Employees</label>
                        <input
                            type="number"
                            placeholder="Enter number of employees"
                            value={employees}
                            onChange={(e) => setEmployees(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Company Logo</label>
                        <input type="file" onChange={handleLogoUpload} required />
                    </div>
                    <div className="input-group">
                        <label>Industry</label>
                        <input
                            type="text"
                            placeholder="Enter industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Company Description</label>
                        <textarea
                            placeholder="Enter a brief description of the company"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="company-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Information;
