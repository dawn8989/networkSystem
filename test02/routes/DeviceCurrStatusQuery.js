var express = require('express');
var router  = express.Router();
var DeviceList = require('../modules/DeviceList');

exports.index = function(req, res, next){
	res.render('DeviceCurrStatusQuery');
};

exports.queryDevice = function(req, res, next){
	var data = req.body;
	var devicename = data.devicename;
	var devicetype = data.devicetype;
	var subsys = data.subsys;
	var alarmstatus = data.alarmstatus;
	var DeviceTmp1 = new Array();
	if(alarmstatus != ""){
		for(var i = 0; i < DeviceList.length; i ++){
			if(DeviceList[i].AlarmStatus == alarmstatus){
				DeviceTmp1.push(DeviceList[i]);
			}
		}
	}else{
		DeviceTmp1 = DeviceList;
	}
	var DeviceTmp2 = new Array();
	if(subsys != ""){
		for(var i=0; i < DeviceTmp1.length; i ++){
			if(DeviceTmp1[i].SubSys == subsys){
				DeviceTmp2.push(DeviceTmp1[i]);
			}
		}
	}else{
		DeviceTmp2 = DeviceTmp1;
	}
	var DeviceTmp3 = new Array();
	if(devicetype != ""){
		for(var i=0; i < DeviceTmp2.length; i ++){
			if(DeviceTmp2[i].DeviceInfo.DeviceType == devicetype){
				DeviceTmp3.push(DeviceTmp2[i]);
			}
		}
	}else{
		DeviceTmp3 = DeviceTmp2;
	}
	var DeviceTmp4 = new Array();
	if(devicename != ""){
		for(var i=0; i < DeviceTmp3.length; i ++){
			if(DeviceTmp3[i].Name.toString().indexOf(devicename)){
				DeviceTmp4.push(DeviceTmp3[i]);
			}
		}
	}else{
		DeviceTmp4 = DeviceTmp3;
	}
	res.json(DeviceTmp4);
}