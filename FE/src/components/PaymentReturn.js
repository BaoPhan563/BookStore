import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleToken, getToken } from "./Login/app/static";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const token = getToken() || getGoogleToken();
    axios
      .get(
        `http://localhost:3000/api/paymentReturn/vnpay_return${location.search}`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        //   withCredentials: true,
        // },
      )
      .then((response) => {
        setResult(response.data);
        setLoading(false);
        if (response.data.success) {
          // Xóa giỏ hàng sau khi thanh toán thành công
          axios
            .delete("http://localhost:3000/api/cart/deleteCart", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            })
            .then(() => {
              console.log(
                "Giỏ hàng đã được xóa sau khi thanh toán thành công.",
              );
            })
            .catch((error) => {
              console.error("Lỗi khi xóa giỏ hàng:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching payment result:", error);
        setLoading(false);
      });
  }, [location.search]);

  const goHome = () => {
    navigate("/");
  };

  console.log("Result:", result);

  return (
    <div className="container min-h-screen mx-auto px-4 py-8 flex justify-center items-center">
      <div className="max-w-md bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <img
              className="w-16 h-16 mr-4"
              src={
                result?.success
                  ? process.env.PUBLIC_URL + "/images/success.png"
                  : process.env.PUBLIC_URL + "/images/failure.png"
              }
              alt="Payment result icon"
            />
            <p className="text-2xl font-bold text-green-500">
              {result?.message}
            </p>
          </div>
          <p className="text-lg mb-4 font-semibold">
            {result?.success
              ? `Mã giao dịch: ${result.data.transactionNo}`
              : `Mã lỗi: ${result?.code || "Không xác định"}`}
          </p>
          <p className="text-lg mb-4 font-semibold">
            {result?.success
              ? `Số tiền: ${(result.data.amount / 100).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}`
              : "Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn."}
          </p>
          <button
            onClick={goHome}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
