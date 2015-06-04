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
//数组：报警列表
var AlarmList = new Array();
//报警ID:全局变量
var AlarmId;
//初始的设备报警门限数组
var ThresHold = {
	CpuUsage:50,
	MemUsage:50,
	CputTemp:90,
	NetUsage:80,
	Process:{
		ThreadNum:10,
		HandleNum:10,
		IOReadByte:20675,
		IOWriteByte:42233
	}
}

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
					'<Type>zhuanma</Type>'+
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
	var MsgType = xmlDoc02.get('//MsgType').text();
	if(MsgType === "SendSysInfo"){
		var Id = 1;
		//子系统SubSys
	  	var SubSys =  xmlDoc02.get('//Type').text(); 
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
  			HwTemp:xmlDoc02.get('//HwTemp').text(),
  			FanRpm:xmlDoc02.get('//FanRpm').text(),
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
	  	for(var i=0; i < AppName.length; i++){
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
	  		if(DeviceList[i].Type == Type.toString()){
	  			TypeNum ++;
	  		}
	  	}
	  	//遍历DeviceList数组，监测是否该设备已存在
		for(var i=0; i<DeviceList.length; i++){
			if(IpArr.join().indexOf(DeviceList[i].Ip.join()) != -1){
				//如果该设备已经在数组中出现，则更新该数组元素的属性值
				DeviceList[i].Time = Time.toString();
				DeviceList[i].NetUsage = UsageArr;
				DeviceList[i].DeviceStatus = DeviceStatus;
				DeviceList[i].AppModules = AppArr;
				break;
			}else{
				/* 如果该设备未存入过数组,则构造一个device01元素，push进数组 */
				 
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
			  	DeviceList.push(device02);
			  	break;
				}
		}
		if(DeviceList.length == 0){
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
		  	DeviceList.push(device02);
		}
		//以下分别调用外部函数，对设备基础信息和进程的监控项进行报警判断  start---------------------
		//对CPU利用率进行报警判断
		AlarmJudgeDevice(device02, "CpuUsage");
		//对内存利用率进行报警判断
		AlarmJudgeDevice(device02, "MemUsage");
		//对CPU温度进行报警判断
		AlarmJudgeDevice(device02, "CpuTemp");
		//对网口利用率进行报警判断，遍历设备中所有的IP地址,但是这个方法还没写好
		for(var i=0; i < UsageArr.length; i++){
			AlarmJudgeNetUsage(device02, "NetUsage", i);
		}
		//以下分别调用外部函数，对设备基础信息和进程的监控项进行报警判断  end---------------------
	}

	console.log(DeviceList.length);
	for(i=0;i<DeviceList.length;i++){
		console.log(DeviceList[i]);
	}
	//测试发送系统信息 end----------------------------------

	//测试发送设备网络连接状态 start------------------------
	//接收来自小姚的测试程序（发送PingStatusReport的xml
	// var tmp = obj2str(req.body);
	// var result = tmp.substring(39, tmp.length-1);
	  // '<?xml version:"1.0" encoding="UTF-8"?>'+
    var test01 ='     <Msg>'+
					'<Head>'+
						'<Version>1.0</Version>'+
						'<Date>2014-05-16</Date>'+
						'<Time>07:33:20</Time>'+
						'<MsgType>PingStatusReport</MsgType>'+
					'</Head>'+
					'<Type>zhuanma</Type>'+
					'<Ping>'+
						'<DeviceIp>192.168.0.2</DeviceIp>'+
						'<PingStatus>True</PingStatus>'+
					'</Ping>'+
				'</Msg>';
	var xmlDoc01 = libxmljs.parseXml(test01);
	var MsgType = xmlDoc01.get('//MsgType').text();
  	if(MsgType.toString() === 'PingStatusReport'){
  		var Ip = xmlDoc01.get('//DeviceIp').text();
  		//子系统SubSys
		var SubSys =  xmlDoc01.get('//Type').text();
  		//时间Time
		var Time = xmlDoc01.get('//Date').text() +' '+ xmlDoc01.get('//Time').text();
		//Ip的ping状态
		var NetStatus = xmlDoc01.get('//PingStatus').text();
		//获取该Type设备的当前数量
	  	var TypeNum = 0;
	  	for(var i=0; i<DeviceList.length; i++){
	  		if(DeviceList[i].SubSys == SubSys.toString()){
	  			TypeNum ++;
	  		}
	  	}
  		for(var i=0; i<DeviceList.length; i++){
  			//设置一个初始Id
  			var Id = 1;
  			//如果这个设备已经存在
  			if(DeviceList[i].Ip.join('').indexOf(Ip) != -1){
  				//将IP数组中的第j个IP的ping通状态放入NetStatus数组
  				var IpNum = DeviceList[i].Ip.length;
  				var StatusArr = new Array(IpNum);
  				var IpIndex;
  				for(var j in DeviceList[i].Ip){
  					if(Ip == DeviceList[i].Ip[j]){
  						var IpIndex = j;
  						break;
  					}
  				}
  				StatusArr[IpIndex] = NetStatus;
  				DeviceList[i].NetStatus = StatusArr;
  				//更新时间
  				DeviceList[i].Time = Time.toString();
  				break;
  			}else{
  				//这是一个DeviceList数组中不含有的IP,构造device01，push进DeviceList数组
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
  					NetStatus:StatusArr
  				};
  				DeviceList.push(device01);
  				break;
  			}
  		}
  	}
	console.log(DeviceList.length);
	for(i=0;i<DeviceList.length;i++){
		console.log(DeviceList[i]);
	}
	//测试发送设备网络连接状态 end------------------------
	

	//测试发送接收机锁定状态 start------------------------
	var test03 = '<Msg>'+
					'<Head>'+
						'<Version>1.0</Version>'+
						'<Date>2014-08-06</Date>'+
						'<Time>16:21:30</Time>'+
						'<MsgType>LockStatusReport</MsgType>'+
					'</Head>'+
					'<Type>jieshouji</Type>'+
					'<DeviceIp>192.168.0.2</DeviceIp>'+
					/* PortNumber是哈雷接收机特有，1、2、3、4分别是哈雷接收机的一个端口，
					使用的端口都要分别解析锁定状态，分别发送一条xml */
					//一个IP地址如果是哈雷接收机设备，则会有PortNumber个锁定状态
					//非哈雷的接收机，PortNumber值是0
					'<PortNumber>1</PortNumber>'+
					'<Status>OFF</Status>'+
				'</Msg>';
	var xmlDoc03 = libxmljs.parseXml(test03);
	var MsgType = xmlDoc03.get('//MsgType').text();
  	if(MsgType.toString() === 'LockStatusReport'){
  		var Ip = xmlDoc03.get('//DeviceIp').text();
  		//子系统SubSys
		var SubSys =  xmlDoc03.get('//Type').text();
  		var PortNumber = xmlDoc03.get('//PortNumber').text();
  		var Status = xmlDoc03.get('//Status').text();
  		//时间Time
		var Time = xmlDoc01.get('//Date').text() +' '+ xmlDoc01.get('//Time').text();
		//获取该Type设备的当前数量
	  	var TypeNum = 0;
	  	for(var i=0; i<DeviceList.length; i++){
	  		if(DeviceList[i].SubSys == SubSys.toString()){
	  			TypeNum ++;
	  		}
	  	}
		var LockStatusArr = new Array();
		var LockStatus = {
				PortNumber:PortNumber.toString(),
				Status:Status.toString()
			}
  		for(var i=0; i<DeviceList.length; i++){
  			//设置一个初始Id
  			var Id = 1;
  			//如果这个设备已经存在
  			if(DeviceList[i].Ip.join('').indexOf(Ip) != -1){
  				//构造LockStatus, 更改DeviceList[i]的元素值
  				if(PortNumber.toString() == "0"){
  					//如果非哈雷接收机，LockStatus构造成只包含一个对象的数组
  					LockStatusArr.push(LockStatus);
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
  						LockStatusArr.push(LockStatus);
  						DeviceList[i].LockStatus = LockStatusArr;
  					}
  				}
  				//更新时间
  				DeviceList[i].Time = Time.toString();
  				break;
  			}else{
  				//这是一个DeviceList数组中不含有的IP,构造device03，push进DeviceList数组
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
  				DeviceList.push(device03);
  				break;
  			}
  		}
  	}

	console.log(DeviceList.length);
	for(i=0;i<DeviceList.length;i++){
		console.log(DeviceList[i]);
	}
	//测试发送接收机锁定状态 end------------------------

		res.json(DeviceList);
}

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
	var result = testtest(result03, result04, 0, "usage");
	// arr.push(result03);
	// arr.push(result04);
	console.log(result);
	res.json(result);
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

