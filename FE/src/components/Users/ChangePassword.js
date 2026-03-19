import React, { useState } from 'react';
import { getToken, removeToken } from '../Login/app/static';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to change password');
            }
            setSuccess(true);
            removeToken();
            setTimeout(() => {
                navigate('/login');
                window.location.reload();
            }, 4000);
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Failed to change password. Please try again.');
        }
    };

    return (
        <div className="container mx-auto mt-8 mb-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Đổi mật khẩu</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && (
                <p className="text-green-500 mb-4 text-center">Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập lại...</p>
            )}
            <form
                className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6"
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Mật khẩu hiện tại:</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Mật khẩu mới:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                        required
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Đổi mật khẩu
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
