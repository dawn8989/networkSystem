var express = require('express');
var router  = express.Router();
var SubSystemList = require('../modules/SubSystemList');

exports.index = function(req, res, next){
	// res.render('TopTopology');
	// res.sendfile('toptopo.html');
	var subsysID = 1;
	res.render('TopTopology', {subsysID:subsysID.toString()});
};

//向前端页面刷新每个子系统的报警数目
exports.SubNumShow = function(req, res, next){
	var SubSysTmp = new Array();
	for(var i=0; i < SubSystemList.length-3; i ++){
		var AlarmNum = 0; 
		for(var j=0; j < DeviceList.length; j ++){
			if((DeviceList[j].AlarmStatus == "ON")&&(DeviceList[j].SubSys == SubSystemList[i].SubSysName)){
				AlarmNum = AlarmNum + 1;
			}
		}
		var num = new Array(AlarmNum, SubSystemList[i].SumNum);
		SubSysTmp.push(num);
	}
	res.json(SubSysTmp);
}