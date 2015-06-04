var express = require('express');
var router  = express.Router();

/* GET TopTopology page. */
// router.get('/TopTopology'， function(req, res, next){
// 	res.render('TopTopology');
// });

exports.index = function(req, res, next){
	var time = "2015/05/05 11:00";
	var time2 = "2015-05-05 11:00:00"
	var timeDate = new Date(time);
	var timeDate = 
	console.log(time);
	console.log(timeDate);
	res.render('test');
};