//判断设备报警监控项，并存入AlarmList数组，这里报警门限暂时使用初始化门限ThresHold数组
function AlarmJudgeDevice(device, alarmtype){
	//遍历整个报警数组，从后往前，针对设备基本信息报警
	for(var i=AlarmList.length-1; i >= 0; i --){
		if(device.IpArr.join(' ').indexOf(AlarmList[i].Source[0]) && (AlarmList[i].Source[1] == alarmtype)){//报警列表中已存在
			if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
				if(parseInt(device.DeviceStatus[alarmtype]) < ThresHold[alarmtype]){////此刻CpuUsage恢复正常数值
					AlarmList[i].Status = "False";//让报警状态为不报警
					AlarmList[i].endTime = device.Time.toString();//更新报警结束时间
				}
				AlarmList[i].Source[2] = device.DeviceStatus.CpuUsage.toString();//如果此刻CpuUsage过高，则只需要更新报警实时数值
			}else{//此条报警为“已经报警结束”状态
				if(parseInt(device.DeviceStatus[alarmtype]) > ThresHold[alarmtype]){//此刻CpuUsage值过高，则加入一条新的报警信息
					var SourceArr = new Array();
					SourceArr.push(device.Ip.join(' ')),
					SourceArr.push(alarmtype);
					SourceArr.push(device.DeviceStatus[alarmtype]);
					alarm = {
						StartTime:device.Time.toString(),
						Source:SourceArr,
						Status:"True"
					};
					AlarmList.push(alarm);
				}
			}
			break;
		}else{//报警列表中未存储这个设备的CpuUsag报警
			var SourceArr = new Array();
			SourceArr.push(device.Ip.join(' ')),
			SourceArr.push(alarmtype);
			SourceArr.push(device.DeviceStatus[alarmtype]);
			alarm = {
				StartTime:device.Time.toString(),
				Source:SourceArr,
				Status:"True"
			};
			AlarmList.push(alarm);
			break;
		}
	}
}


