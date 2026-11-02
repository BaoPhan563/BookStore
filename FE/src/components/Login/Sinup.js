import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiBookBookmark } from 'react-icons/bi';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiOutlineLock, AiOutlineArrowRight } from 'react-icons/ai';

function RegisterUser() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    const phonePattern = /^0\d{9,10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!fullname.trim() || !cleanEmail || !password || !cleanPhone || !username.trim()) {
      toast.warning('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    if (!emailPattern.test(cleanEmail)) {
      toast.warning('Định dạng email không hợp lệ (ví dụ: user@example.com).');
      return;
    }
    if (!phonePattern.test(cleanPhone)) {
      toast.warning('Số điện thoại không hợp lệ (yêu cầu 10 chữ số, bắt đầu bằng số 0).');
      return;
    }
    if (password.length < 6) {
      toast.warning('Mật khẩu bảo mật phải có tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await instance.post('/users/signup', {
        fullname: fullname.trim(),
        email: cleanEmail,
        password,
        username: username.trim(),
        phone: cleanPhone,
        address: address.trim(),
      });

      toast.success('Đăng ký tài khoản thành công! Đang chuyển đến đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      const rawErr = error.response?.data?.err?.message || error.response?.data?.err || error.response?.data?.message || '';
      const errStr = typeof rawErr === 'string' ? rawErr : JSON.stringify(rawErr);

      if (errStr.includes('already registered') || errStr.includes('UserExistsError') || errStr.includes('duplicate key') || errStr.includes('E11000')) {
        toast.error('Tên đăng nhập hoặc địa chỉ email này đã được sử dụng. Vui lòng thử lại!');
      } else if (rawErr && typeof rawErr === 'string') {
        toast.error(rawErr);
      } else if (!error.response) {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!');
      } else {
        toast.error('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-slate-50/60">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <BiBookBookmark className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
              FBStore
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Tạo tài khoản mới</h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng ký để nhận ưu đãi thành viên và lưu trữ lịch sử đơn hàng
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <AiOutlineUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Họ và tên *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <AiOutlineUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Nguyễn Văn An"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Địa chỉ Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <AiOutlineMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="an@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Số điện thoại *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <AiOutlinePhone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="0987654321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Địa chỉ nhận hàng mặc định
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <AiOutlineEnvironment className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mật khẩu *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <AiOutlineLock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
            <AiOutlineArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-orange-600 hover:underline">
            Đăng nhập tại đây
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
