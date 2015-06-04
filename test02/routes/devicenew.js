var express = require('express');
var router  = express.Router();
var libxmljs = require('libxmljs');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
// var obj2string01 = require('./lib/obj2string01')

//数组：设备列表
var DeviceList = require('../modules/DeviceList');
//数组：报警列表
var AlarmList = require('../modules/AlarmList');
//Map对象：单个IP地址与设备列表DeviceList之间的映射
var IPTable = require('../modules/IPTable');
//引入子系统数组
var SubSystemList = require('../modules/SubSystemList');
//计数器：用来判断某IP是否已经10次ping不通

//加一条假报警，保证AlarmList不为空
// var ala;
// ala = {
// 	DeviceName:"zhuanma_1",
// 	SubSys:"zhuanma",
// 	DeviceType:'转码服务器',
// 	StartTime:"2015-05-13 14:00:00",
// 	EndTime:"2015-05-13 14:00:10",
// 	Status:"False",
// 	Source:["172.0.0.1", "CpuUsage", "80"]
// }
// AlarmList.push(ala);
//数组：IP及设备信息列表，该数组中每个IP及IP所在的设备信息是一个数组元素
var IPSourceList = new Array();
//报警ID:全局变量
var AlarmId;
//初始的设备报警门限数组
var ThresHold = {
	CpuUsage:50,
	MemUsage:50,
	CputTemp:90,
	NetUsage:20,
	NetStatus:5,
	Process:{
		ThreadNum:10,
		HandleNum:10,
		IOReadByte:20675,
		IOWriteByte:42233
	},
	Count:1 //n次ping不通就告警
}

/* GET DeviceCurrStatusQuery page. */
exports.index = function(req, res, next){
	res.render('DeviceCurrStatusQuery');
};

