var express = require('express');
var router  = express.Router();
var DeviceList = require('../modules/DeviceList');
var AlarmList = require('../modules/AlarmList');

exports.index = function(req, res, next){
	res.render('DeviceAlarmQuery');
};

exports.queryDeviceAlarm = function(req, res, next){
	var data = req.body;
	var devicename = data.devicename;
	var devicetype = data.devicetype;
	var subsys = data.subsys;
	var appname = data.appname;
	var alarmtype = data.alarmtype;
	var starttime = data.starttime;
	var endtime = data.endtime;
	var DeviceTmp1 = new Array();
	if(starttime != ""){
		var starttimeDate = new Date(starttime);
		for(var i=AlarmList.length-1; i != -1; i --){
			var tmptime = new Date(AlarmList[i].StartTime);
			if(tmptime > starttimeDate){
				DeviceTmp1.push(AlarmList[i]);
			}else{
				break;
			}
		}
	}else{
		DeviceTmp1 = AlarmList;
	}
	var DeviceTmp2 = new Array();
	if(endtime != ""){
		var endtimeDate = new Date(endtime);
		for(var i=0; i < DeviceTmp1.length; i ++){
			if(DeviceTmp1[i].EndTime != undefined){
				var tmptime = new Date(DeviceTmp1[i].EndTime);
				if(tmptime < endtimeDate){
					DeviceTmp2.push(DeviceTmp1[i]);
				}
			}
		}
	}else{
		DeviceTmp2 = DeviceTmp1;
	}
	var DeviceTmp3 = new Array();
	if(alarmtype != ""){
		for(var i=0; i < DeviceTmp2.length; i ++){
			if(DeviceTmp2[i].Source[1] == alarmtype){
				DeviceTmp3.push(DeviceTmp2[i]);
			}
		}
	}else{
		DeviceTmp3 = DeviceTmp2;
	}
	var DeviceTmp4 = new Array();
	if(subsys != ""){
		for(var i=0; i < DeviceTmp3.length; i ++){
			if(DeviceTmp3[i].SubSys == subsys){
				DeviceTmp4.push(DeviceTmp3[i]);
			}
		}
	}else{
		DeviceTmp4 = DeviceTmp3;
	}
	var DeviceTmp5 = new Array();
	if(devicetype != ""){
		for(var i=0; i < DeviceTmp4.length; i ++){
			if(DeviceTmp4[i].DeviceType == devicetype){
				DeviceTmp5.push(DeviceTmp4[i]);
			}
		}
	}else{
		DeviceTmp5 = DeviceTmp4;
	}
	var DeviceTmp6 = new Array();
	if(devicename != ""){
		for(var i=0; i < DeviceTmp5.length; i ++){
			if(DeviceTmp5[i].DeviceName.toString().indexOf(devicename) != -1){
				DeviceTmp6.push(DeviceTmp5[i]);
			}
		}
	}else{
		DeviceTmp6 = DeviceTmp5;
	}
	var DeviceTmp7 = new Array();
	if(appname != ""){
		for(var i=0; i < DeviceTmp6.length; i ++){
			if((DeviceTmp6[i].Source.length == 5) && (DeviceTmp6[i].Source[2] == appname)){
				DeviceTmp7.push(DeviceTmp6[i]);
			}
		}
	}else{
		DeviceTmp7 = DeviceTmp6;
	}
	res.json(DeviceTmp7);
}