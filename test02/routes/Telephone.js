var express = require('express');
var router  = express.Router();
var TelephoneList = require('../modules/TelephoneList');

exports.index = function(req, res, next){
	res.render('Telephone');
};

// exports.jump = function(req, res, next){
// 	var subsysid = req.body.subsysid;
// 	res.render('Sub')
// }

exports.addTelephone = function(req, res, next){
	var data = req.body;
	//添加的设备是否存在去另外一个函数判断，通过IP地址判断
	var telephone = {
		Provider:data.provider,
		Telephone:data.telephone
	}
	TelephoneList.push(telephone);
	// res.render('SubTopology');
	res.redirect(303, '/Telephone');
}

exports.queryTelephone = function(req, res, next){
	var data = req.body;
	var provider = data.provider;
	var DeviceTmp1 = new Array();
	if(provider != ""){
		for(var i=0; i < TelephoneList.length; i ++){
			if(TelephoneList[i].Provider.indexOf(provider) != -1){
				DeviceTmp1.push(TelephoneList[i]);
			}else{
				break;
			}
		}
	}else{
		DeviceTmp1 = TelephoneList;
	}
	res.json(DeviceTmp1);
}
