import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p className="text-lg mb-4">You do not have permission to access this page.</p>
                <a href="/" className="text-blue-500 hover:underline">
                    Go to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
