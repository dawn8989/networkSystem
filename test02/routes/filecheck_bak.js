var express = require('express');
var router  = express.Router();
var libxmljs = require('libxmljs');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');


//文件检查终端的列表
var FileCheckClients = ["192.168.101.145", "192.168.101.111"];
// var Client01 = "192.168.101.145";
// var Client02 = "192.168.101.111";
// FileCheckClients.push(Client01);
// FileCheckClients.push(Client02);

var TaskList = [
	{
		TaskId:1,
		Name:"local_TPRS_1",
		Type:"local_TPRS",
		// InitTime:"2015-05-15 10:00:00",
		StartTime:"2015-05-15 10:00:00",
		EndTime:"2015-05-15 17:59:59",
		Frequency:7200,
		NormalSize:700,
		SizeThr:10,
		LostTime:7200,
		FileSavedTime:7,
		// Flag:"True",//结束时间是否小于当前时间的标记位
		Content:[
					{
						CheckId:324,
						FileName:"中星6BCVS18 电视指南",
						Url:"\\10.15.129.27\\cifs101\\324"
					},
					{
						CheckId:191,
						FileName:"中星6BCHS7 CCTV-7",
						Url:"\\10.15.129.27\\cifs102\\191"
					}
				]
	},
	{
		TaskId:2,
		Name:"datacenter_TPRS_2",
		Type:"datacenter_TPRS",
		// InitTime:"2015-05-15 11:58:50",
		StartTime:"2015-05-15 11:58:50",
		EndTime:"2015-05-15 19:30:00",
		Frequency:14400,
		NormalSize:600,
		SizeThr:10,
		LostTime:7200,
		FileSavedTime:7,
		// Flag:"True",//结束时间是否小于当前时间的标记位
		Content:[
					{
						CheckId:210,
						FileName:"中星6A 10A CCTV-1",
						Url:"\\10.150.12.81\\video_file\\573weixing\\201505\\15\\210"
					}
				]
	},
	{
		TaskId:3,
		Name:"local_TS_3",
		Type:"local_TS",
		// InitTime:"2015-05-15 11:43:50",
		StartTime:"2015-05-15 11:43:50",
		EndTime:"2015-05-15 19:30:00",
		Frequency:7200,
		NormalSize:600,
		SizeThr:10,
		LostTime:7200,
		FileSavedTime:7,
		// Flag:"True",//结束时间是否小于当前时间的标记位
		Content:[
					{
						CheckId:1001,
						FileName:"中星6A 11A 新疆走出去",
						Url:"\\10.15.129.27\\fs5\\1001"
					}
				]
	}
]

var TaskQueue = new Array();
exports.initTaskQueue = function(req, res, next){
	//伪造的临时测试用的任务列表
	var time01 = new Date("2015-05-15 10:00:00");
	var time02 = new Date("2015-05-15 11:58:50");
	var time03 = new Date("2015-05-15 11:43:50");
	//临时的任务队列，两次小姚的xml请求时间之间要发送的任务存在这里
	
	// TaskQueue[0].StartTime = time01;
	// TaskQueue[0].Task = TaskList[0];
	// TaskQueue[1].StartTime = time02;
	// TaskQueue[1].Task = TaskList[1];
	// TaskQueue[2].StartTime = time03;
	// TaskQueue[2].Task = TaskList[2];
	var task01 = {
		StartTime:time01,
		Task:TaskList[0]
	}
	TaskQueue.push(task01);
	var task02 = {
		StartTime:time02,
		Task:TaskList[1]
	}
	TaskQueue.push(task02);
	var task03 = {
		StartTime:time03,
		Task:TaskList[2]
	}
	TaskQueue.push(task03);

	

	var result03 = {
		name:'test02',
  		ID:12,
  		time:'2015-05-08 12:23:33',
  		IPusage:{
  			ip:'1',
  			usage:'20%'
  		},
  		Source:[,"usage",]
	}
	res.json(result03);
}


