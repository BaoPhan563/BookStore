import React from 'react';
import { Link } from 'react-router-dom';
import { BiBookBookmark } from 'react-icons/bi';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
} from 'react-icons/ai';
import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0">
              <FiTruck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Giao hàng toàn quốc</p>
              <p>Miễn phí đơn từ 250.000₫</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0">
              <FiRotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Đổi trả dễ dàng</p>
              <p>Trong vòng 7 ngày miễn phí</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Chính hãng</p>
              <p>Cam kết chất lượng chuẩn</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0">
              <FiHeadphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Hỗ trợ 24/7</p>
              <p>Tư vấn chọn sách tận tâm</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white">
                <BiBookBookmark className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white font-serif tracking-tight">
                FBStore
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Cửa hàng sách trực tuyến hàng đầu, nơi hội tụ hàng ngàn tựa sách đặc sắc được tuyển chọn từ các nhà xuất bản uy tín trong và ngoài nước.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <p className="flex items-center space-x-2">
                <AiOutlineEnvironment className="w-4 h-4 text-orange-400 shrink-0" />
                <span>123 Đường Sách, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center space-x-2">
                <AiOutlinePhone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Hotline: 1900 6868 (8:00 - 21:00)</span>
              </p>
              <p className="flex items-center space-x-2">
                <AiOutlineMail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Email: hotro@fbstore.vn</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Về FBStore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  Giới thiệu câu chuyện
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Liên hệ hợp tác
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-orange-400 transition-colors">
                  Tuyển dụng nhân sự
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-orange-400 transition-colors">
                  Hệ thống nhà sách
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#guide" className="hover:text-orange-400 transition-colors">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#policy" className="hover:text-orange-400 transition-colors">
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-orange-400 transition-colors">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-orange-400 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Nhận bản tin ưu đãi
            </h4>
            <p className="text-xs text-slate-400">
              Đăng ký để nhận thông báo sách mới phát hành và voucher giảm giá đến 50%.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="w-full px-3.5 py-2.5 bg-slate-800 text-xs rounded-xl border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Đăng ký nhận tin
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} FBStore. Bản quyền thuộc về FBStore Team.</p>

          <div className="flex items-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <AiFillFacebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <AiFillInstagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <AiFillYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
