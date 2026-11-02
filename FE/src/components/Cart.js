import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { getGoogleToken, getToken } from "../components/Login/app/static";
import CartItem from "./CartItem";
import { useNavigate, Link } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineArrowLeft,
  AiOutlineSafety,
  AiOutlineCheckCircle,
  AiOutlineUser,
} from "react-icons/ai";
import { FiTruck } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = getToken() || getGoogleToken();
      if (!token) {
        setCart([]);
        setLoading(false);
        return;
      }
      const response = await axios.get("/cart");
      if (Array.isArray(response.data)) {
        setCart(response.data);
      } else {
        setCart([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (itemId, newQuantity, newTotalPrice) => {
    const updatedCart = cart.map((item) => {
      if (item._id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          total_price: newTotalPrice,
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    const token = getToken() || getGoogleToken();
    if (!token) {
      toast.warning("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiến hành thanh toán.");
      setTimeout(() => {
        navigate("/login", {
          state: {
            from: "/cart",
            message: "Vui lòng đăng nhập để tiến hành thanh toán đơn hàng!",
          },
        });
      }, 800);
      return;
    }
    if (cart.length === 0) {
      toast.warning("Giỏ hàng của bạn đang trống. Vui lòng chọn sách vào giỏ trước!");
      return;
    }
    navigate("/payment", { state: { cart } });
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.total_price || 0), 0);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString("vi-VN");
  };

  const subtotal = calculateTotalPrice();
  const freeShippingThreshold = 250000;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="h-24 bg-white rounded-2xl border border-slate-100"></div>
          <div className="h-24 bg-white rounded-2xl border border-slate-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Giỏ hàng của bạn
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Bạn đang có <span className="font-bold text-slate-800">{cart.length}</span> đầu sách trong giỏ
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
            <span>Tiếp tục mua sách</span>
          </Link>
        </div>

        {!getToken() && !getGoogleToken() ? (
          /* Not Logged In State */
          <div className="bg-white rounded-3xl p-12 lg:p-16 text-center max-w-lg mx-auto border border-slate-200/80 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <AiOutlineUser className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Bạn chưa đăng nhập</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
              Vui lòng đăng nhập để xem các cuốn sách trong giỏ hàng và tiến hành đặt hàng dễ dàng.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 hover:from-orange-700 hover:to-amber-600 transition-all"
              >
                <span>Đăng nhập ngay</span>
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                <span>Xem danh mục sách</span>
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-12 lg:p-16 text-center max-w-lg mx-auto border border-slate-200/80 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <AiOutlineShoppingCart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Giỏ hàng đang trống</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
              Chưa có cuốn sách nào được chọn. Hãy ghé trang chủ để khám phá những cuốn sách hay nhất hôm nay!
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 hover:from-orange-700 hover:to-amber-600 transition-all"
            >
              <span>Khám phá ngay</span>
            </Link>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free shipping bar indicator */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3">
                <div className={`p-2 rounded-xl shrink-0 ${isFreeShipping ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"}`}>
                  <FiTruck className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs">
                  {isFreeShipping ? (
                    <span className="font-bold text-emerald-700">
                      Chúc mừng! Đơn hàng của bạn đã đủ điều kiện Miễn phí vận chuyển toàn quốc.
                    </span>
                  ) : (
                    <span>
                      Mua thêm{" "}
                      <strong className="text-orange-600">
                        {formatPrice(freeShippingThreshold - subtotal)}₫
                      </strong>{" "}
                      để nhận <strong className="text-slate-800">Miễn phí vận chuyển</strong>.
                    </span>
                  )}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFreeShipping ? "bg-emerald-500" : "bg-orange-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    updateCart={updateCart}
                    removeFromCart={handleRemoveFromCart}
                  />
                ))}
              </div>
            </div>

            {/* Right: Checkout Summary */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính ({cart.length} cuốn)</span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(subtotal)}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-emerald-600">
                      {isFreeShipping ? "Miễn phí" : "25.000₫"}
                    </span>
                  </div>
                  
                  <div className="border-t border-slate-100 my-3"></div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-base font-bold text-slate-900">Tổng thanh toán</span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-orange-600">
                        {formatPrice(subtotal + (isFreeShipping ? 0 : 25000))}₫
                      </span>
                      <p className="text-[11px] text-slate-400">Đã bao gồm thuế GTGT</p>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Tiến hành thanh toán</span>
                </button>

                {/* Secure Trust Badges */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-4 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <AiOutlineSafety className="w-4 h-4 text-emerald-500" />
                    <span>Bảo mật 100%</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <AiOutlineCheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Chính hãng</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