//处理任务询问请求的函数，测试方法
exports.fileCheckTest = function(req, res, next){
	var result;//xml格式的，要发送给小姚的任务字符串
	var test01 = '<Msg>' +
					'<Head>' +
						'<MsgType>FileCheckRequest</MsgType>' +
						'<Date>2015-05-15</Date>' +
						'<Time>10:00:00</Time>' +
						'<Type>local_TPRS</Type>' +
						'<SrcCode>FSC_192.168.101.145</SrcCode>' +
					'</Head>' +
				'</Msg>';
	var xmlDoc01 = libxmljs.parseXml(test01);
	var Type = xmlDoc01.get('//MsgType').text();
	if(Type === "local_TPRS"){
		//xml到达的时间
		var CurrTimeStr = xmlDoc01.get("//Date").text() + ' ' + xmlDoc01.get("//Time").text();
		//如果TaskList列表中的任务开始时间早于当前时间，晚于当前时间前5分钟（xml询问发送的时间间隔）
		//就把这个task转成xml发出去，同时把它的开始时间加一个任务执行频率的时间间隔
		var CurrTimeDate = new Date(CurrTimeStr);
		var LastTimeDate = new Date();
		LastTimeDate.setTime(CurrTimeDate.getTime() - 5*60*1000);//上一条xml发来时间的Date格式
		for(var i=0; i < TaskList.length; i++){
			if(TaskList[i].StartTime == null){
				TaskList[i].StartTime = new Date(TaskList[i].InitTime);
			}
			if((TaskList[i].Flag == "True") && (TaskList[i].Type == "local_TPRS") && (TaskList[i].StartTime < CurrTimeDate) && (TaskList[i].StartTime > LastTimeDate)){
				//这个任务是本地转码检查任务，且开始时间介于这条xml和上条xml的时间之间时
				var EndTimeDate = new Date(TaskList[i].EndTime.toString());
				TaskList[i].StartTime.setTime(StartTime.getTime() + 2*60*60*1000);
				if(!(TaskList[i].StartTime > EndTimeDate)){
					//如果这个临时的开始时间不大于结束时间，就把这个任务发出去，否则更新标记位
					//function makeXml 生成xml
					result = makeXml();

				}else{
					TaskList[i].Flag = "False";
				}
			}
		}

	}
	res.send(result);
}

//处理任务询问请求的函数
exports.fileCheck = function(req, res, next){
	var test01 = '<Msg>' +
					'<Head>' +
						'<MsgType>FileCheckRequest</MsgType>' +
						'<Date>2015-05-15</Date>' +
						'<Time>10:00:00</Time>' +
						// '<Type>local_TPRS</Type>' +
						// '<SrcCode>FSC_192.168.101.145</SrcCode>' +
						'<SrcIP>192.168.101.145</SrcIP>' +
					'</Head>' +
				'</Msg>';
	var xmlDoc01 = libxmljs.parseXml(test01);
	var Type = xmlDoc01.get('//MsgType').text();
	var Ip = xmlDoc01.get('//SrcIP').text();
	var CurrTimeStr = xmlDoc01.get("//Date").text() + ' ' + xmlDoc01.get("//Time").text();
	var CurrTimeDate = new Date(CurrTimeStr);
	var LastTimeDate = new Date();
	LastTimeDate.setTime(CurrTimeDate.getTime() - 5*60*1000);//上一条xml发来时间的Date格式
	var resultXml;
	for(var i=0; i < FileCheckClients.length; i ++){
		var result = new Array(); //要发出去的xml，可能包含好几个任务
		//遍历每台文件检查机器
		if(Ip == FileCheckClients[i]){
			//如果传来的xml的IP等于机器列表中该项的机器IP
			for(var j=0; j < TaskQueue.length; j ++){
				//遍历临时任务队列
				if(j % FileCheckClients.length == i){
					//把TaskQueue[j]这个任务交给第i个（这个）机器执行，生成xml,并更新临时任务列表TaskQueue
					// var resultTmp = makeXml();//生成xml
					// result.push(resultTmp);
					if((TaskQueue[j].StartTime < CurrTimeDate) && (TaskQueue[j].StartTime > LastTimeDate)){
						//生成xml
					}
					console.log(j);
					console.log(FileCheckClients.length);
					console.log(i);
					//更新TaskQueue
					var StartTime = TaskQueue[j].StartTime;
					//把这项的开始时间更新
					TaskQueue[j].StartTime.setTime(StartTime.getTime() + 2*60*60*1000);
					var EndTimeDate = new Date(TaskQueue[j].Task.EndTime);
					if(!(StartTime > EndTimeDate)){
						//如果开始时间不大于结束时间，那么要把它从队列中移到末尾
						var taskTmp = TaskQueue[j];
						TaskQueue.splice(j,1);
						TaskQueue.push(taskTmp);
					}else{
						//如果开始时间大于结束时间了，那么要把这个任务从临时队列里删除
						TaskQueue.splice(j,1);
					}
				}
			}
			break;
		}
		// resultXml = result.join();
	}
	res.send("resultXml");
}

