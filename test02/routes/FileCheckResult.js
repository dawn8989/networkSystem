var express = require('express');
var router  = express.Router();


exports.index = function(req, res, next){
	res.render('FileCheckResult');
};


