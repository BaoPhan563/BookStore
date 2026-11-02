import React from 'react';
import { FiBookOpen, FiAward, FiHeart, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div id="about" className="min-h-screen bg-slate-50/60 py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100/70 px-3.5 py-1 rounded-full">
            Về FBStore
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif mt-4 mb-4">
            Lan tỏa niềm đam mê đọc sách
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Chúng tôi tin rằng mỗi cuốn sách là một hạt mầm tri thức, mở ra những thế giới mới và kết nối những tâm hồn đồng điệu.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 font-serif">Kho sách chọn lọc</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hơn 10.000+ tựa sách bản quyền từ các nhà xuất bản hàng đầu Việt Nam và thế giới.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 font-serif">Tận tâm phục vụ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Đóng gói cẩn thận, bọc chống sốc 2 lớp và hỗ trợ đổi trả linh hoạt trong 7 ngày.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <FiAward className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 font-serif">Cam kết chính hãng</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% sách có nguồn gốc rõ ràng, nói không với sách lậu, sách photo kém chất lượng.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900 font-serif border-b border-slate-100 pb-4">
            Sứ mệnh & Tầm nhìn
          </h2>
          <p>
            Được thành lập với tình yêu mãnh liệt dành cho văn hóa đọc, <strong className="text-slate-900">FBStore</strong> không chỉ là một cửa hàng sách trực tuyến mà còn là không gian hội tụ của những người yêu sách khắp cả nước.
          </p>
          <p>
            Chúng tôi hiểu rằng thời gian của bạn là quý báu, vì vậy giao diện FBStore được thiết kế tinh gọn, hiện đại và thông minh, giúp bạn dễ dàng tìm kiếm những tựa sách phù hợp theo thể loại, tác giả, mức giá và đánh giá từ cộng đồng độc giả thực tế.
          </p>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Bạn đã sẵn sàng đồng hành cùng chúng tôi?</h4>
              <p className="text-xs text-slate-400">Khám phá ngay bộ sưu tập sách bán chạy nhất tuần này.</p>
            </div>
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all shrink-0"
            >
              Xem tủ sách ngay
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
