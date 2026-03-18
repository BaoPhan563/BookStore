import React, { useEffect } from 'react';
import { getGoogleToken, getToken } from './Login/app/static';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PaymentFail() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken() || getGoogleToken();
        // Fetch user profile data when component mounts
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/api/payment/cancel`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                {
                    withCredentials: true, // Ensure credentials are sent
                },
            )
            .then((response) => {})
            .catch((error) => {
                console.error('Error fetching fail status:', error);
            });
    }, []);

    const goHome = () => {
        navigate('/');
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-8 flex justify-center items-center">
        <div className="max-w-md bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                    <img className="w-16 h-16 mr-4" src="https://th.bing.com/th/id/OIP.phTFtqlOwNeT0uZBDgP54QHaHa?w=880&h=880&rs=1&pid=ImgDetMain" alt="Failure icon" />
                    <p className="text-2xl font-semibold">Checkout Fail</p>
                </div>
                <p className="text-lg mb-4">Please checkout again!</p>
                <button onClick={goHome} className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Back to Home
                </button>
            </div>
        </div>
    </div>
    
    );
}
