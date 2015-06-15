var express = require('express');
var router  = express.Router();
//无数据库，内存存储版本用到的数组对象
var DeviceList = require('../modules/DeviceList');
//以下是mongodb数据库用到的
var Col = require('../mongodb/Col');
var Crud = require('../mongodb/Crud');
/* 
数据库中查询的id要通过 new ObjectId(id) 进行实例化以后的id, 你单单传一个字符串id是一点用都没有的
*/
var ObjectID = require('mongodb').ObjectID;

//初始化crud
var crud;
//新建db并获取
var db = new Col("NetMonitor", function(db){
	//数据库连接完毕...
    //创建一个RESTFUL对象;
    crud = new Crud(db, function(){});
});

exports.index = function(req, res, next){
	res.render('DeviceInfoQuery');
};


//数组版本查询方法
exports.queryDeviceStatus = function(req, res, next){
	var data = req.body;
	var devicename = data.devicename;
	var devicetype = data.devicetype;
	var subsys = data.subsys;
	var deviceIP = data.deviceIP;
	var DeviceTmp1 = new Array();
	if(deviceIP != ""){
	    crud.find("device",{Ip:deviceIP}, function(docs) {
	        DeviceTmp1 = docs;			
	        afterQuery(DeviceTmp1, subsys, devicetype, devicename, res);
	    });
	}else{
		crud.find("device", {}, function(docs){
			DeviceTmp1 = docs;
			afterQuery(DeviceTmp1, subsys, devicetype, devicename, res);
		});
	}
}

function afterQuery(devicetmp1, subsys, devicetype, devicename, res){
	var DeviceTmp2 = new Array();
	if(subsys != ""){
		for(var i=0; i < devicetmp1.length; i ++){
			if(devicetmp1[i].SubSys == subsys){
				DeviceTmp2.push(devicetmp1[i]);
			}
		}
	}else{
		DeviceTmp2 = devicetmp1;
	}
	var DeviceTmp3 = new Array();
	if(devicetype != ""){
		for(var i=0; i < DeviceTmp2.length; i ++){
			if(DeviceTmp2[i].DeviceInfo.DeviceType.toString().indexOf(devicetype) != -1){
				DeviceTmp3.push(DeviceTmp2[i]);
			}
		}
	}else{
		DeviceTmp3 = DeviceTmp2;
	}
	var DeviceTmp4 = new Array();
	if(devicename != ""){
		for(var i=0; i < DeviceTmp3.length; i ++){
			if(DeviceTmp3[i].Name.toString().indexOf(devicename) != -1){
				DeviceTmp4.push(DeviceTmp3[i]);
			}
		}
	}else{
		DeviceTmp4 = DeviceTmp3;
	}
	res.json(DeviceTmp4);
}