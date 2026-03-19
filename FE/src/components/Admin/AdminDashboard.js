import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary

const AdminDashboard = () => {
  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log('Token:', token);
      // You can use the token here for fetching data or other purposes
    } else {
      console.warn('No token found');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 h-[430px]">
      <h1 className="text-3xl font-bold mb-4 text-black">Dashboard</h1>

      <div className="mt-8">
        <ul className="divide-y divide-gray-200">
          <li className="py-2">
            <Link to="/booklistadmin" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Quản lý sách</span>
            </Link>
          </li>
          {/* <li className="py-2">
            <Link to="/addbook" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Add Book</span>
            </Link>
          </li> */}
           <li className="py-2">
            <Link to="/history" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Lịch sử đơn hàng</span>
            </Link>
          </li>
          <li className="py-2">
            <Link to="/revenue" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Doanh thu</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
