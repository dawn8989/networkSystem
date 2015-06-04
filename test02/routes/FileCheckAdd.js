var express = require('express');
var router  = express.Router();
var TaskToDo = require('../modules/TaskToDo');
var TaskCompleted = require('../modules/TaskCompleted');
var TaskList = new Array();
var ContentTmp = new Array();
var FileAlarmList = require('../modules/FileAlarmList');

exports.index = function(req, res, next){
	res.render('FileCheckAdd');
};

exports.queryFileTask = function(req, res, next){
	TaskList = TaskToDo.concat(TaskCompleted);
	var data = req.body;
	var taskname = data.taskname;
	var starttime = data.starttime;
	var endtime = data.endtime;
	var DeviceTmp1 = new Array();
	if(starttime != ""){
		var starttimeDate = new Date(starttime);
		for(var i=0; i < TaskList.length ; i ++){
			var tmptime = new Date(TaskList[i].InitTime);
			if(tmptime > starttimeDate){
				DeviceTmp1.push(TaskList[i]);
			}
		}
	}else{
		DeviceTmp1 = TaskList;
	}
	var DeviceTmp2 = new Array();
	if(endtime != ""){
		var endtimeDate = new Date(endtime);
		for(var i=0; i < DeviceTmp1.length; i ++){
			var tmptime = new Date(DeviceTmp1[i].EndTime);
			if(tmptime < endtimeDate){
				DeviceTmp2.push(DeviceTmp1[i]);
			}
		}
	}else{
		DeviceTmp2 = DeviceTmp1;
	}
	var DeviceTmp3 = new Array();
	if(taskname != ""){
		for(var i=0; i < DeviceTmp2.length; i ++){
			if(TaskList[i].Name.toString().indexOf(taskname) != -1){
				DeviceTmp3.push(DeviceTmp2[i]);
			}
		}
	}else{
		DeviceTmp3 = DeviceTmp2;
	}
	res.json(DeviceTmp3);
}

// exports.FileAlarmShow = function(req, res, next){
// 	var length = FileAlarmList.length;
// 	var Alarm = FileAlarmList.splice(length-100);
// 	// var Alarm = AlarmList.slice(length-100);
// 	Alarm.reverse();
// 	res.json(Alarm);
// }

exports.addContent = function(req, res, next){
	var data = req.body;
	var taskId = TaskToDo.length;
	//添加的设备是否存在去另外一个函数判断，通过IP地址判断
	var Content = {
		Satellite:data.satellite,
		Repeater:data.repeater,
		Tsfile:data.tsfile,
		Program:data.program,
		ProgramID:data.programID,
		Url:data.fileurl
	}
	ContentTmp.push(Content);
	res.render('FileCheckAdd');
	// res.send("success");
}

//初始化添加文件检查任务页面的表格
exports.initContentTable = function(req, res, next){
	res.send(ContentTmp);
}

exports.addFileTask = function(req, res, next){
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