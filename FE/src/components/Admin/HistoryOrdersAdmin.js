import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig'; // Adjust the import path as necessary
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify for notifications

const HistoryOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'text-green-600';
      case 'fail':
        return 'text-red-600';
      case 'waiting':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="container mx-auto p-4 font-times">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Lịch sử đơn hàng</h1>
      <ToastContainer />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-orange-600">
            <tr>
              <th className="py-4 px-6 text-left text-white font-semibold">ID Đơn hàng</th>
              <th className="py-4 px-6 text-left text-white font-semibold">Người mua</th>
              <th className="py-4 px-6 text-left text-white font-semibold">Sách</th>
              <th className="py-4 px-6 text-left text-white font-semibold">Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="even:bg-orange-50 odd:bg-white hover:bg-orange-100">
                <td className="py-4 px-6 border-t border-gray-200">{order._id}</td>
                <td className="py-4 px-6 border-t border-gray-200">
                  <div className="font-semibold">{order.user.fullname}</div>
                  <div>{order.user.phone}</div>
                  <div>{order.user.address}</div>
                </td>
                <td className="py-4 px-6 border-t border-gray-200">
                  <ul className="list-inside">
                    {order.order_details.map((detail) => (
                      <li key={detail.book._id} className="mb-1">
                        <div className="">Tiêu đề: {detail.book.title}</div>
                        <div>Tác giả: {detail.book.author}</div>
                        <div className="text-orange-600">Đơn giá: {formatPrice(detail.book.price)}₫</div>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className={`py-4 px-6 border-t border-gray-200 ${getStatusColor(order.order_status)}`}>
                  {order.order_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryOrdersAdmin;
