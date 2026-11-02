import axios from "../axiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getGoogleToken, getToken } from "./Login/app/static";
import {
  AiOutlineSafety,
  AiOutlineArrowLeft,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineEnvironment,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FiCreditCard, FiLock } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const [dataUser, setDataUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
      return;
    }

    const token = getToken() || getGoogleToken();
    if (!token) {
      toast.warning("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiến hành thanh toán.");
      navigate("/login", {
        state: {
          from: "/payment",
          message: "Vui lòng đăng nhập để tiếp tục thanh toán đơn hàng!",
        },
      });
      return;
    }

    axios
      .get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDataUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, [cart, navigate]);

  const handlePayment = async () => {
    const token = getToken() || getGoogleToken();
    if (!token) {
      toast.warning("Bạn chưa đăng nhập! Vui lòng đăng nhập để thanh toán đơn hàng.");
      navigate("/login", {
        state: {
          from: "/payment",
          message: "Vui lòng đăng nhập để tiếp tục thanh toán đơn hàng!",
        },
      });
      return;
    }

    if (cart.length === 0) {
      toast.warning("Không có sản phẩm nào trong đơn hàng để thanh toán!");
      return;
    }

    if (!dataUser?.phone || !dataUser?.address) {
      toast.warning("Vui lòng cập nhật đầy đủ số điện thoại và địa chỉ nhận hàng trong mục Hồ sơ trước khi thanh toán!");
      return;
    }

    const orderDetails = cart.map((item) => ({
      book: item.book._id,
      order_quantity: item.quantity,
      order_price: item.price,
    }));

    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = Math.round(
      cart.reduce((total, item) => total + item.total_price, 0)
    );

    setLoading(true);

    if (paymentMethod === "vnpay") {
      try {
        const response = await axios.post(`/payment/create_payment_url`, {
          quantity: totalQuantity,
          order_details: orderDetails,
          amount: totalPrice,
          orderDescription: "Thanh toán đơn hàng sách tại FBStore",
          orderType: "other",
          language: "vn",
          bankCode: "",
        });

        if (response.data && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          toast.error("Không thể khởi tạo liên kết thanh toán VNPay. Vui lòng thử lại!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Lỗi VNPay:", error);
        if (error.response?.status === 401) {
          toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        } else {
          toast.error(error.response?.data?.message || "Đã xảy ra sự cố khi kết nối cổng VNPay. Vui lòng thử lại!");
        }
        setLoading(false);
      }
    } else {
      // PayPal
      try {
        const response = await axios.post(`/payment/create_payment_paypal`, {
          quantity: totalQuantity,
          amount: totalPrice,
          order_details: orderDetails,
        });

        if (response.data) {
          window.location.href = response.data;
        } else {
          toast.error("Không thể khởi tạo liên kết thanh toán PayPal. Vui lòng thử lại!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Lỗi PayPal:", error);
        if (error.response?.status === 401) {
          toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        } else {
          toast.error(error.response?.data?.message || "Đã xảy ra sự cố khi kết nối cổng PayPal. Vui lòng thử lại!");
        }
        setLoading(false);
      }
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.total_price || 0), 0);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString("vi-VN");
  };

  const subtotal = calculateTotalPrice();
  const shippingFee = subtotal >= 250000 ? 0 : 25000;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 lg:py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        {/* Header & Back */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Thanh toán đơn hàng
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng kiểm tra thông tin giao hàng và xác nhận đơn hàng
            </p>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
            <span>Quay lại giỏ hàng</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer Details & Order items */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Information Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <AiOutlineEnvironment className="w-4 h-4 text-orange-600" />
                  <span>Địa chỉ nhận hàng</span>
                </h3>
                <Link to="/profile" className="text-xs font-semibold text-orange-600 hover:underline">
                  Chỉnh sửa
                </Link>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center space-x-2 text-slate-700">
                  <AiOutlineUser className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-900">{dataUser.fullname || "Chưa cập nhật tên"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <AiOutlinePhone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{dataUser.phone || "Chưa cập nhật số điện thoại"}</span>
                </div>
                <div className="flex items-start space-x-2 text-slate-700">
                  <AiOutlineEnvironment className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{dataUser.address || "Chưa cập nhật địa chỉ giao hàng"}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center space-x-2">
                <FiCreditCard className="w-4 h-4 text-orange-600" />
                <span>Phương thức thanh toán</span>
              </h3>

              <div className="space-y-3">
                {/* VNPay Option */}
                <label
                  onClick={() => setPaymentMethod("vnpay")}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "vnpay"
                      ? "border-orange-500 bg-orange-50/30"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <p className="font-bold text-sm text-slate-800">
                        Thanh toán qua VNPay
                      </p>
                      <p className="text-xs text-slate-500">
                        Quét mã VNPAY-QR, Thẻ ATM nội địa, Thẻ quốc tế Visa/Master
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-md uppercase">
                    Khuyên dùng
                  </span>
                </label>

                {/* PayPal Option */}
                <label
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "paypal"
                      ? "border-orange-500 bg-orange-50/30"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <p className="font-bold text-sm text-slate-800">
                        Thanh toán qua PayPal
                      </p>
                      <p className="text-xs text-slate-500">
                        Thanh toán quốc tế an toàn bằng tài khoản PayPal
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Selected Products List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
                Sản phẩm trong đơn hàng ({cart.length})
              </h3>

              <div className="divide-y divide-slate-100">
                {cart.map((item) => {
                  const itemImg =
                    item.book?.imageurls && item.book.imageurls.length > 0
                      ? item.book.imageurls.find((img) => img.defaultImg)?.imageUrl ||
                        item.book.imageurls[0].imageUrl
                      : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

                  return (
                    <div key={item.book._id || item._id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={itemImg}
                          alt={item.book.title}
                          className="w-12 h-16 object-cover rounded-lg bg-slate-100 border border-slate-200/60 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1 font-serif">
                            {item.book.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Số lượng: {item.quantity} x {formatPrice(item.price)}₫
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">
                        {formatPrice(item.total_price)}₫
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Order Confirmation */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
                Chi tiết thanh toán
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Tiền sách</span>
                  <span className="font-semibold text-slate-800">
                    {formatPrice(subtotal)}₫
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-emerald-600">
                    {shippingFee === 0 ? "Miễn phí" : `${formatPrice(shippingFee)}₫`}
                  </span>
                </div>

                <div className="border-t border-slate-100 my-3"></div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-base font-bold text-slate-900">Tổng thanh toán</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-orange-600">
                      {formatPrice(grandTotal)}₫
                    </span>
                    <p className="text-[11px] text-slate-400">Đã bao gồm VAT</p>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <FiLock className="w-4 h-4" />
                <span>
                  {loading
                    ? "Đang chuyển đến cổng thanh toán..."
                    : `Xác nhận & Thanh toán (${formatPrice(grandTotal)}₫)`}
                </span>
              </button>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs text-slate-400">
                <AiOutlineSafety className="w-4 h-4 text-emerald-500" />
                <span>Giao dịch bảo mật bằng mã hóa 256-bit SSL</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
