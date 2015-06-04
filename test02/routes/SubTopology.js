var express = require('express');
var router  = express.Router();
var DeviceList = require('../modules/DeviceList');
var SubSytemList = require('../modules/SubSystemList');

exports.index = function(req, res, next){
	res.render('SubTopology');
};

// exports.jump = function(req, res, next){
// 	var subsysid = req.body.subsysid;
// 	res.render('Sub')
// }

exports.addDevice = function(req, res, next){
	var data = req.body;
	var deviceId = DeviceList.length;
	//添加的设备是否存在去另外一个函数判断，通过IP地址判断
	var device = {
		Name:data.devicename,
		SubSys:data.subsys,
		Ip:data.deviceIP1,
		DeviceId:deviceId,
		DeviceInfo:{
			DeviceType:data.devicetype,//这里名字随便起，转码服务器
			Room:data.deviceroom,//机房
			Box:data.devicebox,//机柜
			BoxLocation:data.boxlocation,//设备在机柜中的位置
			DeviceHeight:data.deviceheight,//设备高度
			CardLocation:data.cardlocation, //只有插卡类设备才有的参数
			Provider:data.provider,
			Remark:data.remark
		}
	}
	DeviceList.push(device);
	// res.render('SubTopology');
	res.redirect(303, '/SubTopology:10');
}

exports.ShowSubTopCanvas = function(req, res, next){
	var subsysid = req.body.subsysid;
	var subsysname;
	var SubSystem = new Array();
	for(var j=0; j < SubSytemList.length; j ++){
		if(SubSytemList[j].SubSysId == subsysid){
			subsysname = SubSytemList[j].SubSysName;
			break;
		}
	}
	for(var i=0; i < DeviceList.length; i ++){
		if(DeviceList[i].SubSys == subsysname){
			SubSystem.push(DeviceList[i]);
		}
	}
	res.json(SubSystem);
}