/*先前用于和小姚程序通信进行压力测试的处理方法*/
var i=0;
exports.xmlPressure = function(req, res, next){
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

//粗糙的测试例子：将小姚的xml用libxmljs库解析
exports.xml = function(req, res, next){

	var tmp = obj2str(req.body);
	console.log(tmp);
	var result = tmp.substring(39, tmp.length-1);
	console.log("--------------------------");
	console.log(result);
	res.send("hello");
}

//并将每条设备信息（包含各个相关“字段”)存到DeviceList数组中，另存一个IPSourceList数组，用来方便判断报警
//这里的设备基本信息、网络连接状态、接收机锁定状态等xml全部自己造假
exports.saveDevice = function(req, res, next){
	//---------------------------start  伪造设备基本信息xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组
	// var tmp = obj2str(req.body);
 //    var result = tmp.substring(39, tmp.length-1);
 //    var xmlDoc = libxmljs.parseXml(result);
	// var MsgType = xmlDoc.get('//MsgType').text();
	if(AlarmList.length > 10000){
		AlarmList.splice(0, 500);
	}
	var tmp = obj2str(req.body);
	var result = tmp.substring(39, tmp.length-1);
	// console.log(result);
	var xmlDoc02 = libxmljs.parseXml(result);
	// var test02 = '<Msg>'+
	// 				'<Head>'+
	// 					'<Version>1</Version>'+
	// 					'<Date>2014-08-06</Date>'+
	// 					'<Time>16:21:30</Time>'+
	// 					'<MsgType>SendSysInfo</MsgType>'+
	// 				'</Head>'+
	// 				'<Type>jieshouji</Type>'+
	// 				'<SysInfo>'+
	// 					'<CpuTemp>50</CpuTemp>'+
	// 					'<HwTemp>45</HwTemp>'+
	// 					'<FanRpm>1700</FanRpm>'+
	// 					'<CpuUsage>30</CpuUsage>'+
	// 					'<MemUsage>340</MemUsage>'+
	// 					'<Network>'+
	// 						'<IP>192.168.0.1</IP>'+
	// 						'<Usage>30%</Usage>'+
	// 					'</Network>'+
	// 					'<Network>'+
	// 						'<IP>192.168.0.2</IP>'+
	// 						'<Usage>40%</Usage>'+
	// 					'</Network>'+
	// 					'<Network>'+
	// 						'<IP>192.168.0.222</IP>'+
	// 						'<Usage>50%</Usage>'+
	// 					'</Network>'+
	// 					'<Process>'+
	// 						'<Name>QQ.exe</Name>'+
	// 						'<ThreadNum>100</ThreadNum>'+
	// 						'<HandleNum>100</HandleNum>'+
	// 						'<IORead>100</IORead>'+
	// 						'<IOWrite>100</IOWrite>'+
	// 						'<IOReadByte>100</IOReadByte>'+
	// 						'<IOWriteByte>100</IOWriteByte>'+
	// 					'</Process>'+
	// 					'<Process>'+
	// 						'<Name>QQ.exe</Name>'+
	// 						'<ThreadNum>88</ThreadNum>'+
	// 						'<HandleNum>99</HandleNum>'+
	// 						'<IORead>88</IORead>'+
	// 						'<IOWrite>99</IOWrite>'+
	// 						'<IOReadByte>101</IOReadByte>'+
	// 						'<IOWriteByte>102</IOWriteByte>'+
	// 					'</Process>'+
	// 				'</SysInfo>'+
	// 			'</Msg>';
	// var xmlDoc02 = libxmljs.parseXml(test02);
	var MsgType = xmlDoc02.get('//MsgType').text();
	if(MsgType === "SendSysInfo"){
		var Id = 1;
		//子系统SubSys
	  	// var SubSys =  xmlDoc02.get('//Type').text(); 
	  	var SubSys = xmlDoc02.get('//SubSystem').text();
		//时间
	  	var Time = xmlDoc02.get('//Date').text() +' '+ xmlDoc02.get('//Time').text();
		//设备的IP,可能有多个，拼接一下，用来监测设备是否存在于DeviceList数组中
		var IPchild  = xmlDoc02.find('//IP');
		var IpArr = new Array();
		for(var i=0; i < IPchild.length; i++){
			IpArr.push(IPchild[i].text());
	  	};
	  	//设备IP的网络利用率
	  	var Usagechild  = xmlDoc02.find('//Usage');
	  	var UsageArr = new Array();
		for(var i=0; i < Usagechild.length; i++){
			UsageArr.push(Usagechild[i].text());
	  	};
	  	//设备基本信息
	  	var DeviceStatus = {
  			CpuTemp:xmlDoc02.get('//CpuTemp').text(),
  			// HwTemp:xmlDoc02.get('//HwTemp').text(),
  			// FanRpm:xmlDoc02.get('//FanRpm').text(),
  			CpuUsage:xmlDoc02.get('//CpuUsage').text(),
  			MemUsage:xmlDoc02.get('//MemUsage').text()
  		}
  		//该设备监测进程的信息
  		var AppName  = xmlDoc02.find('//Name');
	  	var ThreadNum = xmlDoc02.find('//ThreadNum');
	  	var HandleNum = xmlDoc02.find('//HandleNum');
	  	var IORead = xmlDoc02.find('//IORead');
	  	var IOWrite = xmlDoc02.find('//IOWrite');
	  	var IOReadByte = xmlDoc02.find('//IOReadByte');
	  	var IOWriteByte = xmlDoc02.find('//IOWriteByte');
	  	var AppArr = new Array();
	  	for(var i=0; i < ThreadNum.length; i++){
	  		var App = {
	  			Name:AppName[i].text(),
	  			ThreadNum:ThreadNum[i].text(),
	  			HandleNum:HandleNum[i].text(),
	  			IORead:IORead[i].text(),
	  			IOWrite:IOWrite[i].text(),
	  			IOReadByte:IOReadByte[i].text(),
	  			IOWriteByte:IOWriteByte[i].text(),
	  		}
	  		AppArr.push(App);
	  	}
	  	//获取该Type设备的当前数量
	  	var TypeNum = 0;
	  	for(var i=0; i<DeviceList.length; i++){
	  		if(DeviceList[i].SubSys == SubSys.toString() && (DeviceList[i].Ip != IpArr)){
	  			TypeNum ++;
	  		}
	  	}
	  	//在子系统中的Id,因为是新设备，所以Id在原有Type个数的基础上加1
	  	Id = TypeNum + 1;
	  	//设备Name
	  	var Name = SubSys + '_' + Id.toString();
	  	var device02 = {
		  		Name:Name.toString(),
		  		SubSys:SubSys.toString(),
		  		Id:Id,
		  		Time:Time.toString(),
		  		Ip:IpArr,
		  		NetUsage:UsageArr,
		  		DeviceStatus:DeviceStatus,
		  		AppModules:AppArr
	  		};
	  	//遍历DeviceList数组，监测是否该设备已存在
	  	var flagDev = false;//用来标记DeviceList数组中是否已经存过此设备
		for(var i=0; i<DeviceList.length; i++){
			if(DeviceList[i].Ip != undefined){
				var iscontain = checkStrInArray(IpArr[0], DeviceList[i].Ip);
				if(iscontain){
					//如果该设备已经在数组中出现，则更新该数组元素的属性值
					flagDev = true;
					DeviceList[i].Time = Time.toString();
					DeviceList[i].NetUsage = UsageArr;
					DeviceList[i].DeviceStatus = DeviceStatus;
					DeviceList[i].AppModules = AppArr;
					//把所有的监控项判断报警都写到一个方法中去，在这儿调用
					AlarmJudge(DeviceList[i], IpArr);
					break;
				}
			}
		}
		if(flagDev == false){
			/* 如果该设备未存入过数组,则构造一个device01元素，push进数组 */
			DeviceList.push(device02);
			//调用saveIPSource往IPSourceList数组中存IP及设备信息
			saveIPSourceDevice(IpArr, device02);
		}
		if(DeviceList.length == 0){
			//初始化，DeviceList中空无一物时
		  	DeviceList.push(device02);
		  	saveIPSourceDevice(IpArr, device02);
		}
		
	}
	
	//----------------------------end   伪造设备基本信息xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组


	
	

	// ----------------------------start   伪造接收机锁定状态信息xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组
	// var test03 = '<Msg>'+
	// 				'<Head>'+
	// 					'<Version>1.0</Version>'+
	// 					'<Date>2014-08-06</Date>'+
	// 					'<Time>16:21:30</Time>'+
	// 					'<MsgType>LockStatusReport</MsgType>'+
	// 				'</Head>'+
	// 				'<Type>jieshouji</Type>'+
	// 				'<DeviceIp>192.168.0.2</DeviceIp>'+
	// 				/* PortNumber是哈雷接收机特有，1、2、3、4分别是哈雷接收机的一个端口，
	// 				使用的端口都要分别解析锁定状态，分别发送一条xml */
	// 				//一个IP地址如果是哈雷接收机设备，则会有PortNumber个锁定状态
	// 				//非哈雷的接收机，PortNumber值是0
	// 				'<PortNumber>1</PortNumber>'+
	// 				'<Status>OFF</Status>'+
	// 			'</Msg>';
	// var xmlDoc03 = libxmljs.parseXml(test03);
	// var MsgType = xmlDoc03.get('//MsgType').text();
	if(MsgType.toString() === 'LockStatusReport'){
		var Id = 1; 
		var Ip = xmlDoc02.get('//DeviceIp').text();
  		//子系统SubSys
		var SubSys =  xmlDoc02.get('//DeviceType').text();
  		var PortNumber = xmlDoc02.get('//PortNumber').text();
  		var Status = xmlDoc02.get('//Status').text();
  		//时间Time
		var Time = xmlDoc02.get('//Date').text() +' '+ xmlDoc02.get('//Time').text();
		//获取该Type设备的当前数量
	  	var TypeNum = 0;
	  	for(var i=0; i<DeviceList.length; i++){
	  		if(DeviceList[i].SubSys == SubSys.toString() && (!(DeviceList[i].Ip.join().indexOf(Ip)))){
	  			TypeNum ++;
	  		}
	  	}
		var LockStatusArr = new Array();
		var LockStatus = {
				PortNumber:PortNumber.toString(),
				Status:Status.toString()
		}
		//在子系统中的Id
		Id = TypeNum + 1;
		//设备Name
		var Name = SubSys + '_' + Id.toString();
		//Ip地址
		var IpArr = new Array(Ip);
		//能返回锁定状态，说明肯定能Ping通
		var NetStatus = new Array("True");
		//锁定状态LockStatus
		LockStatusArr.push(LockStatus);
		//构造device03
		var device03 = {
			Name:Name.toString(),
			SubSys:SubSys.toString(),
			Id:Id,
			Time:Time.toString(),
			Ip:IpArr,
			NetStatus:NetStatus,
			LockStatus:LockStatusArr
		};
		//遍历DeviceList数组，监测是否该设备已存在
		for(var i=0; i<DeviceList.length; i++){
			//如果这个设备已经存在
  			if(DeviceList[i].Ip != undefined){
  				var iscontain = checkStrInArray(Ip, DeviceList[i].Ip);
  				if(iscontain){
  					//构造LockStatus, 更改DeviceList[i]的元素值
	  				if(PortNumber.toString() == "0"){
	  					//如果非哈雷接收机，LockStatus构造成只包含一个对象的数组
	  					DeviceList[i].LockStatus = LockStatusArr;
	  				}else{//如果哈雷接收机，LockStatus构造成一个可能包含多个对象的数组
	  					var flag = false;
	  					for(var j in DeviceList[i].LockStatus){
	  						if(PortNumber == DeviceList[i].LockStatus[j].PortNumber){
	  							flag = true;
	  							DeviceList[i].LockStatus[j].Status = Status;//这里改了之后，下面就不要再往里放
	  							break;//跳出循环
	  						}
	  					}
	  					if(flag == false){
	  						DeviceList[i].LockStatus = LockStatusArr;
	  					}
	  				}
	  				//更新时间
	  				DeviceList[i].Time = Time.toString();
	  				// 下面对接收机LOCK状态做报警判断，并存入AlarmList数组
					var flagA = false;
					var flagD = false;
					AlarmJudgeLockStatus(Ip, "LockStatus", flagA, flagD, PortNumber);
					//将设备报警状态和子系统报警状态更新
					for(var k=0; k < SubSystemList.length; k ++){
						if(SubSystemList[k].SubSysName == DeviceList[i].SubSys){
							if(flagD == true){
								DeviceList[i].AlarmStatus = "ON";
								SubSystemList[k].AlarmNum = SubSystemList[k].AlarmNum + 1;
							}else{
								DeviceList[i].AlarmStatus = "OFF";
								if(SubSystemList[k].AlarmNum != 0){
									SubSystemList[k].AlarmNum = SubSystemList[k].AlarmNum - 1;
								}
							}
							break;
						}
					}
	  				break;
  				}
  				
  			}
		}
	}
	//------------------------------end   伪造接收机锁定状态信息xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组
	
	// //----------------------------start   伪造设备IP连通状态信息xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组
	// var test01 ='     <Msg>'+
	// 				'<Head>'+
	// 					'<Version>1.0</Version>'+
	// 					'<Date>2014-05-16</Date>'+
	// 					'<Time>07:33:20</Time>'+
	// 					'<MsgType>PingStatusReport</MsgType>'+
	// 				'</Head>'+
	// 				'<Type>jieshouji</Type>'+
	// 				'<Ping>'+
	// 					'<DeviceIp>192.168.0.2</DeviceIp>'+
	// 					'<PingStatus>False</PingStatus>'+
	// 				'</Ping>'+
	// 			'</Msg>';
	// var xmlDoc01 = libxmljs.parseXml(test01);
	// var MsgType = xmlDoc01.get('//MsgType').text();
	if(MsgType.toString() === 'NetStatusReport'){
		//新建一个计数器
		var count = 0;
		console.log(result);
		//设置一个初始Id
		var Id = 1;
		var Ip = xmlDoc02.get('//DeviceIp').text();
  		//子系统SubSys
		var SubSys =  xmlDoc02.get('//DeviceType').text();
  		//时间Time
		var Time = xmlDoc02.get('//Date').text() +' '+ xmlDoc02.get('//Time').text();
		//Ip的ping状态
		var NetStatus = xmlDoc02.get('//PingStatus').text();
		//获取该Type设备的当前数量
	  	var TypeNum = 0;
	  	for(var i=0; i<DeviceList.length; i++){
	  		if(DeviceList[i].SubSys == SubSys.toString() && (!(DeviceList[i].Ip.join().indexOf(Ip)))){
	  			TypeNum ++;
	  		}
	  	}
	  	//在子系统中的Id
		Id = TypeNum + 1;
		//设备Name
		var Name = SubSys + '_' + Id.toString();
		//设备Ip数组
		var IpArr = new Array(Ip);
		var StatusArr = new Array(NetStatus);
		
		//构造device01
		var device01 = {
			Name:Name.toString(),
			SubSys:SubSys.toString(),
			Id:Id,
			Time:Time.toString(),
			Ip:IpArr,
			NetStatus:StatusArr,
			Count:count
		};
	  	//遍历DeviceList数组，监测是否该设备已存在
	  	for(var i=0; i<DeviceList.length; i++){
  			//如果这个设备已经存在
  			if(DeviceList[i].Ip != undefined){
  				var iscontain = checkStrInArray(Ip, DeviceList[i].Ip);
  				if(iscontain){
  					//将IP数组中的第j个IP的ping通状态放入NetStatus数组
	  				var IpNum = DeviceList[i].Ip.length;
	  				var StatusArr = new Array(IpNum);
	  				var IpIndex;
	  				for(var j in DeviceList[i].Ip){
	  					if(Ip == DeviceList[i].Ip[j]){
	  						IpIndex = j;
	  						break;
	  					}
	  				}
	  				StatusArr[IpIndex] = NetStatus;
	  				DeviceList[i].NetStatus = StatusArr;
	  				//生成计数器count
	  				if(DeviceList[i].Count == undefined){
	  					count =0;
	  				}else{
	  					if(NetStatus == "False"){
	  						count = DeviceList[i].Count;
							count ++;
						}else if(NetStatus == "True"){
							count = 0;
						}
	  				}
	  				DeviceList[i].Count = count;
	  				//更新时间
	  				DeviceList[i].Time = Time.toString();
	  				//下面对设备IP状态做报警判断，并存入AlarmList数组
			  		var flagA = false;
			  		var flagD = false;
			  		flagD = AlarmJudgeNetStatus(Ip, "NetStatus", flagA, flagD);
			  		//将设备报警状态和子系统报警状态更新
					if(flagD == true){
						DeviceList[i].AlarmStatus = "ON";
					}else{
						DeviceList[i].AlarmStatus = "OFF";
					}
					// for(var k=0; k < SubSystemList.length; k ++){
					// 	if(SubSystemList[k].SubSysName == DeviceList[i].SubSys){
					// 		if(flagD == true){
					// 			DeviceList[i].AlarmStatus = "ON";
					// 			SubSystemList[k].AlarmNum = SubSystemList[k].AlarmNum + 1;
					// 		}else{
					// 			DeviceList[i].AlarmStatus = "OFF";
					// 			if(SubSystemList[k].AlarmNum != 0){
					// 				SubSystemList[k].AlarmNum = SubSystemList[k].AlarmNum - 1;
					// 			}
					// 		}
					// 		break;
					// 	}
					// }
	  				break;
  				}
  			}
  		}
	}
	// // ----------------------------end   伪造设备IP连通状态信息xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组

	// //----------------------------start   伪造SNMP的xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组
	// var test04 = '<Msg>'+
 //        			'<Head>'+
 //                		'<Version>1.0</Version>'+
 //                		'<MsgType>SnmpTrapReport</MsgType>'+
 //                		'<Date>2015-05-16</Date>'+
 //                		'<Time>19:26:48</Time>'+
 //        			'</Head>'+
 //        			'<Trap>'+
 //                		'<TrapAddress>192.168.0.2</TrapAddress>'+
 //                		'<AlarmType>1112</AlarmType>'+
 //                		'<Desc>coldStart</Desc>'+
 //        			'</Trap>'+
	// 			'</Msg>';
	// var xmlDoc04 = libxmljs.parseXml(test04);
	// var MsgType = xmlDoc02.get('//MsgType').text();
	if(MsgType.toString() === 'SnmpTrapReport'){
		//设置一个初始Id
		var Id = 1;
		var Ip = xmlDoc02.get('//TrapAddress').text();
		//子系统SubSys
		var SubSys =  "jieshouji";
		//时间Time
		var Time = xmlDoc02.get('//Date').text() +' '+ xmlDoc02.get('//Time').text();
		var Desc = xmlDoc02.get('//Desc').text();
		if(MsgType.toString() === 'SnmpTrapReport'){
			for(var i=0; i<DeviceList.length; i++){
	  			//如果这个设备已经存在
	  			if((DeviceList[i].Ip != undefined) && (DeviceList[i].Ip.join('').indexOf(Ip) != -1)){
	  				DeviceList[i].Time = Time.toString();
	  				// DeviceList[i].AlarmStatus = "ON";
	  				AlarmJudgeSNMP(Ip, "SNMP", Desc);
	  			}
	  			break;
	  		}
		}
	}
	
	//----------------------------end   伪造SNMP的xml，解析并存DeviceList数组，IPSourceList数组，判断报警，并存AlarmList数组
	// console.log(DeviceList);
	// console.log(IPTable);
	// console.log(AlarmList);
	res.json("success");
}


function AlarmJudge(device, IpArr){
	//--------------------start 判断设备基本信息的报警状态，并存入AlarmList数组-------------
	//这三种报警没条报警对应一个设备，故可能有多个IP地址

	var flagA = false;//用来标记报警列表中是否存在该设备&&该报警类型的报警
	var flagD = false;//用来标记此条xml中，要监控的项目中是否有项目符合报警条件
	flagD = AlarmJudgeDevice(device, "CpuUsage", flagA, flagD);
	flagA = false;
	flagD = AlarmJudgeDevice(device, "MemUsage", flagA, flagD);
	flagA = false;
	flagD = AlarmJudgeDevice(device, "CpuTemp", flagA, flagD);

	//比较 特殊的网络使用率的报警判断 start------------
	//需要把此设备的所有网口利用率都判断一遍，每条报警只对应一个IP地址
	for(var h=0; h < IpArr.length; h ++){
		flagA = false;
		flagD = AlarmJudgeNetUsage(IpArr[h].toString(), h, "NetUsage", flagA, flagD);
	}
	//比较 特殊的网络使用率的报警判断 end--------------

	//判断设备上进程相关监控项的报警，对于监控多个进程的，每个进程都要判断一次------
	for(var h=0; h < device.AppModules.length; h++){
		var flagAPP = false;
		flagA = false;
		var Flag;
		Flag = AlarmJudgeModuleB(device, "ThreadNum", h, flagA, flagD, flagAPP);//B方法是判断>时报警
		flagD = Flag[0];
		flagAPP = Flag[1];
		flagA = false;
		Flag = AlarmJudgeModuleB(device, "HandleNum", h, flagA, flagD, flagAPP);
		flagD = Flag[0];
		flagAPP = Flag[1];
		flagA = false;
		Flag = AlarmJudgeModuleL(device, "IOReadByte", h, flagA, flagD, flagAPP);//L方法是判断<时报警
		flagD = Flag[0];
		flagAPP = Flag[1];
		flagA = false;
		Flag = AlarmJudgeModuleL(device, "IOWriteByte", h, flagA, flagD, flagAPP);
		flagD = Flag[0];
		flagAPP = Flag[1];
		if(flagAPP == true){
			device.AppModules[h].AlarmStatus = "ON";
		}else{
			device.AppModules[h].AlarmStatus = "OFF";
		}
	}

	//对设备和子系统的报警状态进行更新
	if(flagD == true){
		device.AlarmStatus = "ON";
	}else{
		device.AlarmStatus = "OFF";
	}
	// for(var k=0; k < SubSystemList.length; k ++){
	// 	if(SubSystemList[k].SubSysName == device.SubSys){
	// 		if(flagD == true){
	// 			device.AlarmStatus = "ON";
	// 			SubSystemList[k].AlarmNum = SubSystemList[k].AlarmNum + 1;
	// 		}else{
	// 			device.AlarmStatus = "OFF";
	// 			if(SubSystemList[k].AlarmNum != 0){
	// 				SubSystemList[k].AlarmNum = SubSystemList[k].AlarmNum + 1;
	// 			}
	// 		}
	// 		break;
	// 	}
	// }
	
	//判断设备上进程相关监控项的报警，对于监控多个进程的，每个进程都要判断一次------

	//--------------------end 判断设备基本信息的报警状态，并存入AlarmList数组-------------
}

//遍历IPSourceList数组，监测该IP所在的设备信息是否已存在
function saveIPSourceDevice(iparr, device){
	
	for(var x=0; x < iparr.length; x ++){
		//对该xml传来的ip地址遍历
		// for(var j=0; j < IPTable.elements.length; j ++){
		// 	if(IPTable.elements[j].key == iparr[x]){
		// 		//如果IP数组中已经存在该IP地址
		// 		var index = IPTable[iparr[x].toString()];//得到该IP对应的device在数组DeviceList中的序号
		// 		var device = DeviceList[index];
		// 		device.NetUsage = 
		// 	}
		// }
		var ipStr = iparr[x].toString();
		var index = IPTable[ipStr];
		if(index === undefined){
			//如果IPTable中还不存在ip1,那么，加进去
			IPTable[ipStr] = DeviceList.length-1;
		}
	}
}

//遍历IPSourceList数组，监测该IP所在的设备信息是否已存在
function saveIPSourceSingle(ip, device, flag, isContain){
	for(var j=0; j < IPSourceList.length; j ++){
		if(IPSourceList[j].Ip == ip){
			//如果IP数组中已经存在该IP地址
			IPSourceList[j].Source.Time = device.Time.toString();
			if(isContain == false){//这种情况是Id和Name都改变的情况
				IPSourceList[j].Source.Id = device.Id;
				IPSourceList[j].Source.Name = device.Name.toString();
			}
			IPSourceList[j].Source.NetStatus = device.NetStatus.toString();
			IPSourceList[j].Source.Count = device.Count;
			flag = true;
			break;
		}
	}
	if(flag == false){
		//如果IP数组总还没有该IP地址
		//来个device的中间量
		var deviceTmp = {
			Name:device.Name.toString(),
			SubSys:device.SubSys.toString(),
			Id:device.Id,
			Time:device.Time.toString(),
			Ip:device.Ip,
			NetStatus:device.NetStatus
		};
		var IPSource = {
				Ip:ip.toString(),
				Source:deviceTmp
			}
		IPSource.Source.Ip = ip.toString();
		IPSource.Source.NetStatus = device.NetStatus.toString();
		IPSourceList.push(IPSource);
	}
	if(IPSourceList.length == 0){
		var deviceTmp = {
			Name:device.Name.toString(),
			SubSys:device.SubSys.toString(),
			Id:device.Id,
			Time:device.Time.toString(),
			Ip:device.Ip,
			NetStatus:device.NetStatus
		};
		var IPSource = {
				Ip:ip.toString(),
				Source:deviceTmp
			}
		IPSource.Source.Ip = ip.toString();
		IPSource.Source.NetStatus = device.NetStatus.toString();
		IPSourceList.push(IPSource);
	}
}

//针对于接收机，遍历IPSourceList数组，监测该IP所在的设备信息是否已存在，如果存在，更新端口号及锁定状态
function saveIPSourceLock(ip, device, flag, portnumber){
	var index = IPTable[ip];
	var device = DeviceList[index];
}

//判断设备报警监控项，并存入AlarmList数组，这里报警门限暂时使用初始化门限ThresHold数组
function AlarmJudgeDevice(device, alarmtype, flag, flagD){
	//遍历整个报警数组，从后往前，针对设备基本信息报警
	for(var i=AlarmList.length-1; i != -1; i --){
		var iscontain = checkStrInArray(AlarmList[i].Source[0], device.Ip);
		if(iscontain && (AlarmList[i].Source[1] == alarmtype)){//报警列表中已存在
			flag = true;
			if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
				if(parseInt(device.DeviceStatus[alarmtype]) < device.ThresHold[alarmtype]){////此刻CpuUsage恢复正常数值
					AlarmList[i].Status = "False";//让报警状态为不报警
					AlarmList[i].endTime = device.Time.toString();//更新报警结束时间
					JudgeAlarmItemR(device, alarmtype);
				}else{
					flagD = true;
					JudgeAlarmItem(device, alarmtype);
				}
				AlarmList[i].Source[2] = device.DeviceStatus[alarmtype].toString();//如果此刻CpuUsage过高，则只需要更新报警实时数值
			}else{//此条报警为“已经报警结束”状态
				if(parseInt(device.DeviceStatus[alarmtype]) > device.ThresHold[alarmtype]){//此刻CpuUsage值过高，则加入一条新的报警信息
					alarmForDevice(device, alarmtype);
					flagD = true;
					JudgeAlarmItem(device, alarmtype);
				}else{
					JudgeAlarmItemR(device, alarmtype);
				}
			}
			break;
		}
	}
	//flag = false:如果报警列表中不存在这个设备的该监控项的基本信息报警
	if(flag == false){
		if(parseInt(device.DeviceStatus[alarmtype]) > device.ThresHold[alarmtype]){
			alarmForDevice(device, alarmtype);
			flagD = true;
			JudgeAlarmItem(device, alarmtype);
		}else{
			JudgeAlarmItemR(device, alarmtype);
		}
	}
	return flagD;
}

