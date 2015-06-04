var express = require('express');
var router  = express.Router();
var DeviceList = require('../modules/DeviceList');
var AlarmList = require('../modules/AlarmList');


exports.index = function(req, res, next){
	res.render('AppCurrStatusQuery');
};

exports.queryApp = function(req, res, next){
	var data = req.body;
	var appname = data.appname;
	var devicetype = data.devicetype;
	var subsys = data.subsys;
	var alarmstatus = data.alarmstatus;
	var DeviceTmp1 = new Array();
	var DeviceTmp2 = new Array();
	var DeviceTmp3 = new Array();
	var DeviceTmp4 = new Array();
	if(alarmstatus == "ON"){//这种情况，要传到json中的信息从报警数组AlarmList中获取
		//根据软件报警项查询
		for(var i=0; i < AlarmList.length; i ++){
			if((AlarmList[i].Status == "True") &&(AlarmList[i].Source.length == 5)){
				var Ip = new Array(AlarmList[i].Source[0]);
				var tmp = {
					device:{
						AppModules:[
							{
								Name:AlarmList[i].Source[2],
								AlarmStatus:"ON"
							}
						],
						DeviceInfo:{
							DeviceType:AlarmList[i].DeviceType
						},
						Ip:Ip,
						SubSys:AlarmList[i].SubSys,
						AlarmItem:AlarmList[i].Source[1],
						Infact:AlarmList[i].Source[3],
						Thr:AlarmList[i].Source[4],
						Desc:AlarmList[i].Desc,
						Solution:AlarmList[i].Solution
					},
					index:0
				}
				DeviceTmp1.push(tmp);
			}
		}
		//根据软件所属设备所属的子系统查询
		if(subsys != ""){
			for(var i=0; i < DeviceTmp1.length; i ++){
				if(DeviceTmp1[i].device.SubSys == subsys){
					DeviceTmp2.push(DeviceTmp1[i]);
				}
			}
		}else{
			DeviceTmp2 = DeviceTmp1;
		}
		//根据软件所属的设备的设备类型查询
		if(devicetype != ""){
			for(var i=0; i < DeviceTmp2.length; i ++){
				if(DeviceTmp2[i].device.DeviceInfo.DeviceType == devicetype){
					DeviceTmp3.push(DeviceTmp2[i]);
				}
			}
		}else{
			DeviceTmp3 = DeviceTmp2;
		}
		//根据软件的名字查询
		if(appname != ""){
			for(var i=0; i < DeviceTmp3.length; i ++){
				var index = DeviceTmp3[i].index;
				if(DeviceTmp3[i].device.AppModules[index].Name == appname){
					DeviceTmp4.push(DeviceTmp3[i]);
				}
			}
		}else{
			DeviceTmp4 = DeviceTmp3;
		}
	}else{//这种情况，要传到json中的信息从设备数组DeviceList中获取
		//根据软件报警项查询
		if(alarmstatus == "OFF"){
			for(var i = 0; i < DeviceList.length; i ++){
				for(var j=0; j < DeviceList[i].AppModules.length; j ++){
					if(DeviceList[i].AppModules[j].AlarmStatus == alarmstatus){
						var tmp = {//这里重新构造一种数据形式，因为要有一个index来标示这个APP在设备中的顺序
							device:DeviceList[i],
							index:j
						}
						DeviceTmp1.push(tmp);
					}
				}
			}
		}else if(alarmstatus == ""){
			for(var i = 0; i < DeviceList.length; i ++){
				for(var j=0; j < DeviceList[i].AppModules.length; j ++){
					var tmp = {
						device:DeviceList[i],
						index:j
					}
					DeviceTmp1.push(tmp);
				}
			}
		}
		//根据软件所属设备所属的子系统查询
		if(subsys != ""){
			for(var i=0; i < DeviceTmp1.length; i ++){
				if(DeviceTmp1[i].device.SubSys == subsys){
					DeviceTmp2.push(DeviceTmp1[i]);
				}
			}
		}else{
			DeviceTmp2 = DeviceTmp1;
		}
		//根据软件所属的设备的设备类型查询
		if(devicetype != ""){
			for(var i=0; i < DeviceTmp2.length; i ++){
				if(DeviceTmp2[i].device.DeviceInfo.DeviceType == devicetype){
					DeviceTmp3.push(DeviceTmp2[i]);
				}
			}
		}else{
			DeviceTmp3 = DeviceTmp2;
		}
		//根据软件的名字查询
		if(appname != ""){
			for(var i=0; i < DeviceTmp3.length; i ++){
				var index = DeviceTmp3[i].index;
				if(DeviceTmp3[i].device.AppModules[index].Name == appname){
					DeviceTmp4.push(DeviceTmp3[i]);
				}
			}
		}else{
			DeviceTmp4 = DeviceTmp3;
		}
	}
	
	res.json(DeviceTmp4);
}