import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getGoogleToken } from './Login/app/static';

const PrivateRoute = ({ element, adminOnly, googleBlock }) => {
    const token = getToken() || getGoogleToken();
    const googleToken = getGoogleToken();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = getToken() || googleToken;
                const response = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const userData = await response.json();
                setUserData(userData);
                console.log('User profile:', userData);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [googleToken]);

    if (isLoading) {
        return <div>Loading...</div>; // Hoặc một spinner hay một loading component khác
    }

    if (!token) {
        console.log('No token found, redirecting to /login');
        return <Navigate to="/login" />;
    }

    if (adminOnly) {
        if (!userData) {
            console.log('No user info found, redirecting to /not-found');
            return <Navigate to="/not-found" />;
        }
        if (!userData.admin) {
            console.log('User is not admin, redirecting to /not-found');
            return <Navigate to="/not-found" />;
        }
    }

    if (googleBlock && googleToken) {
        console.log('Google token found and googleBlock is true, redirecting to /profile');
        return <Navigate to="/profile" />;
    }

    return element;
};

export default PrivateRoute;
