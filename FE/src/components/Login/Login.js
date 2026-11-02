import React, { useState, useEffect } from 'react';
import { getToken, setToken, setUserInfo } from './app/static';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import instance from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiBookBookmark } from 'react-icons/bi';
import { AiOutlineLock, AiOutlineUser, AiOutlineArrowRight } from 'react-icons/ai';

function LoginUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.info(location.state.message);
    }
  }, [location.state]);

  const handleLoginUser = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.warning('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await instance.post(`/users/login`, {
        username: username.trim(),
        password,
      });

      if (res.data) {
        setToken(res.data);
        setUserInfo(res.data);
        toast.success('Đăng nhập thành công! Đang chuyển hướng...');
        const redirectPath = location.state?.from || '/';
        setTimeout(() => {
          navigate(redirectPath);
          window.location.reload();
        }, 500);
      } else {
        throw new Error('Token not found in response.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.status === 401) {
        toast.error('Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (!error.response) {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!');
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const rawUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const apiUrl = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
    window.open(`${apiUrl}/users/google`, '_self');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-50/60">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg">
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
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Đăng nhập tài khoản</h1>
          <p className="text-xs text-slate-500 mt-1">
            Chào mừng bạn quay trở lại với thế giới sách!
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AiOutlineUser className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập của bạn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mật khẩu
              </label>
              <Link
                to="/resetpassword"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AiOutlineLock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
            <AiOutlineArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative px-3 bg-white text-xs text-slate-400 uppercase font-semibold">
            Hoặc tiếp tục với
          </span>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2.5 transition-all shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Đăng nhập qua Google</span>
        </button>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="font-bold text-orange-600 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginUser;