exports.fileCheckTestTwo = function(req, res, next){
	// var tmp = obj2str(req.body);
	// var result = tmp.substring(39, tmp.length-1);
	// var xmlDoc01 = libxmljs.parseXml(result);
	var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Msg>'+
	'<Head>'+
		'<MsgType>FileCheckRequestR</MsgType>'+
		'<SrcCode>172.18.2.222</SrcCode>'+
	'</Head>'+
        '<Comment>true</Comment>'+
        '<TaskInfo>'+
          '<TaskId>1</TaskId>' +                                             
          '<TaskName>本地转码文件检查</TaskName>' +
          '<StartTime>12:00:00</StartTime>'  +                      
          '<CheckCycle>7200</CheckCycle>' +              
          '<CheckType>1</CheckType>'      +              
          '<NormalSize>500</NormalSize>'  +              
          '<SizeThr>10</SizeThr>'     +                
          '<LostTime>7200</LostTime> '+
          '<FileSavedTime>7</FileSavedTime>'+
          '<CheckContent>'+
             '<CheckId>322</CheckId>' +                                        
             '<Content>中星6BCVS16 宝贝家</Content>'+                            
             '<LocalDir>\\\\10.15.129.27\\cifs101\\322</LocalDir>' +                    
          '</CheckContent>'+
          '<CheckContent>'+
             '<CheckId>323</CheckId>' +                                           
             '<Content>中星6BCVE10 车迷频道</Content>'+                            
             '<LocalDir>\\\\10.15.129.27\\cifs103\\323</LocalDir>' +                    
          '</CheckContent>'+
        '</TaskInfo>'+
        '<TaskInfo>'+
          '<TaskId>2</TaskId>'+                                              
          '<TaskName>码流文件检查</TaskName>'+
          '<StartTime>12:00:00</StartTime>'+                        
          '<CheckCycle>3600</CheckCycle>' +              
          '<CheckType>2</CheckType>' +                   
          '<NormalSize>700</NormalSize>' +               
          '<SizeThr>10</SizeThr>' +                    
          '<LostTime>7200</LostTime>' +
          '<FileSavedTime>3</FileSavedTime>'+
          '<CheckContent>'+
             '<CheckId>1235</CheckId>' +                                           
             '<Content>不知道是啥码流</Content>'  +                          
            '<LocalDir>\\\\172.17.18.228\\fs1\\SaveTs\\1235\\Real\\20150515</LocalDir>' +                    
          '</CheckContent>'+
        '</TaskInfo>'+
        // '<TaskInfo>'+
        //   '<TaskId>3</TaskId>'+                                              
        //   '<TaskName>数据中心转码文件检查</TaskName>'+
        //   '<StartTime>12:00:00</StartTime>'+                         
        //   '<CheckCycle>7200</CheckCycle>' +
        //   '<CheckType>3</CheckType>' +  
        //   '<ProgramType>1</ProgramType>'   +          
        //   '<NormalSize>1200</NormalSize>' +               
        //   '<SizeThr>10</SizeThr>'+                    
        //   '<LostTime>7200</LostTime>'+ 
        //   '<FileSavedTime>7</FileSavedTime>'+
        //   '<CheckContent>'+
        //      '<CheckId>1162</CheckId>'     +                                       
        //      '<CheckContentType>2</CheckContentType>' +                         
        //      '<Content>中星6B S22 留学世界</Content>' +                          
        //      '<LocalDir>\\\\10.242.10.81\\video_files\\weixing\\573\\201505\\14\\1162</LocalDir>' +                    
        //   '</CheckContent>'+
        //   '<CheckContent>'+
        //      '<CheckId>1161</CheckId>' +                                           
        //      '<Content>中星6B S22 靓妆</Content>' +                           
        //      '<LocalDir>\\\\10.242.10.81\\video_files\\weixing\\573\\201505\\14\\1161</LocalDir>' +                    
        //   '</CheckContent>'+
        // '</TaskInfo>'+
'</Msg>';
	console.log(req.body);
	res.send(xml);
}

exports.DiskCheckTest = function(req, res, next){
	// var tmp = obj2str(req.body);
	// var result = tmp.substring(39, tmp.length-1);
	// var xmlDoc01 = libxmljs.parseXml(result);
	var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Msg>'+
	'<Head>'+
		'<MsgType>DiskCheckRequestR</MsgType>'+
		'<SrcCode>172.18.2.222</SrcCode>'+
	'</Head>'+
        '<Comment>true</Comment>'+
        '<TaskInfo>'+
          '<LocalDir>\\\\10.15.129.27\\fs5'+
          '<SizeThr>10</SizeThr>'+
        '</TaskInfo>'+
'</Msg>';
	console.log(req.body);
	res.send(xml);
}

exports.FileCheckAlarm = function(req, res, next){
	console.log(req.body);
	res.send("success");
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

function makeXml(){

}


//李总给写的生成xml格式字符串的例子 start-------------------------------------------
function makeNode ( tag , content ) {
      return '<' + tag + '>' + content + '</' + tag +'>';
      };
 
function makeNodeArray ( tag, array ) {
      var r;
      // for() ;
      return r;
      }
 
// makeNode('Name','abc')  =>   <Name>abc</Name>
// makeNodeArray('URL',['a','b']) =>  <URL>a</URL> <URL>b</URL>
 
function makeContent (c) {
         return makeNode('content',c);
         }
 
function makeType(c) {
      return makeNode('type',c);
      }
 
function makeTask(c) {
      return makeNode('task',c);
      }
 
// makeTask(makeType('abc')+makeContent('afljalj')+makeNodeArray('URL',[iplist]));

//李总给写的生成xml格式字符串的例子 end-------------------------------------------