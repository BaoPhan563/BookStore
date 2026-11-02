import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const cleanEmail = email.trim();
        if (!cleanEmail) {
            toast.warning('Vui lòng nhập địa chỉ email của bạn.');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/users/forgotPassword', { email: cleanEmail });
            toast.success('Mã xác thực OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư!');
            setTimeout(() => {
                setStep(2);
            }, 1200);
        } catch (error) {
            console.error('Error sending email', error);
            if (error.response?.status === 404) {
                toast.error('Địa chỉ email này chưa được đăng ký trong hệ thống.');
            } else {
                toast.error(error.response?.data?.message || 'Không thể gửi mã OTP lúc này. Vui lòng thử lại sau!');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            toast.warning('Vui lòng nhập mã OTP đã nhận.');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            toast.warning('Mật khẩu mới phải có tối thiểu 6 ký tự.');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/users/resetPassword', {
                email: email.trim(),
                otp: otp.trim(),
                newPassword,
            });

            setEmail('');
            setOtp('');
            setNewPassword('');
            toast.success('Đặt lại mật khẩu thành công! Đang chuyển hướng về đăng nhập...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error('Error resetting password', error);
            toast.error('Mã OTP không chính xác hoặc đã hết hạn hiệu lực.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    placeholder='Nhập email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                            >
                                Gửi OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center">Đặt lại mật khẩu</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">OTP:</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                            >
                                Đặt lại mật khẩu
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
