let express = require("express");
let paymentRouter = express.Router();
var Payment = require("../models/payment");
var Book = require("../models/book");
var Inventory = require("../models/inventory");
var Order = require("../models/order");
var authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const paypalConfig = require("../configs/paypalConfig");
const dotenv = require("dotenv");
dotenv.config();

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/create_payment_paypal")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async function (req, res, next) {
      const { quantity, amount, order_details } = req.body;

      const fixNum = (num) => {
        return num.toFixed(2);
      };

      try {
        const listBook = await order_details.map((detail) => {
          return Book.findById(detail.book).exec();
        });
        const allDetail = await Promise.all(listBook);

        // Create items array with book details
        const items = order_details.map((detail, index) => {
          const book = allDetail[index];
          if (!book) {
            res.status(401).json({ message: "Book not found" });
          }
          return {
            name: book.title,
            sku: detail.book, // Using bookID as SKU
            price: book.price,
            currency: "USD",
            quantity: detail.order_quantity,
          };
        });

        const formattedAmount = fixNum(amount);

        console.log(items);

        const create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: "http://localhost:3000/api/payment/success",
            cancel_url: "http://localhost:3000/api/payment/cancel",
          },
          transactions: [
            {
              item_list: {
                items: items,
              },
              amount: {
                currency: "USD",
                total: formattedAmount,
              },
              description: "Best book store ever",
            },
          ],
        };

        console.log(fixNum);
        console.log(items);

        paypalConfig.payment.create(
          create_payment_json,
          async function (error, payment) {
            if (error) {
              throw error;
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                  res.end(payment.links[i].href);
                  const token = payment.links[i].href.split("token=")[1];
                  console.log(token);

                  await Order.create({
                    user: req.user._id,
                    total_price: amount,
                    total_quantity: quantity,
                    paymentToken: token,
                    address: req.user.address,
                    phone: req.user.phone,
                    order_details: req.body.order_details.map((detail) => ({
                      book: detail.book,
                      order_quantity: detail.order_quantity,
                      order_price: detail.order_price,
                    })),
                  }).then(async (order) => {
                    await Payment.create({
                      paymentToken: token,
                      order: order._id,
                      user: req.user._id,
                      quantity: quantity,
                      total_price: amount,
                    });
                  });
                }
              }
            }
          },
        );
      } catch (err) {
        next(err);
      }
    },
  );

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/success", cors.cors, async function (req, res, next) {
    try {
      let paymentToken = req.query.token;

      console.log(paymentToken);

      const payment = Payment.findOne({ paymentToken: paymentToken });
      if (!payment) {
        res.status(401).json({ message: "Payment not found" });
      } else {
        await Payment.findOneAndUpdate(
          { paymentToken: paymentToken },
          { payment_status: "Success" },
        );

        const order = await Order.findOneAndUpdate(
          { paymentToken: paymentToken },
          { order_status: "Success" },
        );

        if (!order) {
          res.status(401).json({ message: "Order not found" });
        }

        for (let i of order.order_details) {
          try {
            await Inventory.create({
              book: i.book,
              quantity: i.order_quantity,
              transaction_type: "Sell",
            });

            // Update the quantity of the book
            await Book.findByIdAndUpdate(i.book, {
              $inc: { quantity: -i.order_quantity },
            });
          } catch (err) {
            next(err);
          }
        }

        res.status(200).redirect("http://localhost:3001/payment/success");
      }
    } catch (err) {
      next(err);
    }
  });

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/cancel", cors.cors, async function (req, res, next) {
    try {
      let paymentToken = req.query.token;

      console.log(paymentToken);

      const payment = Payment.findOne({ paymentToken: paymentToken });
      if (!payment) {
        res.status(401).json({ message: "Payment not found" });
      } else {
        await Payment.findOneAndUpdate(
          { paymentToken: paymentToken },
          { payment_status: "Cancel" },
        );

        const order = await Order.findOneAndUpdate(
          { paymentToken: paymentToken },
          { order_status: "Fail" },
        );

        if (!order) {
          res.status(401).json({ message: "Order not found" });
        }

        //tra sach ve kho
        // for (let detail of order.order_details) {
        //   await Book.findOneAndUpdate(
        //     { _id: detail.book },
        //     { $inc: { quantity: detail.order_quantity } }
        //   );
        // }
        console.log(order);
        res.status(200).redirect("http://localhost:3001/payment/cancel");
      }
    } catch (err) {
      next(err);
    }
  });

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(
    "/create_payment_url",
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      var ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      var config = require("../configs/config");
      var dateFormat = require("dateformat");

      const moment = require("moment");

      var tmnCode = process.env.VNP_TMN_CODE;
      console.log("tmnCode: ", process.env.VNP_TMN_CODE);
      var secretKey = process.env.VNP_HASH_SECRET;
      var vnpUrl = process.env.VNP_URL;
      console.log("vnpUrl: ", vnpUrl);
      var returnUrl = process.env.VNP_RETURN_URL;
      console.log("returnUrl: ", returnUrl);

      var date = new Date();

      var createDate = moment(date).format("YYYYMMDDHHmmss");
      console.log(createDate);
      var orderId = moment(date).format("DDHHmmss");
      console.log("orderId: ", orderId);
      let amount = parseInt(req.body.amount);
      console.log(amount);
      var bankCode = req.body.bankCode;
      console.log(bankCode);
      let quantity = parseInt(req.body.quantity);
      console.log(quantity);
      let order_details = req.body.order_details;
      console.log(order_details);

      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Số tiền không hợp lệ" });
      }
      const newOrder = await Order.create({
        user: req.user._id,
        total_price: amount,
        total_quantity: quantity,
        paymentToken: orderId, // Dùng orderId của VNPay làm token định danh
        address: req.user.address,
        phone: req.user.phone,
        order_status: "Waiting", // Trạng thái chờ thanh toán
        order_details: order_details.map((detail) => ({
          book: detail.book,
          order_quantity: detail.order_quantity,
          order_price: detail.order_price,
        })),
      });

      await Payment.create({
        paymentToken: orderId,
        order: newOrder._id,
        user: req.user._id,
        quantity: quantity,
        total_price: amount,
        payment_status: "Pending",
      });

      var orderInfo = req.body.orderDescription;
      console.log(orderInfo);
      var orderType = req.body.orderType;
      console.log(orderType);
      var locale = req.body.language;
      if (locale === null || locale === "") {
        locale = "vn";
      }
      var currCode = "VND";
      var vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      // vnp_Params['vnp_Merchant'] = ''
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = orderInfo;
      vnp_Params["vnp_OrderType"] = orderType;
      vnp_Params["vnp_Amount"] = (amount * 100).toString();
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      var querystring = require("qs");
      var signData = querystring.stringify(vnp_Params, { encode: false });
      var crypto = require("crypto");
      var hmac = crypto.createHmac("sha512", secretKey);
      var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

      res.status(200).json({ paymentUrl: vnpUrl });
    },
  );

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
// Vui lòng tham khảo thêm tại code demo

module.exports = paymentRouter;
