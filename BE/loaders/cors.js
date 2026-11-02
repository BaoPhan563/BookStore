const express = require("express");
const cors = require("cors");
const app = express();

//whitelist: danh sach cac domain co the truy cap server
const whitelist = [
  "http://localhost:3001",
  "https://localhost:3443",
  "http://localhost:3000",
  "https://bookstore-kwp8.onrender.com",
  "https://book-store-butgzh1c2-baophan563s-projects.vercel.app",
  "https://book-store-alpha-blond.vercel.app",
  process.env.DEPLOY_API_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

//corsOptionsDelegate: ham kiem tra xem origin co trong whitelist khong
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  const origin = req.header("Origin");
  if (!origin || whitelist.indexOf(origin) !== -1 || (origin && origin.endsWith(".vercel.app"))) {
    //neu origin co trong whitelist hoac den tu vercel
    corsOptions = { origin: true, credentials: true }; //cho phep truy cap
  } else {
    corsOptions = { origin: false }; //khong cho phep truy cap
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
