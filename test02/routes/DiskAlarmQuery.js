var express = require('express');
var router  = express.Router();
var DiskAlarmList = require('../modules/DiskAlarmList');

exports.index = function(req, res, next){
	res.render('DiskAlarmQuery');
};

exports.queryDiskAlarm = function(req, res, next){
	var data = req.body;
	var diskdir = data.diskdir;
	var starttime = data.starttime;
	var endtime = data.endtime;
	var DeviceTmp1 = new Array();
	if(starttime != ""){
		var starttimeDate = new Date(starttime);
		for(var i=DiskAlarmList.length-1; i != -1; i --){
			var tmptime = new Date(DiskAlarmList[i].Time);
			if(tmptime > starttimeDate){
				DeviceTmp1.push(DiskAlarmList[i]);
			}else{
				break;
			}
		}
	}else{
		DeviceTmp1 = DiskAlarmList;
	}
	var DeviceTmp2 = new Array();
	if(endtime != ""){
		var endtimeDate = new Date(endtime);
		for(var i=0; i < DeviceTmp1.length; i ++){
			var tmptime = new Date(DeviceTmp1[i].Time);
			if(tmptime < endtimeDate){
				DeviceTmp2.push(DeviceTmp1[i]);
			}
		}
	}else{
		DeviceTmp2 = DeviceTmp1;
	}
	var DeviceTmp3 = new Array();
	if(diskdir != ""){
		for(var i=0; i < DeviceTmp2.length; i ++){
			if(DeviceTmp2[i].LocalDir.indexOf(diskdir) != -1){
				DeviceTmp3.push(DeviceTmp2[i]);
			}
		}
	}else{
		DeviceTmp3 = DeviceTmp2;
	}
	res.json(DeviceTmp3);
}