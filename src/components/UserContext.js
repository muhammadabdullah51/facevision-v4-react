import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch the logged-in user's data, for example, from an API
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user'); // API endpoint to get the current user data
                setUser(response.data); // Assume response contains user with accessibleItems
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
