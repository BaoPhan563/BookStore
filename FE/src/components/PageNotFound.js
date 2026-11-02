import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-16 bg-slate-50/50">
      <div className="text-center max-w-md bg-white rounded-3xl p-10 border border-slate-200/80 shadow-lg">
        <span className="text-6xl sm:text-7xl font-extrabold text-orange-600 font-serif block mb-2">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-2">
          Không tìm thấy trang
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không khả dụng.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all"
        >
          <AiOutlineHome className="w-4 h-4" />
          <span>Trở về trang chủ</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
