var express = require('express');
var router  = express.Router();
var FileFileAlarmList = require('../modules/FileAlarmList');

exports.index = function(req, res, next){
	res.render('FileAlarmQuery');
};

exports.queryFileAlarm = function(req, res, next){
	var data = req.body;
	var taskname = data.taskname;
	var content = data.content;
	var starttime = data.starttime;
	var endtime = data.endtime;
	var DeviceTmp1 = new Array();
	if(starttime != ""){
		var starttimeDate = new Date(starttime);
		for(var i=FileFileAlarmList.length-1; i != -1; i --){
			var tmptime = new Date(FileAlarmList[i].Time);
			if(tmptime > starttimeDate){
				DeviceTmp1.push(FileAlarmList[i]);
			}else{
				break;
			}
		}
	}else{
		DeviceTmp1 = FileAlarmList;
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
	res.json(DeviceTmp2);
}