//对进程的报警判断
function AlarmJudgeModule(device, alarmtype, x){//x是进程在设备列表该设备元素数组中的序号
	//遍历整个报警数组，从后往前，针对设备基本信息报警
	for(var i=AlarmList.length-1; i >= 0; i --){
		if(device.IpArr.join(' ').indexOf(AlarmList[i].Source[0]) && (AlarmList[i].Source[1] == alarmtype) && (AlarmList[i].Source[2] == device.AppModules[x].Name)){//报警列表中已存在
			if(AlarmList[i].Status == "True"){//此条报警为“正在报警”状态
				if(parseInt(device.AppModules[x][alarmtype]) < ThresHold[alarmtype]){////此刻CpuUsage恢复正常数值
					AlarmList[i].Status = "False";//让报警状态为不报警
					AlarmList[i].endTime = device.Time.toString();//更新报警结束时间
				}
				AlarmList[i].Source[2] = device.AppModules[x].Name.toString();//将进程的名字写入报警数组的Source元素属性中
				AlarmList[i].Source[3] = device.DeviceStatus[alarmtype].toString();//如果此刻CpuUsage过高，则只需要更新报警实时数值
			}else{//此条报警为“已经报警结束”状态
				if(parseInt(device.AppModules[x][alarmtype]) > ThresHold[alarmtype]){//此刻CpuUsage值过高，则加入一条新的报警信息
					var SourceArr = new Array();
					SourceArr.push(device.Ip.join(' '));//Source中的IP，以空格隔开
					SourceArr.push(alarmtype);//Source中的监控项
					SourceArr.push(device.AppModules[x].Name.toString());//Source中的进程名
					SourceArr.push(device.AppModules[x][alarmtype]);//Source中的监控项实时数值
					alarm = {
						StartTime:device.Time.toString(),
						Source:SourceArr,
						Status:"True"
					};
					AlarmList.push(alarm);
				}
			}
			break;
		}else{//报警列表中未存储这个设备的CpuUsag报警
			var SourceArr = new Array();
			SourceArr.push(device.Ip.join(' ')),
			SourceArr.push(AlarmType);
			SourceArr.push(device.DeviceStatus[alarmtype]);
			alarm = {
				StartTime:device.Time.toString(),
				Source:SourceArr,
				Status:"True"
			};
			AlarmList.push(alarm);
			break;
		}
	}
}
	

	