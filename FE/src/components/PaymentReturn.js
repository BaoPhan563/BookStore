import axios from "../axiosConfig";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getGoogleToken, getToken } from "./Login/app/static";
import { AiOutlineCheck, AiOutlineClose, AiOutlineHome, AiOutlineHistory } from "react-icons/ai";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const token = getToken() || getGoogleToken();
    axios
      .get(`/paymentReturn/vnpay_return${location.search}`)
      .then((response) => {
        setResult(response.data);
        setLoading(false);
        if (response.data.success) {
          // Clear cart on successful VNPay checkout
          axios
            .delete(`/cart/deleteCart`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .catch((error) => {
              console.error("Lỗi khi xóa giỏ hàng:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching payment result:", error);
        setResult({
          success: false,
          message: "Không thể xác minh kết quả thanh toán từ VNPay",
        });
        setLoading(false);
      });
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Đang đối soát kết quả giao dịch VNPay...</p>
        </div>
      </div>
    );
  }

  const isSuccess = result?.success;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Status Icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs ring-8 ${
            isSuccess
              ? "bg-emerald-100 text-emerald-600 ring-emerald-50"
              : "bg-red-100 text-red-600 ring-red-50"
          }`}
        >
          {isSuccess ? (
            <AiOutlineCheck className="w-10 h-10 stroke-[3]" />
          ) : (
            <AiOutlineClose className="w-10 h-10 stroke-[2.5]" />
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mb-2">
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>
        
        <p className="text-sm text-slate-500 mb-6">
          {result?.message || (isSuccess ? "Giao dịch đã được ghi nhận." : "Đã có lỗi xảy ra.")}
        </p>

        {/* Transaction Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-700 mb-8 border border-slate-100 space-y-2 text-left">
          {result?.data?.transactionNo && (
            <div className="flex justify-between">
              <span className="text-slate-400">Mã giao dịch:</span>
              <span className="font-bold text-slate-800">{result.data.transactionNo}</span>
            </div>
          )}
          {result?.data?.amount && (
            <div className="flex justify-between">
              <span className="text-slate-400">Số tiền:</span>
              <span className="font-bold text-orange-600">
                {(Number(result.data.amount) / 100).toLocaleString("vi-VN")}₫
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Cổng thanh toán:</span>
            <span className="font-semibold text-slate-800">VNPay Sandbox</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isSuccess ? (
            <Link
              to="/transaction"
              className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <AiOutlineHistory className="w-4 h-4" />
              <span>Xem lịch sử đơn hàng</span>
            </Link>
          ) : (
            <Link
              to="/payment"
              className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Thử thanh toán lại</span>
            </Link>
          )}

          <Link
            to="/"
            className="w-full py-3 px-5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-2"
          >
            <AiOutlineHome className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentReturn;
