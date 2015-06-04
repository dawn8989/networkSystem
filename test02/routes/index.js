var express = require('express');
var router = express.Router();

/* GET DeviceCurrStatusQuery page. */
router.get('/DeviceCurrStatusQuery', function(req, res, next) {
  res.render('DeviceCurrStatusQuery');
});

module.exports = router;
