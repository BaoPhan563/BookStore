const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dgdtgmoj1",
  api_key: process.env.CLOUDINARY_API_KEY || "226597768798145",
  api_secret: process.env.CLOUDINARY_API_SECRET || "xZggHiE0lo1QFE59ccLmh93b1wM",
});

module.exports = cloudinary;
