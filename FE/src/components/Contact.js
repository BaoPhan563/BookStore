import React, { useState } from 'react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiOutlineSend } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.warning('Vui lòng điền đầy đủ họ tên, email và nội dung liên hệ.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      toast.warning('Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại!');
      return;
    }

    setSending(true);
    setTimeout(() => {
      toast.success('Cảm ơn bạn! Thông tin liên hệ của bạn đã được gửi thành công.');
      setForm({ name: '', email: '', message: '' });
      setSending(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 lg:py-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100/70 px-3.5 py-1 rounded-full">
            Liên hệ hỗ trợ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mt-4 mb-3">
            Chúng tôi luôn lắng nghe bạn
          </h1>
          <p className="text-sm text-slate-500">
            Có thắc mắc về đơn hàng, góp ý về dịch vụ hoặc muốn hợp tác? Hãy gửi tin nhắn cho chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 rounded-3xl p-8 text-white space-y-6 shadow-md">
            <div>
              <h3 className="text-xl font-bold font-serif mb-2">Thông tin liên lạc</h3>
              <p className="text-xs text-slate-300">
                Đội ngũ chăm sóc khách hàng của FBStore luôn túc trực để hỗ trợ bạn nhanh chóng nhất.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 pt-4 border-t border-white/10">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-orange-400 shrink-0">
                  <AiOutlineEnvironment className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Địa chỉ trụ sở</p>
                  <p>123 Đường Sách, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-orange-400 shrink-0">
                  <AiOutlinePhone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Hotline tư vấn</p>
                  <p>1900 6868 (8:00 - 21:00 hàng ngày)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-orange-400 shrink-0">
                  <AiOutlineMail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Hòm thư điện tử</p>
                  <p>hotro@fbstore.vn</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-slate-400">
              <p>Thời gian phản hồi thông thường trong vòng 2-4 giờ làm việc.</p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 font-serif mb-6 border-b border-slate-100 pb-3">
              Gửi tin nhắn trực tiếp
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nội dung lời nhắn
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Hãy cho chúng tôi biết bạn cần hỗ trợ điều gì..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <AiOutlineSend className="w-4 h-4" />
                  <span>{sending ? 'Đang gửi tin nhắn...' : 'Gửi tin nhắn'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactUs;
