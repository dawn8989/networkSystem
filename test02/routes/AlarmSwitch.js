var express = require('express');
var router  = express.Router();
//var DeviceList = require('../modules/DeviceList');


exports.index = function(req, res, next){
	res.render('AlarmSwitch');
};