//判断设备IP的使用率，并存入AlarmList数组，这里报警门限暂时使用初始化门限ThresHold数组
function AlarmJudgeNetUsage(ip, x, alarmtype, flag, flagD){
	//但是这里可能会有隐患，就是IPSourceList中还没有把所有IP及相关信息存储进去，那么会导致用ip去遍历IPSourceList却找不到ip
	var source;
	var index = IPTable[ip];
	source = DeviceList[index];
	//下面根据报警门限做报警判断，并存储报警数组AlarmList
	//遍历整个报警数组，从后往前，针对设备基本信息报警中的网口利用率报警，此种报警一个IP地址对应一条
	for(var i=AlarmList.length-1; i != -1; i --){
		if(ip == AlarmList[i].Source[0] && (AlarmList[i].Source[1] == alarmtype)){//报警列表中已存在
			flag = true;
			if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
				if(parseInt(source[alarmtype][x]) < source.ThresHold[alarmtype]){////此刻网络利用率恢复正常数值
					AlarmList[i].Status = "False";//让报警状态为不报警
					AlarmList[i].endTime = source.Time.toString();//更新报警结束时间
					JudgeAlarmItemR(source, alarmtype);
				}else{
					AlarmList[i].Source[2] = source[alarmtype][x].toString();//如果此刻网络利用率过高，则只需要更新报警实时数值
					flagD = true;
					JudgeAlarmItem(source, alarmtype);
				}
			}else{//此条报警为“已经报警结束”状态
				if(parseInt(source[alarmtype][x]) > source.ThresHold[alarmtype]){//此刻网络利用率过高，则加入一条新的报警信息
					alarmForNetUsage(source, x, alarmtype);
					flagD = true;
					JudgeAlarmItem(source, alarmtype);
				}else{
					JudgeAlarmItemR(source, alarmtype);
				}
			}
			break;
		}
	}
	//报警列表中未存储这个设备的NetUsage报警
	if(flag == false){
		if(parseInt(source[alarmtype][x]) > source.ThresHold[alarmtype]){//此刻NetUsage值过高，则加入一条新的报警信息
			alarmForNetUsage(source, x, alarmtype);
			flagD = true;
			JudgeAlarmItem(source, alarmtype);
		}else{
			JudgeAlarmItemR(source, alarmtype);
		}
	}
	return flagD;
}

