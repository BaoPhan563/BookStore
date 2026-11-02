import React, { useEffect } from 'react';
import axios from '../axiosConfig';
import { getToken, getGoogleToken } from './Login/app/static';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineHome, AiOutlineHistory } from 'react-icons/ai';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const deleteCart = async () => {
      try {
        const token = getToken() || getGoogleToken();
        if (token) {
          await axios.delete('/cart/deleteCart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    };

    deleteCart();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs ring-8 ring-emerald-50">
          <AiOutlineCheck className="w-10 h-10 stroke-[3]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mb-2">
          Thanh toán thành công!
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Cảm ơn bạn đã tin tưởng mua sắm tại FBStore. Đơn hàng của bạn đã được tiếp nhận và đang được chuẩn bị để giao sớm nhất.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 mb-8 border border-slate-100 space-y-1">
          <p className="font-semibold text-slate-800">Trạng thái: Đã thanh toán thành công</p>
          <p>Mã hóa đơn và cập nhật vận chuyển sẽ được gửi qua email hoặc kiểm tra trong lịch sử giao dịch.</p>
        </div>

        <div className="space-y-3">
          <Link
            to="/transaction"
            className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <AiOutlineHistory className="w-4 h-4" />
            <span>Xem lịch sử đơn hàng</span>
          </Link>

          <Link
            to="/"
            className="w-full py-3 px-5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-2"
          >
            <AiOutlineHome className="w-4 h-4" />
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
