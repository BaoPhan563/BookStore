import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  getToken,
  removeToken,
  removeTokenFromCookie,
  getGoogleToken,
} from "./Login/app/static";
import { jwtDecode } from "jwt-decode";
import {
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlineHistory,
  AiOutlineClose,
  AiOutlineMenu,
} from "react-icons/ai";
import { BiBookBookmark } from "react-icons/bi";

const Navbar = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dataUser, setDataUser] = useState({});
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken() || getGoogleToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDataUser(decoded);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error.message);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
      fetchCartItemCount();
    }
  }, [isLoggedIn]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const fetchUserData = () => {
    const token = getToken() || getGoogleToken();
    axios
      .get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      });
  };

  const fetchCartItemCount = () => {
    const token = getToken() || getGoogleToken();
    axios
      .get(`/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCartItemCount(response.data.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };

  const handleLogout = () => {
    removeToken();
    removeTokenFromCookie();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login", { replace: true });
    window.location.reload();
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    if (onSearch) {
      onSearch("");
    }
  };

  const isAdmin = isLoggedIn && (dataUser.admin || user?.admin);
  const displayName = (user && (user.fullname || user.username)) || dataUser.email || "Tài khoản";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all duration-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <BiBookBookmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-orange-600 bg-clip-text text-transparent tracking-tight font-serif">
                FBStore
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-orange-600/80 -mt-1">
                Bookstore
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AiOutlineSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchValue}
                placeholder="Tìm sách theo tên tác phẩm, tác giả..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-slate-400"
                onChange={handleSearchChange}
              />
              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <AiOutlineClose className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                location.pathname === "/"
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                location.pathname === "/about"
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
              }`}
            >
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                location.pathname === "/contact"
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
              }`}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Action Buttons: Cart & User */}
          <div className="flex items-center space-x-3">
            
            {/* Cart Icon (Customer Only) */}
            {!isAdmin && isLoggedIn && (
              <Link
                to="/cart"
                className="relative p-2.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 rounded-full transition-all flex items-center justify-center group"
                title="Giỏ hàng"
              >
                <AiOutlineShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-full shadow-sm ring-2 ring-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Dropdown or Login */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate hidden sm:inline-block">
                    {displayName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Đăng nhập bởi</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
                    </div>

                    {isAdmin ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 font-medium transition-colors"
                        >
                          <AiOutlineDashboard className="w-4 h-4 text-orange-600" />
                          <span>Bảng điều khiển Admin</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 font-medium transition-colors"
                        >
                          <AiOutlineUser className="w-4 h-4 text-slate-400" />
                          <span>Thông tin cá nhân</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 font-medium transition-colors"
                        >
                          <AiOutlineUser className="w-4 h-4 text-slate-400" />
                          <span>Thông tin cá nhân</span>
                        </Link>
                        <Link
                          to="/transaction"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 font-medium transition-colors"
                        >
                          <AiOutlineHistory className="w-4 h-4 text-slate-400" />
                          <span>Lịch sử đơn hàng</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
                    >
                      <AiOutlineLogout className="w-4 h-4 text-red-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 rounded-full shadow-sm hover:shadow-md hover:shadow-orange-500/20 transition-all duration-200"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <AiOutlineClose className="w-6 h-6" />
              ) : (
                <AiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 px-2 space-y-3 animate-in fade-in duration-200">
            <div className="relative w-full">
              <input
                type="text"
                value={searchValue}
                placeholder="Tìm kiếm sách..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={handleSearchChange}
              />
              <AiOutlineSearch className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            </div>
            <div className="flex flex-col space-y-1 pt-2">
              <Link
                to="/"
                className="px-3 py-2 text-base font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
              >
                Trang chủ
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 text-base font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 text-base font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
