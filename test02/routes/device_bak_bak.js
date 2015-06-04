var express = require('express');
var router  = express.Router();
var libxmljs = require('libxmljs');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var subSystems = require('../modules/subSystems');
// var obj2string01 = require('./lib/obj2string01')

//数组：设备列表
var DeviceList = new Array();

/* GET DeviceCurrStatusQuery page. */
exports.index = function(req, res, next){
	res.render('DeviceCurrStatusQuery');
};

/*先前用于和小姚程序通信进行压力测试的处理方法*/
var i=0;
exports.xml = function(req, res, next){
	console.log(req.body);
	if (i%100==0) {
		console.log(Date.now());
	}
	i++;		
	res.send('success');
	/*如果不返回res.send或res.json或res.render，客户端会被挂起并最终导致超时
	或者调用next()方法，那么执行流就会被传递到下一个路由处理器或者是中间件
	next()方法或者res.XX方法只能存在一个*/
};

//粗糙的测试例子：将小姚的xml用libxmljs库解析，并将每条设备信息（包含各个相关“字段”)存到DeviceList数组中
exports.saveDevice = function(req, res, next){

	//测试发送系统信息start--------------------
	var test02 = '<Msg>'+
					'<Head>'+
						'<Version>1</Version>'+
						'<Date>2014-08-06</Date>'+
						'<Time>16:21:30</Time>'+
						'<MsgType>SendSysInfo</MsgType>'+
					'</Head>'+
					'<SysInfo>'+
						'<CpuTemp>50</CpuTemp>'+
						'<HwTemp>45</HwTemp>'+
						'<FanRpm>1700</FanRpm>'+
						'<CpuUsage>30</CpuUsage>'+
						'<MemUsage>340</MemUsage>'+
						'<Network>'+
							'<IP>192.168.0.1</IP>'+
							'<Usage>30%</Usage>'+
						'</Network>'+
						'<Network>'+
							'<IP>192.168.0.2</IP>'+
							'<Usage>40%</Usage>'+
						'</Network>'+
						'<Network>'+
							'<IP>192.168.0.222</IP>'+
							'<Usage>50%</Usage>'+
						'</Network>'+
						'<Process>'+
							'<Name>QQ.exe</Name>'+
							'<ThreadNum>100</ThreadNum>'+
							'<HandleNum>100</HandleNum>'+
							'<IORead>100</IORead>'+
							'<IOWrite>100</IOWrite>'+
							'<IOReadByte>100</IOReadByte>'+
							'<IOWriteByte>100</IOWriteByte>'+
						'</Process>'+
					'</SysInfo>'+
				'</Msg>';
	var xmlDoc02 = libxmljs.parseXml(test02);
	var IPchild  = xmlDoc02.find('//IP');
	var IPall=null;
	for(var i=0; i < IPchild.length; i++){
		if(i === 0){
			IPall = IPchild[i].text() + '/';
		}
		else if(i === IPchild.length-1){
			IPall = IPall + IPchild[i].text();
		}
		else{
			IPall = IPall + IPchild[i].text() + '/';
		}
  	};
  	var Usagechild  = xmlDoc02.find('//Usage');
	var Usageall=null;
	for(var i=0; i < Usagechild.length; i++){
		if(i === 0){
			Usageall = Usagechild[i].text() + '/';
		}
		else if(i === Usagechild.length-1){
			Usageall = Usageall + Usagechild[i].text();
		}
		else{
			Usageall = Usageall + Usagechild[i].text() + '/';
		}
  	};
  	var time = xmlDoc02.get('//Date').text() +' '+ xmlDoc02.get('//Time').text();
  	var device02 = {
  		name:'test02',
  		ID:'12',
  		time:time.toString(),
  		IPstatus:{
	  			
  			},
  		IPusage:{
	  			ip:IPall.toString(),
	  			usage:Usageall.toString()
  		},
  		LOCKstatus:{
			
		},
  		DEVICEstatus:{
  			CpuTemp:xmlDoc02.get('//CpuTemp').text(),
  			HwTemp:xmlDoc02.get('//HwTemp').text(),
  			FanRpm:xmlDoc02.get('//FanRpm').text(),
  			CpuUsage:xmlDoc02.get('//CpuUsage').text(),
  			MemUsage:xmlDoc02.get('//MemUsage').text()
  		},
  		APPmodules:{
  			name:xmlDoc02.get('//Name').text(),
  			ThreadNum:xmlDoc02.get('//ThreadNum').text(),
  			HandleNum:xmlDoc02.get('//HandleNum').text(),
  			IORead:xmlDoc02.get('//IORead').text(),
  			IOWrite:xmlDoc02.get('//IOWrite').text(),
  			IOReadByte:xmlDoc02.get('//IOReadByte').text(),
  			IOWriteByte:xmlDoc02.get('//IOWriteByte').text()
  		}
  	};
  	var flag = false;
  	if(xmlDoc02.get('//MsgType').text() === 'SendSysInfo'){
  		for(var i=0; i<DeviceList.length; i++){
  			if(DeviceList[i].IPusage.ip === IPall.toString()){
  				flag = true;
  				device02.IPstatus = DeviceList[i].IPstatus;
  				device02.LOCKstatus = DeviceList[i].LOCKstatus;
  				DeviceList.splice(i, 1, device02);
  			}
  		}
  		if(flag == false){
  			DeviceList.push(device02);
  		}
  	}
  	console.log(DeviceList.length);
	for(i=0;i<DeviceList.length;i++){
		console.log(DeviceList[i]);
	}
	//测试发送系统信息 end------------------------

	var tmp = obj2str(req.body);
	var result = tmp.substring(39, tmp.length-1);
	
	  // '<?xml version:"1.0" encoding="UTF-8"?>'+
    var test01 ='     <Msg>'+
					'<Head>'+
						'<Version>1.0</Version>'+
						'<MsgType>PingStatusReport</MsgType>'+
					'</Head>'+
					'<Ping>'+
						'<DeviceIp>172.18.2.107</DeviceIp>'+
						'<PingStatus>True</PingStatus>'+
					'</Ping>'+
				'</Msg>';
	// console.log('-----------------');
	// console.log(result);
	// console.log('-----------------');
	var xmlDoc01 = libxmljs.parseXml(result);
	var MsgType = xmlDoc01.get('//MsgType').text();
	var IP = xmlDoc01.get('//DeviceIp').text();
	var PingStatus = xmlDoc01.get('//PingStatus').text();
	console.log('MsgType:' + MsgType + ' IP:'+ IP + ' PingStatus:' + PingStatus);
	var device01 = {
			name:"test01",
			ID:'11',
			time:"2014-08-05 16:21:30",
			IPstatus:{
	  			IP:IP.toString(),
	  			netStatus:libxmljs.parseXml(result).get('//PingStatus').text()
  			},
  			IPusage:{

  			},
  			LOCKstatus:{
			
			},
  			DEVICEstatus:{
  			
  			},
	  		APPmodules:{
		  			
	  		}
  		}
  	var flag = false;
	if(MsgType == 'PingStatusReport'){
		for(var i=0; i<DeviceList.length; i++){
			//之前该数组中存过该设备的基本信息时
			if((DeviceList[i].IPusage.ip != null) && (DeviceList[i].IPusage.ip.toString().indexOf(IP.toString()) != -1)){
				//且存过该IP的ping状态时
				if((DeviceList[i].IPstatus.IP != null) && (DeviceList[i].IPstatus.IP.toString().indexOf(IP.toString()) != -1)){
					flag = true;
					//把除Ping状态之外的基本信息取到
					device01.IPusage = DeviceList[i].IPusage;
					device01.LOCKstatus = DeviceList[i].LOCKstatus;
					device01.DEVICEstatus = DeviceList[i].DEVICEstatus;
					device01.APPmodules = DeviceList[i].APPmodules;
					device01
				}
				flag = true;
				device01.IPusage = DeviceList[i].IPusage;
				device01.LOCKstatus = DeviceList[i].LOCKstatus;
				device01.DEVICEstatus = DeviceList[i].DEVICEstatus;
				device01.APPmodules = DeviceList[i].APPmodules;
				DeviceList.splice(i, 1, device01);
			}
			//之前数组中存过该IP的ping信息，但是没存过该设备的基本信息时
			if((DeviceList[i].IPstatus.IP != null) && (DeviceList[i].IPstatus.IP.toString().indexOf(IP.toString()) != -1) && (DeviceList[i].IPusage.ip == null)){
				flag = true;
				DeviceList.splice(i, 1, device01);
			}
			//之前数组中存过该IP的接收机LOCK状态信息，但是没有
		}
		if(flag == false){
			DeviceList.push(device01);
		}
		
	};
	console.log(DeviceList.length);
	for(i=0;i<DeviceList.length;i++){
		console.log(DeviceList[i]);
	}
	

	//测试发送接收机锁定状态 start------------------------
	var test03 = '<Msg>'+
					'<Head>'+
						'<Version>1.0</Version>'+
						'<Date>2014-08-06</Date>'+
						'<Time>16:21:30</Time>'+
						'<MsgType>LockStatusReport</MsgType>'+
					'</Head>'+
					'<DeviceIp>172.18.2.107</DeviceIp>'+
					'<PortNumber></PortNumber>'+
					'<Status>ON</Status>'+
				'</Msg>';
	var xmlDoc03 = libxmljs.parseXml(test03);
	var time = xmlDoc03.get('//Date').text() +' '+ xmlDoc03.get('//Time').text();
	var IP = xmlDoc03.get('//DeviceIp').text();
	var device03 = {
		name:'test03',
		ID:'13',
		time:time.toString(),
		IPstatus:{
			//接收机状态小姚能返回给我ON 或 OFF，说明IP肯定是通的
  			IP:IP.toString(),
  			netStatus:'True'
  		},
  		IPusage:{

  		},
		LOCKstatus:{
			PortNumber:xmlDoc03.get('//PortNumber').text(),
			Status:xmlDoc03.get('//Status').text()
		},
		DEVICEstatus:{

  		},
  		APPmodules:{

  		}
	}
	// device03.time = xmlDoc03.get('//Date').text() +' '+ xmlDoc03.get('//Time').text();
	var flag = false;
	if(xmlDoc03.get('//MsgType').text() === 'LockStatusReport'){
		for(var i=0; i<DeviceList.length; i++){
			if(((DeviceList[i].IPusage.ip != null) && (DeviceList[i].IPusage.ip.toString().indexOf(IP.toString()) != -1))||((DeviceList[i].IPstatus.IP != null) && (DeviceList[i].IPstatus.IP.toString().indexOf(IP.toString()) != -1))){
				flag = true;
				device03.IPusage = DeviceList[i].IPusage;
				device03.DEVICEstatus = DeviceList[i].DEVICEstatus;
				device03.APPmodules = DeviceList[i].APPmodules;
				DeviceList.splice(i, 1, device03);
			}
		}
		if(flag == false){
			DeviceList.push(device03);
		}
	}
	console.log(DeviceList.length);
	for(i=0;i<DeviceList.length;i++){
		console.log(DeviceList[i]);
	}
	//测试发送接收机锁定状态 end------------------------

	//test start--------------
	// console.log('test-------------');
	// var arr = [];
	// for(var i=0; i<subSystems.length; i++){
	// 	var item = {
	// 	"name":subSystems[i].name,
	// 	"ID":subSystems[i].ID,
	// 	"number":subSystems[i].number,
	// 	"alarmNum":subSystems[i].alarmNum
	// };
	// arr.push(item);
	// }
	// var result = '{"subSystems":['+arr.join()+']}';
	// console.log(result);
	//test end----------------
	res.send('success');
};

