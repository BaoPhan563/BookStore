import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { getToken, getGoogleToken } from "../Login/app/static";
import { Link } from "react-router-dom";
import {
  AiOutlineHistory,
  AiOutlineArrowLeft,
  AiOutlineShopping,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineCalendar,
} from "react-icons/ai";

const HistoryPayment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = getToken() || getGoogleToken();
        if (!token) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const response = await axios.get("/orders/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const ordersData = Array.isArray(response.data) ? response.data : [];
        const formattedOrders = ordersData.map((order) => ({
          ...order,
          formattedDate: formatDate(order.order_date || order.createdAt),
        }));
        setOrders(formattedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "Gần đây";
    const dateObj = new Date(dateTimeString);
    if (isNaN(dateObj.getTime())) return "Gần đây";

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif flex items-center space-x-2.5">
              <AiOutlineHistory className="w-7 h-7 text-orange-600" />
              <span>Lịch sử đơn hàng</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi tình trạng đơn hàng và xem lại các giao dịch đã thực hiện
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs flex justify-center items-center h-64">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-slate-500">Đang tải lịch sử giao dịch...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-3xl text-center max-w-md mx-auto">
            <p className="font-semibold text-sm mb-1">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 lg:p-16 text-center max-w-md mx-auto border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <AiOutlineShopping className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-slate-500 mb-6">
              Bạn chưa thực hiện đơn đặt sách nào tại FBStore. Hãy khám phá và mua sắm ngay!
            </p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Khám phá sách hay
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Mã đơn</th>
                    <th className="px-6 py-4">Thời gian</th>
                    <th className="px-6 py-4 min-w-[260px]">Chi tiết sách</th>
                    <th className="px-6 py-4 text-center">SL</th>
                    <th className="px-6 py-4 text-right">Tổng tiền</th>
                    <th className="px-6 py-4">Giao hàng đến</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.map((order, index) => {
                    const isExpanded = expandedOrders[order._id];
                    const details = order.order_details || [];
                    const displayedDetails = isExpanded ? details : details.slice(0, 2);

                    const status = order.order_status || "Waiting";
                    const isSuccess = status === "Success";
                    const isCancel = status === "Fail" || status === "Cancel";

                    return (
                      <tr key={order._id || index} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Order ID */}
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                          #{order._id?.substring(order._id.length - 8) || "OD-" + index}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <AiOutlineCalendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{order.formattedDate}</span>
                          </div>
                        </td>

                        {/* Book details list */}
                        <td className="px-6 py-4">
                          <ul className="space-y-1.5">
                            {displayedDetails.map((detail, dIndex) => (
                              <li key={dIndex} className="text-xs">
                                <span className="font-semibold text-slate-800 line-clamp-1 font-serif">
                                  {detail.book?.title || "Sách đã ngừng phát hành"}
                                </span>
                                <span className="text-[11px] text-orange-600 font-medium">
                                  {formatPrice(detail.book?.price || detail.order_price || 0)}₫ x {detail.order_quantity || 1}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {details.length > 2 && (
                            <button
                              onClick={() => toggleOrderDetails(order._id)}
                              className="text-orange-600 hover:text-orange-700 text-[11px] font-bold mt-2 focus:outline-none"
                            >
                              {isExpanded
                                ? "▲ Thu gọn"
                                : `▼ Xem thêm (+${details.length - 2} cuốn)`}
                            </button>
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="px-6 py-4 text-center font-bold text-slate-700 text-xs">
                          {order.total_quantity || 1}
                        </td>

                        {/* Total Price */}
                        <td className="px-6 py-4 text-right font-extrabold text-orange-600 text-sm whitespace-nowrap">
                          {formatPrice(order.total_price)}₫
                        </td>

                        {/* Address */}
                        <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px]">
                          {order.phone && (
                            <p className="font-semibold text-slate-800 flex items-center space-x-1">
                              <AiOutlinePhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{order.phone}</span>
                            </p>
                          )}
                          <p className="text-slate-500 line-clamp-2 mt-0.5">
                            {order.address || "Địa chỉ mặc định"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isSuccess
                                ? "bg-emerald-100 text-emerald-700"
                                : isCancel
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isSuccess
                              ? "Thành công"
                              : isCancel
                              ? "Đã hủy"
                              : "Đang xử lý"}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPayment;
