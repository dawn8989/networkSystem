var express = require('express');
var router  = express.Router();
var FileDiskAlarmList = require('../modules/DiskAlarmList');

exports.index = function(req, res, next){
	res.render('DiskCheckManagement');
};

exports.queryDiskAlarm = function(req, res, next){
	var data = req.body;
	var taskname = data.taskname;
	var content = data.content;
	var starttime = data.starttime;
	var endtime = data.endtime;
	var DeviceTmp1 = new Array();
	if(starttime != ""){
		var starttimeDate = new Date(starttime);
		for(var i=FileDiskAlarmList.length-1; i != -1; i --){
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
			if(DeviceTmp1[i].EndTime != undefined){
				var tmptime = new Date(DeviceTmp1[i].Time);
				if(tmptime < endtimeDate){
					DeviceTmp2.push(DeviceTmp1[i]);
				}
			}
		}
	}else{
		DeviceTmp2 = DeviceTmp1;
	}
	res.json(DeviceTmp2);
}

exports.addDiskTask = function(req, res, next){
	var data = req.body;
	var taskId = TaskToDo.length;
	//添加的设备是否存在去另外一个函数判断，通过IP地址判断
	var Content = {
		Name:data.taskname,
		TaskId:taskId,
		Type:data.type,
		InitTime:data.starttime,
		EndTime:data.endtime,
		Frequency:data.frequency,
		NormalSize:data.normalsize,
		SizeThr:data.sizethr,
		LostTime:data.losttime,
		FileSavedTime:data.filesavedatime,
		Content:ContentTmp
	}
	ContentTmp.splice(0, ContentTmp.length);
	// res.render('SubTopology');
}