exports.test = function(req, res, next){
	var result01 = {
		name:"zhuanma",
		ID:"11",
		number:"76",
		alarmNum:"23"
	};
	var result02 = {
		name:"maliuluzhi",
		ID:"12",
		number:"80",
		alarmNum:"55"
	};
	var result03 = {
		name:'test02',
  		ID:'12',
  		time:'2015-05-08 12:23:33',
  		IPusage:{
  			ip:'1',
  			usage:'20%'
  		}
	}
	var result04 = {
		name:'test04',
  		ID:'14',
  		time:'2015-05-08 12:44:44',
  		IPusage:{
  			ip:'172.0.0.4',
  			usage:'240%'
  		}
	}
	var arr = new Array();
	arr.push(result03);
	arr.push(result04);
	res.json(arr);
}

function obj2str(o){
   var r = [];
   if(typeof o == "string" || o == null) {
     return o;
   }
   if(typeof o == "object"){
     if(!o.sort){
       // r[0]="{"
       for(var i in o){
         r[r.length]=i;
         r[r.length]=":";
         r[r.length]=obj2str(o[i]);
         r[r.length]=",";
       }
       // r[r.length-1]="}"
     }else{
       r[0]="["
       for(var i =0;i<o.length;i++){
         r[r.length]=obj2str(o[i]);
         r[r.length]=",";
       }
       r[r.length-1]="]"
     }
     return r.join("");
   }
   return o.toString();
}

	