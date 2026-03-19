import React, { useState, useEffect } from "react";
import axios from '../../axiosConfig';
import { DollarSign, Calendar, BarChart2, BookOpen } from 'react-feather';
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary

const RevenueDashboard = () => {
  const [dailyRevenue, setDailyRevenue] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [yearlyRevenue, setYearlyRevenue] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(null);

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

  return (
    <div className="container mx-auto p-4 h-[443px] font-times">
      <h1 className="text-2xl font-bold mb-4">Revenue Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-blue-500 rounded-full">
            <DollarSign className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Daily Revenue</h2>
            <p className="text-xl">${dailyRevenue}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-green-500 rounded-full">
            <Calendar className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Monthly Revenue</h2>
            <p className="text-xl">${monthlyRevenue}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-yellow-500 rounded-full">
            <BarChart2 className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Yearly Revenue</h2>
            <p className="text-xl">${yearlyRevenue}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="mr-4 p-3 bg-purple-500 rounded-full">
            <BookOpen className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Total Quantity Sold</h2>
            <p className="text-xl">{totalQuantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
