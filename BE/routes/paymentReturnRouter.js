let express = require("express");
let paymentReturn = express.Router();
var Payment = require("../models/payment");
var Book = require("../models/book");
var Inventory = require("../models/inventory");
var Order = require("../models/order");
var authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const dotenv = require("dotenv");
dotenv.config();

paymentReturn
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/vnpay_return", cors.corsWithOptions, async (req, res, next) => {
    var vnp_Params = req.query;

    var secureHash = vnp_Params["vnp_SecureHash"];

    const responseCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // eslint-disable-next-line no-undef
    vnp_Params = sortObject(vnp_Params);

    var config = require("../configs/config");
    var tmnCode = process.env.VNP_TMN_CODE;
    var secretKey = process.env.VNP_HASH_SECRET;

    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

      const responseCode = vnp_Params["vnp_ResponseCode"];
      let paymentToken = vnp_Params["vnp_TxnRef"];

      if (responseCode === "00") {
        // 1. Tìm đơn hàng dựa trên txnRef (hoặc paymentToken tùy cách bạn lưu)
        const order = await Order.findOne({ paymentToken: paymentToken });

        if (!order) {
          return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        // Kiểm tra nếu đơn hàng đã được xử lý trước đó (tránh cập nhật 2 lần)
        if (order.order_status !== "Success") {
          // 2. Cập nhật trạng thái Thanh toán & Đơn hàng
          await Payment.findOneAndUpdate(
            { paymentToken: paymentToken },
            { payment_status: "Success" },
          );

          order.order_status = "Success";
          await order.save();

          // 3. Trừ số lượng trong Kho và Sách
          for (let item of order.order_details) {
            // Tạo lịch sử kho
            await Inventory.create({
              book: item.book,
              quantity: item.order_quantity,
              transaction_type: "Sell",
            });

            // Trừ số lượng trực tiếp ở model Book
            await Book.findByIdAndUpdate(item.book, {
              $inc: { quantity: -item.order_quantity },
            });
          }
        }
      } else {
        // Thanh toán thất bại tại VNPay
        await Payment.findOneAndUpdate(
          { paymentToken: orderId },
          { payment_status: "Cancel" },
        );
        await Order.findOneAndUpdate(
          { paymentToken: orderId },
          { order_status: "Fail" },
        );
      }

      res.status(200).json({
        success: responseCode === "00",
        code: responseCode,
        message:
          responseCode === "00"
            ? "Thanh toán thành công"
            : "Thanh toán thất bại",
        data: {
          responseCode: vnp_Params["vnp_ResponseCode"],
          transactionNo: vnp_Params["vnp_TxnRef"],
          amount: vnp_Params["vnp_Amount"],
        },
      });
    } else {
      res.status(400).json({
        success: false,
        code: "97",
        message: "Chu ky khong hop le",
      });
    }
  });

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = paymentReturn;
