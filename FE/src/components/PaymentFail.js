import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineHome, AiOutlineShoppingCart } from 'react-icons/ai';

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs ring-8 ring-red-50">
          <AiOutlineClose className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mb-2">
          Thanh toán không thành công
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý thanh toán. Vui lòng kiểm tra lại tài khoản hoặc thử phương thức khác.
        </p>

        <div className="space-y-3">
          <Link
            to="/cart"
            className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <AiOutlineShoppingCart className="w-4 h-4" />
            <span>Thử lại với giỏ hàng</span>
          </Link>

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
}
