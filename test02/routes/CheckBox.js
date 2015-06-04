var express = require('express');
var router  = express.Router();
var DeviceList = require('../modules/DeviceList');

exports.index = function(req, res, next){
	res.render('CheckBox');
};

exports.ShowBoxCanvas = function(req, res, next){
	var deviceid = req.body.deviceid;
	var Box = 0;
	var Room = 0;
	var boxList = new Array();
	console.log(deviceid);
	for(var j=0; j < DeviceList.length; j ++){
		if((DeviceList[j].DeviceId == deviceid) && (DeviceList[j].DeviceInfo != undefined) && (DeviceList[j].DeviceInfo.Box != undefined) && (DeviceList[j].DeviceInfo.Room != undefined)){
			Box = DeviceList[j].DeviceInfo.Box;
			Room = DeviceList[j].DeviceInfo.Room;
			break;
		}
	}
	console.log(Room);
	console.log(Box);
	for(var i=0; i < DeviceList.length; i ++){
		if((DeviceList[i].DeviceInfo != undefined) && (DeviceList[i].DeviceInfo.Box != undefined) &&  (DeviceList[i].DeviceInfo.Room != undefined)){
			if((DeviceList[i].DeviceInfo.Room == Room) && (DeviceList[i].DeviceInfo.Box == Box)){
				boxList.push(DeviceList[i]);
			}
		}
	}
	console.log(boxList);
	res.json(boxList);
}

//根据选中的机柜，向前台发送该机柜的设备信息
exports.ChooseBoxCanvas = function(req, res, next){
	var data = req.body;
	var room = data.room;
	var box = data.box;
	var DeviceTmp = new Array();
	for(var i=0; i < DeviceList.length; i ++){
		if((DeviceList[i].DeviceInfo != undefined) && (DeviceList[i].DeviceInfo.Box != undefined) &&  (DeviceList[i].DeviceInfo.Room != undefined)){
			if((DeviceList[i].DeviceInfo.Room == room) && (DeviceList[i].DeviceInfo.Box == box)){
				DeviceTmp.push(DeviceList[i]);
			}
		}
		
	}
	res.json(DeviceTmp);
}