//当符合报警门限时，判断设备数组AlarmItem项中是否包含该监控项
function JudgeAlarmItem(device, alarmtype){
	if(device.AlarmItem != undefined){
		if(device.AlarmItem.length != 0){
			if(device.AlarmItem.join().indexOf(alarmtype) == -1){
				device.AlarmItem.push(alarmtype);
			}
		}
	}else{
		var alarmitem = new Array(alarmtype);
		device.AlarmItem = alarmitem;
	}
}

//当不符合报警门限时，判断设备数组AlarmItem项中是否包含该监控项
function JudgeAlarmItemR(device, alarmtype){
	if(device.AlarmItem != undefined){
		if(device.AlarmItem.length != 0){
			for(var f=0; f < device.AlarmItem.length; f ++){
				if(device.AlarmItem[f] == alarmtype){
					device.AlarmItem.splice(f, 1);
					break;
				}
			}
		}
		
	}
}




//判断设备IP的连通状态，并存入AlarmList数组，这里，当连续10次ping不通时才存入AlarmList数组
function AlarmJudgeNetStatus(ip, alarmtype, flag, flagD){
	//但是这里可能会有隐患，就是IPSourceList中还没有把所有IP及相关信息存储进去，那么会导致用ip去遍历IPSourceList却找不到ip
	var source;
	var index = IPTable[ip];
	source = DeviceList[index];
	//下面根据报警门限做报警判断，并存储报警数组AlarmList
	//遍历整个报警数组，从后往前，针对设备基本信息报警中的网口利用率报警，此种报警一个IP地址对应一条
	for(var i=AlarmList.length-1; i != -1; i --){
		if(ip == AlarmList[i].Source[0] && (AlarmList[i].Source[1] == alarmtype)){//报警列表中已存在
			flag = true;
			if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
				if(parseInt(source.Count) < source.ThresHold[alarmtype]){
					AlarmList[i].Status = "False";//让报警状态为不报警
					AlarmList[i].endTime = source.Time.toString();//更新报警结束时间
					JudgeAlarmItemR(source, alarmtype);
				}else{
					AlarmList[i].Source[2] = source.Count;//如果此刻CpuUsage过高，则只需要更新报警实时数值
					falgD = true;
					JudgeAlarmItem(source, alarmtype);
				}
			}else{//此条报警为“已经报警结束”状态
				if(parseInt(source.Count) > parseInt(source.ThresHold[alarmtype]-1)){//此刻CpuUsage值过高，则加入一条新的报警信息
					alarmForNetStatus(source, alarmtype);
					flagD = true;
					JudgeAlarmItem(source, alarmtype);
				}else{
					JudgeAlarmItemR(source, alarmtype);
				}
			}
			break;
		}
	}
	//报警列表中未存储这个设备的NetUsage报警
	if(flag == false){
		if(parseInt(source.Count) > parseInt(source.ThresHold[alarmtype]-1)){
			alarmForNetStatus(source, alarmtype);
			flagD = true;
			JudgeAlarmItem(source, alarmtype);
		}else{
			JudgeAlarmItemR(source, alarmtype);
		}
	}
	return flagD;
}

