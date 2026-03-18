import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getToken, getGoogleToken } from "../Login/app/static";

const HistoryPayment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = getToken() || getGoogleToken();
        const response = await fetch("http://localhost:3000/api/orders/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }
        const ordersData = await response.json();
        const formattedOrders = ordersData.map((order) => ({
          ...order,
          formattedDate: formatDate(order.order_date),
        }));
        setOrders(formattedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError("Failed to fetch order history. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const formatDate = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();

    minutes = minutes < 10 ? "0" + minutes : minutes;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedDateTime = `${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
    return formattedDateTime;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const fixNumber = (number) => {
    return Number(number.toFixed(2));
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="w-full min-h-screen px-4 md:px-8 py-10 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h3 className="text-primary text-3xl font-bold uppercase tracking-wide">
            Order History
          </h3>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-2"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl animate-pulse">Loading data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-10 text-center">
            <p className="text-gray-500 text-xl font-medium">
              No order history found.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
            {/* Wrapper để scroll trên mobile */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Books Detail
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                      Qty
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold uppercase">
                      Total Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Delivery Address
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        #{order._id.substring(order._id.length - 8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.formattedDate}
                      </td>
                      <td className="px-6 py-4 min-w-[250px]">
                        <ul className="space-y-2">
                          {order.order_details
                            .slice(
                              0,
                              expandedOrders[order._id]
                                ? order.order_details.length
                                : 2,
                            )
                            .map((detail, dIndex) => (
                              <li
                                key={dIndex}
                                className="text-sm border-l-2 border-orange-400 pl-2"
                              >
                                <div className="font-bold text-gray-800">
                                  {detail.book.title}
                                </div>
                                <div className="text-orange-600 font-medium">
                                  {formatPrice(fixNumber(detail.book.price))}₫
                                </div>
                              </li>
                            ))}
                        </ul>
                        {order.order_details.length > 2 && (
                          <button
                            className="text-blue-600 text-xs font-bold mt-2 hover:underline focus:outline-none"
                            onClick={() => toggleOrderDetails(order._id)}
                          >
                            {expandedOrders[order._id]
                              ? "▲ THU GỌN"
                              : `▼ XEM THÊM (${order.order_details.length - 2})`}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        {order.total_quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-blue-700">
                        {formatPrice(fixNumber(order.total_price))}₫
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate md:whitespace-normal">
                        <p className="font-semibold text-gray-800">
                          {order.phone}
                        </p>
                        <p className="text-xs italic">{order.address}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            order.order_status === "Success"
                              ? "bg-green-100 text-green-700"
                              : order.order_status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
