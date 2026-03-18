import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from './Login/app/static';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const deleteCart = async () => {
            try {
                const token = getToken(); // Assuming you have a function to get the token
                let response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/deleteCart`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error('Error deleting cart:', error);
            }
        };

        deleteCart();
    }, []);

    const goHome = () => {
        navigate('/');
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-8 flex justify-center items-center">
        <div className="max-w-md bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                    <img className="w-16 h-16 mr-4" src="https://static.vecteezy.com/system/resources/previews/010/152/436/original/tick-check-mark-icon-sign-symbol-design-free-png.png" alt="Tick icon" />
                    <p className="text-2xl font-semibold">Checkout Successful</p>
                </div>
                <p className="text-lg mb-4">Thanks for using BestBook!</p>
                <button onClick={goHome} className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Back to Home
                </button>
            </div>
        </div>
    </div>
    
    );
}