//对进程的报警判断,>时报警
function AlarmJudgeModuleB(device, alarmtype, x, flag, flagD, flagAPP){//x是进程在设备列表该设备元素数组中的序号
	//遍历整个报警数组，从后往前，针对设备基本信息报警
	for(var i=AlarmList.length-1; i != -1; i --){
		var iscontain = checkStrInArray(AlarmList[i].Source[0], device.Ip);
		if(iscontain && (AlarmList[i].Source[1] == alarmtype) && (AlarmList[i].Source[2] == device.AppModules[x].Name)){//报警列表中已存在
			flag = true;
			if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
				if(parseInt(device.AppModules[x][alarmtype]) < device.ThresHold.AppModules[x][alarmtype]){////此刻ThreadNumber恢复正常数值
					AlarmList[i].Status = "False";//让报警状态为不报警
					AlarmList[i].endTime = device.Time.toString();//更新报警结束时间
					JudgeAlarmItemR(device, alarmtype);
				}else{
					flagD = true;
					JudgeAlarmItem(device, alarmtype);
					flagAPP = true;
				}
				AlarmList[i].Source[3] = device.AppModules[x][alarmtype].toString();//如果此刻CpuUsage过高，则只需要更新报警实时数值
			}else{//此条报警为“已经报警结束”状态
				if(parseInt(device.AppModules[x][alarmtype]) > device.ThresHold.AppModules[x][alarmtype]){//此刻CpuUsage值过高，则加入一条新的报警信息
					alarmForModule(device, alarmtype, x);
					flagD = true;
					JudgeAlarmItem(device, alarmtype);
					flagAPP = true;
				}else{
					JudgeAlarmItemR(device, alarmtype);
				}
			}
			break;
		}
	}
	//报警列表中未存储这个设备的这个进程的例如ThreadNum报警
	if(flag == false){
		if(parseInt(device.AppModules[x][alarmtype]) > device.ThresHold.AppModules[x][alarmtype]){//此刻ThreadNum值过高，则加入一条新的报警信息
			alarmForModule(device, alarmtype, x);
			flagD = true;
			JudgeAlarmItem(device, alarmtype);
			flagAPP = true;
		}else{
			JudgeAlarmItemR(device, alarmtype);
		}
	}
	var Flag = new Array(flagD, flagAPP);
	return Flag;
}

