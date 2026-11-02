import React, { useState } from 'react';
import axios from '../axiosConfig';
import { getGoogleToken, getToken } from '../components/Login/app/static';
import { GoTrash } from 'react-icons/go';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CartItem({ item, updateCart, removeFromCart }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [totalPrice, setTotalPrice] = useState(item.total_price);
  const [updating, setUpdating] = useState(false);

  const updateQuantity = async (action) => {
    if (updating) return;
    setUpdating(true);
    try {
      let response;
      if (action === 'increase') {
        response = await axios.put(
          `/cart/increase/${item._id}/product/${item.book._id}`
        );
      } else {
        response = await axios.put(
          `/cart/decrease/${item._id}/product/${item.book._id}`
        );
      }
      setQuantity(response.data.quantity);
      setTotalPrice(response.data.total_price);
      updateCart(item._id, response.data.quantity, response.data.total_price);
    } catch (err) {
      console.error('Error updating quantity:', err);
      if (err.response?.status === 401) {
        toast.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Không thể cập nhật số lượng sách. Vui lòng thử lại!');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await axios.delete(`/cart/${item._id}/product/${item.book._id}`);
      removeFromCart(item._id);
      toast.success(`Đã xóa "${item.book?.title || 'sách'}" khỏi giỏ hàng.`);
    } catch (err) {
      console.error('Error removing from cart:', err);
      if (err.response?.status === 401) {
        toast.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else {
        toast.error('Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại!');
      }
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return Number(price).toLocaleString('vi-VN');
  };

  const bookImage =
    item.book?.imageurls && item.book.imageurls.length > 0
      ? item.book.imageurls.find((img) => img.defaultImg)?.imageUrl ||
        item.book.imageurls[0].imageUrl
      : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* Product Image & Info */}
      <div className="flex items-center space-x-4 w-full sm:w-1/2">
        <Link
          to={`/book/${item.book._id}`}
          className="w-20 h-24 sm:w-22 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-2xs group"
        >
          <img
            src={bookImage}
            alt={item.book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';
            }}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            {item.book.author || 'Tác giả'}
          </p>
          <Link
            to={`/book/${item.book._id}`}
            className="text-sm font-bold text-slate-800 hover:text-orange-600 font-serif line-clamp-2 leading-snug transition-colors"
          >
            {item.book.title}
          </Link>
          <p className="text-xs text-orange-600 font-bold mt-1 sm:hidden">
            {formatPrice(item.price)}₫
          </p>
        </div>
      </div>

      {/* Unit Price (Desktop) */}
      <div className="hidden sm:block text-center w-28">
        <span className="text-sm font-semibold text-slate-600">
          {formatPrice(item.price)}₫
        </span>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto">
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
          <button
            onClick={() => updateQuantity('decrease')}
            disabled={quantity <= 1 || updating}
            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-orange-600 shadow-2xs disabled:opacity-40 transition-colors"
          >
            <FaMinus className="w-2.5 h-2.5" />
          </button>
          <span className="w-9 text-center font-bold text-slate-800 text-xs">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity('increase')}
            disabled={updating}
            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-orange-600 shadow-2xs disabled:opacity-40 transition-colors"
          >
            <FaPlus className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Subtotal on Mobile */}
        <span className="text-sm font-bold text-slate-900 sm:hidden">
          {formatPrice(totalPrice)}₫
        </span>
      </div>

      {/* Line Total & Remove */}
      <div className="hidden sm:flex items-center space-x-6">
        <span className="text-base font-extrabold text-slate-900 w-28 text-right">
          {formatPrice(totalPrice)}₫
        </span>
        <button
          onClick={handleRemoveFromCart}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Xóa khỏi giỏ hàng"
        >
          <GoTrash className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Remove button */}
      <div className="sm:hidden w-full flex justify-end pt-2 border-t border-slate-100">
        <button
          onClick={handleRemoveFromCart}
          className="text-xs font-semibold text-red-500 flex items-center space-x-1"
        >
          <GoTrash className="w-4 h-4" />
          <span>Xóa sản phẩm</span>
        </button>
      </div>

    </div>
  );
}
