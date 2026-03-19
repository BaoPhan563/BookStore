import React, { useState, useEffect } from "react";
import axios from '../../axiosConfig';
import { DollarSign, Calendar, BarChart2, BookOpen } from 'react-feather';
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary

const RevenueDashboard = () => {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const token = getToken();

    // Function to fetch daily revenue
    const fetchDailyRevenue = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/daily-revenue`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDailyRevenue(response.data[0]?.daily_revenue || 0);
      } catch (error) {
        console.error("Error fetching daily revenue:", error);
      }
    };

    // Function to fetch monthly revenue
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/monthly-revenue`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMonthlyRevenue(response.data[0]?.monthly_revenue || 0);
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    };

    // Function to fetch yearly revenue
    const fetchYearlyRevenue = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/yearly-revenue`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setYearlyRevenue(response.data[0]?.yearly_revenue || 0);
      } catch (error) {
        console.error("Error fetching yearly revenue:", error);
      }
    };

    // Function to fetch total quantity
    const fetchTotalQuantity = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/total-quantity`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalQuantity(response.data[0]?.total_quantity || 0);
      } catch (error) {
        console.error("Error fetching total quantity:", error);
      }
    };

    // Fetch all data when component mounts
    fetchDailyRevenue();
    fetchMonthlyRevenue();
    fetchYearlyRevenue();
    fetchTotalQuantity();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="container mx-auto p-4 h-[443px] font-times">
      <h1 className="text-2xl font-bold mb-4">Doanh thu</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-blue-500 rounded-full">
            <DollarSign className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Doanh thu hôm nay</h2>
            <p className="text-xl">{formatPrice(dailyRevenue)}₫</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-green-500 rounded-full">
            <Calendar className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Doanh thu tháng này</h2>
            <p className="text-xl">{formatPrice(monthlyRevenue)}₫</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-yellow-500 rounded-full">
            <BarChart2 className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Doanh thu năm nay</h2>
            <p className="text-xl">{formatPrice(yearlyRevenue)}₫</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-purple-500 rounded-full">
            <BookOpen className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Tổng số lượng bán ra</h2>
            <p className="text-xl">{totalQuantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