//对进程的报警判断,<时报警
function AlarmJudgeModuleL(device, alarmtype, x, flag, flagD, flagAPP){//x是进程在设备列表该设备元素数组中的序号
	//遍历整个报警数组，从后往前，针对设备基本信息报警
	for(var i=AlarmList.length-1; i != -1; i --){
		var iscontain = checkStrInArray(AlarmList[i].Source[0], device.Ip);
		if(iscontain && (AlarmList[i].Source[1] == alarmtype) && (AlarmList[i].Source[2] == device.AppModules[x].Name)){//报警列表中已存在
			flag = true;
			if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
				if(parseInt(device.AppModules[x][alarmtype]) > device.ThresHold.AppModules[x][alarmtype]){////此刻CpuUsage恢复正常数值
					AlarmList[i].Status = "False";//让报警状态为不报警
					AlarmList[i].endTime = device.Time.toString();//更新报警结束时间
					JudgeAlarmItemR(device, alarmtype);
				}else{
					flagD = true;
					JudgeAlarmItem(device, alarmtype);
					flagAPP = true;
				}
				AlarmList[i].Source[3] = device.AppModules[x][alarmtype].toString();//如果此刻CpuUsage过高，则只需要更新报警实时数值
			}else{//此条报警为“已经报警结束”状态
				if(parseInt(device.AppModules[x][alarmtype]) < device.ThresHold.AppModules[x][alarmtype]){//此刻CpuUsage值过高，则加入一条新的报警信息
					alarmForModule(device, alarmtype, x);
					flagD = true;
					JudgeAlarmItem(device, alarmtype);
					flagAPP = true;
				}else{
					JudgeAlarmItemR(device, alarmtype);
				}
			}
			break;
		}
	}
	//报警列表中未存储这个设备的这个进程的例如ThreadNum报警
	if(flag == false){
		if(parseInt(device.AppModules[x][alarmtype]) < device.ThresHold.AppModules[alarmtype]){//此刻ThreadNum值过高，则加入一条新的报警信息
			alarmForModule(device, alarmtype, x);
			flagD = true;
			JudgeAlarmItem(device, alarmtype);
			flagAPP = true;
		}else{
			JudgeAlarmItemR(device, alarmtype);
		}
	}
	var Flag = new Array(flagD, flagAPP);
	return Flag;
}

