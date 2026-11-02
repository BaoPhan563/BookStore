import React, { useEffect, useState } from 'react';
import { getToken, getGoogleToken } from '../Login/app/static';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
  AiOutlineEdit,
  AiOutlineLock,
  AiOutlineArrowLeft,
  AiOutlineSave,
  AiOutlineClose,
} from 'react-icons/ai';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = getToken() || googleToken;
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setFormData({
        fullname: response.data.fullname || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!formData.fullname.trim()) {
      toast.warning('Họ và tên không được để trống.');
      return;
    }
    const phonePattern = /^0\d{9,10}$/;
    if (formData.phone && !phonePattern.test(formData.phone.trim())) {
      toast.warning('Số điện thoại không hợp lệ (yêu cầu 10 số, bắt đầu bằng số 0).');
      return;
    }

    try {
      const token = getToken() || googleToken;
      await axios.post(
        '/users/editProfile',
        {
          fullname: formData.fullname.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Cập nhật thông tin hồ sơ thành công!');
      setIsEditing(false);
      fetchUserProfile();
    } catch (err) {
      console.error('Error updating user profile:', err);
      if (err.response?.status === 401) {
        toast.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else {
        toast.error(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại sau!');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50/60">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayName = user?.fullname || user?.username || 'Khách hàng';

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 lg:py-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 px-8 py-8 text-white relative">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-2xl font-bold shadow-md ring-4 ring-white/10">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif">{displayName}</h1>
                <p className="text-xs text-slate-300">@{user?.username || 'user'}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {isEditing ? (
              /* Edit Mode */
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Địa chỉ giao hàng mặc định
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <AiOutlineClose className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                  >
                    <AiOutlineSave className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Họ và tên
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {user?.fullname || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Email
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {user?.email || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Số điện thoại
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {user?.phone || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Vai trò
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {user?.admin ? 'Quản trị viên (Admin)' : 'Khách hàng'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Địa chỉ nhận hàng mặc định
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {user?.address || 'Chưa cập nhật địa chỉ'}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleEditProfile}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all"
                  >
                    <AiOutlineEdit className="w-4 h-4" />
                    <span>Cập nhật hồ sơ</span>
                  </button>

                  {!googleToken && (
                    <button
                      onClick={() => navigate('/change-password')}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all"
                    >
                      <AiOutlineLock className="w-4 h-4" />
                      <span>Đổi mật khẩu</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
