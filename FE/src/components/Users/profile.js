import React, { useEffect, useState } from 'react';
import { getToken, getGoogleToken } from '../Login/app/static';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        address: '',
    });
    const navigate = useNavigate();
    const googleToken = getGoogleToken();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = getToken() || googleToken;
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
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
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to fetch user profile. Please try again later.');
            }
        };

        fetchUserProfile();
    }, []);

    const handleEditProfile = () => {
        setFormData({
            fullname: user.fullname,
            phone: user.phone,
            address: user.address,
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveProfile = async () => {
        try {
            const token = getToken() || googleToken;
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/editProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    phone: formData.phone,
                    address: formData.address,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError('Failed to update user profile. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    return (
        <div className="container mx-auto mt-8 h-[550px]">
            <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">Hồ sơ người dùng</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {isEditing ? (
                <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8 bg-orange-100">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Họ và tên:</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Số điện thoại:</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Địa chỉ:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            ) : user ? (
                <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8 bg-orange-100">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Họ và tên:</label>
                            <p className="text-lg text-gray-800">{user.fullname}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Email:</label>
                            <p className="text-lg text-gray-800">{user.email}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Tên người dùng:</label>
                            <p className="text-lg text-gray-800">{user.username}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Địa chỉ:</label>
                            <p className="text-lg text-gray-800">{user.address}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Số điện thoại:</label>
                            <p className="text-lg text-gray-800">{user.phone}</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleEditProfile}
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cập nhật hồ sơ
                            </button>

                            <Link
                                to="/"
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Quay lại trang chủ
                            </Link>

                            {!googleToken && (
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleChangePassword}
                                >
                                    Đổi mật khẩu
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4">Đang tải...</p>
            )}
        </div>
    );
};

export default ProfilePage;