//判断接收机的锁定状态，并存入AlarmList数组
function AlarmJudgeLockStatus(ip, alarmtype, flag, flagD, portnumber){
	//但是这里可能会有隐患，就是IPSourceList中还没有把所有IP及相关信息存储进去，那么会导致用ip去遍历IPSourceList却找不到ip
	var source;
	var index = IPTable[ip];
	source = DeviceList[index]; 
	//下面根据报警门限做报警判断，并存储报警数组AlarmList
	//遍历整个报警数组，从后往前，针对设备基本信息报警中的网口利用率报警，此种报警一个IP地址对应一条
	for(var i=AlarmList.length-1; i != -1; i --){
		if(ip == AlarmList[i].Source[0] && (AlarmList[i].Source[1] == alarmtype) && (AlarmList[i].Source[2] == portnumber)){//报警列表中已存在
			flag = true;
			for(var x=0; x < source[alarmtype].length; x ++){
				if(source[alarmtype][x].PortNumber == portnumber){//如果传入的portnumber参数和LOckStatus数组中的相等
					if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
							if(source[alarmtype][x].Status == "ON"){//接收机已锁定，则结束报警
								AlarmList[i].Status = "False";//让报警状态为不报警
								AlarmList[i].endTime = device.Time.toString();//更新报警结束时间
								JudgeAlarmItemR(source, alarmtype);
						}else{
							fladD = true;
							JudgeAlarmItem(source, alarmtype);
						}
					}else{
						//此条报警已经结束
						if(source[alarmtype][x].Status == "OFF"){//接收机未锁定，新建一条报警存入数组
							alarmForLock(source, alarmtype, portnumber);
							fladD = true;
							JudgeAlarmItem(source, alarmtype);
						}else{
							JudgeAlarmItemR(source, alarmtype);
						}
					}
				}
				break;
			}
		}
	}
	//报警列表中未存储这个设备的NetUsage报警
	if(flag == false){
		for(var x=0; x < source[alarmtype].length; x ++){
			if(source[alarmtype][x].PortNumber == portnumber){//找到该端口
				if(source[alarmtype][x].Status == "OFF"){//而且如果该端口锁不定，则加入一条新的报警信息
					alarmForLock(source, alarmtype, portnumber);
					fladD = true;
					JudgeAlarmItem(source, alarmtype);
				}else{
					JudgeAlarmItemR(source, alarmtype);
				}
				break;
			}
		}
	}
}

//SNMP报警逻辑判断
function AlarmJudgeSNMP(ip, alarmtype, desc){
	var index = IPTable[ip];
	var device = DeviceList[index];
	alarmForSNMP(device, alarmtype, desc);
}

function alarmForSNMP(device, alarmtype, desc){
	var SourceArr = new Array();
	SourceArr.push(device.Ip.toString()),
	SourceArr.push(alarmtype);
	SourceArr.push(desc);
	alarm = {
		DeviceName:device.Name.toString(),
		SubSys:device.SubSys.toString(),
		DeviceType:device.DeviceInfo.DeviceType.toString(),
		StartTime:device.Time.toString(),
		Status:"True",
		Room:device.DeviceInfo.Room,
		Box:device.DeviceInfo.Box,
		BoxLocation:device.DeviceInfo.BoxLocation,
		DeviceHeight:device.DeviceInfo.DeviceHeight,
		Source:SourceArr
	};
	AlarmList.push(alarm);
}

//为设备报警使用的，构造一条报警出来
function alarmForDevice(device, alarmtype){
	var SourceArr = new Array();
	SourceArr.push(device.Ip.join('/')),
	SourceArr.push(alarmtype);
	SourceArr.push(device.DeviceStatus[alarmtype]);
	var time = device.Time.toString();
	alarm = {
		DeviceName:device.Name.toString(),
		SubSys:device.SubSys.toString(),
		DeviceType:device.DeviceInfo.DeviceType.toString(),
		StartTime:time,
		Status:"True",
		Room:device.DeviceInfo.Room,
		Box:device.DeviceInfo.Box,
		BoxLocation:device.DeviceInfo.BoxLocation,
		DeviceHeight:device.DeviceInfo.DeviceHeight,
		Source:SourceArr
	};
	AlarmList.push(alarm);
};

