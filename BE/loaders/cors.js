const express = require("express");
const cors = require("cors");
const app = express();

//whitelist: danh sach cac domain co the truy cap server
const whitelist = [
  "http://localhost:3001",
  "https://localhost:3443",
  "http://localhost:3000",
  "https://bookstore-kwp8.onrender.com",
  "https://book-store-butgzh1c2-baophan563s-projects.vercel.app"
];
//corsOptionsDelegate: ham kiem tra xem origin co trong whitelist khong
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    //neu origin co trong whitelist
    corsOptions = { origin: true, credentials: true }; //cho phep truy cap
  } else {
    corsOptions = { origin: false }; //khong cho phep truy cap
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
