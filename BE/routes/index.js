var express = require('express');
var router = express.Router();

/* GET home page / API health check. */
router.get('/', function(req, res, next) {
  res.json({ status: "success", message: "BookStore API is running!" });
});

module.exports = router;
