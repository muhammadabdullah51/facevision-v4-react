// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import './companyPage.css';
// import axios from 'axios';

// const Information = () => {
//     const userInfo = useSelector((state) => state.auth.userInfo);
//     const navigate = useNavigate();


//     const [companyName, setCompanyName] = useState('');
//     const [employees, setEmployees] = useState('');
//     const [logo, setLogo] = useState(null);
//     const [description, setDescription] = useState('');
//     const [industry, setIndustry] = useState('');
//     const [companyId, setCompanyId] = useState(null); // For updates and deletion

//     useEffect(() => {
//         // If you want to fetch and edit an existing company
//         const fetchCompany = async () => {
//             try {
//                 const response = await axios.get(`/api/company/${userInfo.companyId}`);
//                 const { companyName, employees, description, industry } = response.data;
//                 setCompanyName(companyName);
//                 setEmployees(employees);
//                 setDescription(description);
//                 setIndustry(industry);
//                 setCompanyId(response.data._id); // Set companyId for updating or deleting
//             } catch (error) {
//                 console.log("Error fetching company data", error);
//             }
//         };

//         // Uncomment if you want to pre-fill with existing company data
//         // fetchCompany();
//     }, [userInfo]);

//     const handleLogoUpload = (e) => {
//         setLogo(e.target.files[0]); 
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//     const formData = new FormData();
//     formData.append('companyName', companyName);
//     formData.append('employees', employees);
//     formData.append('logo', logo); // Optional
//     formData.append('description', description);
//     formData.append('industry', industry);
//     formData.append('action', companyId ? 'update' : 'create'); // Create if no companyId, otherwise update
//     if (companyId) {
//         formData.append('companyId', companyId);
//     }

//     try {
//         const response = await axios.post('http://localhost:5000/api/company', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         console.log(response.data);

//         // Navigate to login page after successful form submission
//         navigate('/');  
//     } catch (error) {
//         console.error('Error submitting company data', error);
//     }
//     };

//     const handleDelete = async () => {
//         try {
//             const response = await axios.post('/api/company', {
//                 action: 'delete',
//                 companyId,
//             });
//             console.log(response.data);
//             // Redirect or perform an action after deletion
//             navigate('/dashboard');
//         } catch (error) {
//             console.error('Error deleting company', error);
//         }
//     };

//     return (
//         <div className="company-container">
//             <div className="company-card">
//                 <div className="company-header">
//                     <h2>{companyId ? 'Edit Your Company Information' : 'Enter Your Company Information'}</h2>
//                     <p>Please provide the details of your company</p>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="input-group">
//                         <label>Company Name</label>
//                         <input
//                             type="text"
//                             placeholder="Enter company name"
//                             value={companyName}
//                             onChange={(e) => setCompanyName(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label>Number of Employees</label>
//                         <input
//                             type="number"
//                             placeholder="Enter number of employees"
//                             value={employees}
//                             onChange={(e) => setEmployees(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label>Company Logo</label>
//                         <input type="file" onChange={handleLogoUpload} />
//                     </div>
//                     <div className="input-group">
//                         <label>Industry</label>
//                         <input
//                             type="text"
//                             placeholder="Enter industry"
//                             value={industry}
//                             onChange={(e) => setIndustry(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label>Company Description</label>
//                         <textarea
//                             placeholder="Enter a brief description of the company"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <button type="submit" className="company-button">
//                         {companyId ? 'Update' : 'Submit'}
//                     </button>
//                 </form>
//                 {companyId && (
//                     <button onClick={handleDelete} className="company-delete-button">
//                         Delete Company
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Information;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './companyPage.css';

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

        // Ensure all fields are filled
        if (companyName && employees && description && industry && logo) {
            const formData = new FormData();
            formData.append('companyName', companyName);
            formData.append('employees', employees);
            formData.append('logo', logo); // Optional file upload
            formData.append('description', description);
            formData.append('industry', industry);

            try {
                const response = await axios.post('http://localhost:5000/api/company', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response.data);
                // Navigate to dashboard or another page after successful form submission
                navigate('/');
            } catch (error) {
                console.error('Error submitting company data', error);
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