//为进程报警使用的，构造一条报警出来
function alarmForModule(device, alarmtype, x){
	var SourceArr = new Array();
	SourceArr.push(device.Ip.join('/'));//Source中的IP，以空格隔开
	SourceArr.push(alarmtype);//Source中的监控项
	SourceArr.push(device.AppModules[x].Name.toString());//Source中的进程名
	SourceArr.push(device.AppModules[x][alarmtype]);//Source中的监控项实时数值
	SourceArr.push(device.ThresHold.AppModules[x][alarmtype]);//Source中的监控项门限数值
	var Desc = makeDesc(alarmtype);
	var Solution = makeSolution(alarmtype);
	alarm = {
		DeviceName:device.Name.toString(),
		SubSys:device.SubSys.toString(),
		DeviceType:device.DeviceInfo.DeviceType.toString(),
		StartTime:device.Time.toString(),
		Status:"True",
		Room:device.DeviceInfo.Room,
		Box:device.DeviceInfo.Box,
		BoxLocation:device.DeviceInfo.BoxLocation,
		DeviceHeight:device.DeviceInfo.DeviceHeight,
		Source:SourceArr,
		Desc:Desc,
		Solution:Solution
	};
	AlarmList.push(alarm);
};

function makeDesc(alarmtype){
	if(alarmtype == "ThreadNum"){
		return "线程数过多";
	}else if(alarmtype == "HandleNum"){
		return "句柄数过多";
	}else if(alarmtype == "IOReadByte"){
		return "IO读取字节数过低";
	}else if(alarmtype == "IOWriteByte"){
		return "IO写入字节数过低";
	}
}

function makeSolution(alarmtype){
	if(alarmtype == "ThreadNum"){
		return "检查该进程状态";
	}else if(alarmtype == "HandleNum"){
		return "检查该进程状态";
	}else if(alarmtype == "IOReadByte"){
		return "检查磁盘阵列连接情况";
	}else if(alarmtype == "IOWriteByte"){
		return "检查磁盘阵列连接情况";
	}
}


//为网络利用率报警使用的，构造一条报警出来
function alarmForNetUsage(source, x, alarmtype){
	var SourceArr = new Array();
	SourceArr.push(source.Ip[x].toString()),
	SourceArr.push(alarmtype);
	SourceArr.push(source.NetUsage[x].toString());
	alarm = {
		DeviceName:source.Name.toString(),
		SubSys:source.SubSys.toString(),
		DeviceType:source.DeviceInfo.DeviceType.toString(),
		StartTime:source.Time.toString(),
		Status:"True",
		Room:source.DeviceInfo.Room,
		Box:source.DeviceInfo.Box,
		BoxLocation:source.DeviceInfo.BoxLocation,
		DeviceHeight:source.DeviceInfo.DeviceHeight,
		Source:SourceArr
	};
	AlarmList.push(alarm);
};

//为网络连通状态报警使用的，构造一条报警出来
function alarmForNetStatus(source, alarmtype){
	var SourceArr = new Array();
	SourceArr.push(source.Ip.toString()),
	SourceArr.push(alarmtype);
	SourceArr.push(source.Count);
	// var name = source.Name.toString();
	var alarm = {
		DeviceName:source.Name.toString(),
		SubSys:source.SubSys.toString(),
		DeviceType:source.DeviceInfo.DeviceType.toString(),
		StartTime:source.Time.toString(),
		Status:"True",
		Room:source.DeviceInfo.Room,
		Box:source.DeviceInfo.Box,
		BoxLocation:source.DeviceInfo.BoxLocation,
		DeviceHeight:source.DeviceInfo.DeviceHeight,
		Source:SourceArr
	};
	AlarmList.push(alarm);
};

//为接收机LOCK状态报警使用的，构造一条报警出来
function alarmForLock(source, alarmtype, portnumber){
	var SourceArr = new Array();
	SourceArr.push(source.Ip.toString()),
	SourceArr.push(alarmtype);
	SourceArr.push(portnumber);
	alarm = {
		DeviceName:source.Name.toString(),
		SubSys:source.SubSys.toString(),
		DeviceType:source.DeviceInfo.DeviceType.toString(),
		StartTime:source.Time.toString(),
		Status:"True",
		Room:device.DeviceInfo.Room,
		Box:device.DeviceInfo.Box,
		BoxLocation:device.DeviceInfo.BoxLocation,
		DeviceHeight:device.DeviceInfo.DeviceHeight,
		Source:SourceArr
	};
	AlarmList.push(alarm);
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
	var Arr = ["pipi", "dandan"];
	var result03 = {
		name:'test02',
  		ID:12,
  		Arr:Arr,
  		time:'2015-05-08 12:23:33',
  		IPusage:{
  			ip:'1',
  			usage:'20%'
  		},
  		Source:[,"usage",]
	}
	var ip = ["172.17.17.17"];
	result03.Arr = ip[0].toString();
	var result04 = {
		name:'test04',
  		ID:14,
  		time:'2015-05-08 12:44:44',
  		IPusage:{
  			ip:'172.0.0.4',
  			usage:'240'
  		}
  		// IPusage:['172.0.0.4', '240']
	}
	var arr1 = [{
		Ip:["172.0.0.1", "172.0.0.2"]
	},
		{
		Ip:["172.0.0.3"]
	}
	];
	var pipi = '172.0.0.4';
	if((result03.Type != undefined) && (result03.IPusage.ip.join().indexOf(pipi))){
		result03.Type = pipi;
		console.log(result03);
	}
	
	

	// arr.push(result03);
	// arr.push(result04);
	// console.log(result);
	res.json(result03);
}

function testtest(result01, result02, x, atype){
	var ThresHold = {
		usage:250
	};
	if(result01.Source[1] == atype){
		if(parseInt(result02.IPusage[atype]) < ThresHold.usage){
			result02.ID = 22;
		}
	}
	return result02;
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

exports.AlarmShow = function(req, res, next){
	var length = AlarmList.length;
	// var Alarm = AlarmList.splice(length-100);
	var Alarm = AlarmList.slice(length-100);
	Alarm.reverse();
	res.json(Alarm);
}

function checkStrInArray(str, array){
	for(var i=0;i<array.length;i++){
		if(array[i] == str){
			return true;
		}
	}
	return false;
}
