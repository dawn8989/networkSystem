var express = require('express');
var router  = express.Router();
var libxmljs = require('libxmljs');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var FileAlarmList = require('../modules/FileAlarmList');


//文件检查终端的列表
var FileCheckClients = ["10.15.127.69"];

//开始时间大于结束时间，已经结束不再被执行的任务，数组
var TaskCompleted = new Array();

//开始时间小于结束时间 ，正要发生的任务，数组
var TaskToDo = [
	{
		TaskId:1,
		Name:"本地_转码_1",
		Type:"1",
		InitTime:"2015-05-21 10:00:00",
		// StartTime:"2015-05-15 10:00:00",
		EndTime:"2015-05-21 17:59:59",
		Frequency:7200,
		NormalSize:700,
		SizeThr:10,
		LostTime:7200,
		FileSavedTime:7,
		// Flag:"True",//结束时间是否小于当前时间的标记位
		Content:[
					{
						CheckId:322,
						FileName:"中星6BCVS16 宝贝家",
						Url:"\\\\10.15.129.27\\cifs101\\322"
					},
					{
						CheckId:323,
						FileName:"中星6BCVE10 车迷频道",
						Url:"\\\\10.15.129.27\\cifs103\\323"
					}
				]
	},
	// {
	// 	TaskId:2,
	// 	Name:"数据中心_转码_2",
	// 	Type:"3",
	// 	InitTime:"2015-05-21 11:58:50",
	// 	// StartTime:"2015-05-15 11:58:50",
	// 	EndTime:"2015-05-21 15:30:00",
	// 	Frequency:14400,
	// 	NormalSize:600,
	// 	SizeThr:10,
	// 	LostTime:7200,
	// 	FileSavedTime:7,
	// 	// Flag:"True",//结束时间是否小于当前时间的标记位
	// 	Content:[
	// 				{
	// 					CheckId:210,
	// 					FileName:"中星6A 10A CCTV-1",
	// 					Url:"\\\\10.150.12.81\\video_file\\573weixing\\201505\\15\\210"
	// 				}
	// 			]
	// }
	{
		TaskId:2,
		Name:"本地_码流_3",
		Type:"2",
		InitTime:"2015-05-23 11:43:50",
		// StartTime:"2015-05-15 11:43:50",
		EndTime:"2015-05-23 15:30:00",
		Frequency:7200,
		NormalSize:600,
		SizeThr:10,
		LostTime:7200,
		FileSavedTime:3,
		// Flag:"True",//结束时间是否小于当前时间的标记位
		Content:[
					{
						CheckId:1235,
						FileName:"中星6A 11A 新疆走出去",
						Url:"\\\\172.17.18.228\\fs1\\SaveTs\\1235\\Real\\20150524"
					}
				]
	}
]

//处理任务询问请求的函数
exports.fileCheck = function(req, res, next){
	var test01 = '<Msg>' +
					'<Head>' +
						'<MsgType>FileCheckRequest</MsgType>' +
						'<Date>2015-05-15</Date>' +
						'<Time>12:00:00</Time>' +
						// '<Type>local_TPRS</Type>' +
						// '<SrcCode>FSC_192.168.101.145</SrcCode>' +
						'<SrcIP>192.168.101.145</SrcIP>' +
					'</Head>' +
				'</Msg>';
	if(AlarmList.length > 10000){
		AlarmList.splice(0, 500);
	}
	var tmp = obj2str(req.body);
	var result = tmp.substring(39, tmp.length-1);
	var xmlDoc01 = libxmljs.parseXml(result);
	var Type = xmlDoc01.get('//MsgType').text();
	
	var Ip = xmlDoc01.get('//SrcCode').text();
	var CurrTimeStr = xmlDoc01.get("//Date").text() + ' ' + xmlDoc01.get("//Time").text();
	var CurrTimeDate = new Date(CurrTimeStr);
	var LastTimeDate = new Date();
	LastTimeDate.setTime(CurrTimeDate.getTime() - 5*60*1000);//上一条xml发来时间的Date格式
	var resultXml;
	var result = new Array(); //要发出去的xml，可能包含好几个任务
	for(var i=0; i < FileCheckClients.length; i ++){
		//遍历每台文件检查机器
		if(Ip == FileCheckClients[i]){
			//如果传来的xml的IP等于机器列表中该项的机器IP
			var tip = new Array();
			for(var j=0; j < TaskToDo.length; j ++){
				//遍历临时任务队列
				if(TaskToDo[j].StartTime === undefined){
					TaskToDo[j].StartTime = new Date(TaskToDo[j].InitTime);
				}
				if((j % FileCheckClients.length == i) && !(CurrTimeDate < TaskToDo[j].StartTime)){
					//更新TaskQueue
					var StartTime = TaskToDo[j].StartTime;
					//把这项的开始时间更新
					TaskToDo[j].StartTime.setTime(StartTime.getTime() + parseInt(TaskToDo[j].Frequency)*1000);
					//把TaskToDo[j]这个任务交给第i个（这个）机器执行，生成xml,并更新临时任务列表TaskQueue
					var TaskInfo = makeTaskInfo(TaskToDo[j]);//生成xml
					result.push(TaskInfo);
					var EndTimeDate = new Date(TaskToDo[j].EndTime);
					if(StartTime > EndTimeDate){
						tip.push(j);//维持一个用来标记哪些数组元素需要被从TaskToDo中移除的数组
					}
				}
			}
			for(var x=0; x < tip.length; x ++){
				var taskTmp = TaskToDo[tip[x]-x];//TaskToDo.splice后数组的元素会发生变化
				//如果开始时间大于结束时间，那么要把它从TaskToDo队列中删掉，加入到TaskCompleted中
				TaskToDo.splice(tip[x]-x, 1);
				TaskCompleted.push(taskTmp);
			}
			break;
		}
	}
	var version = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
	if(result.length != 0){
		var head = makeHead("true");
		resultXml = version + makeNode('Msg', (head + result.join('')));
	}else{
		var head = makeHead("false");
		resultXml = version + makeNode('Msg', head);
	}
	console.log(resultXml);
	res.send(resultXml);
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
	// console.log(req.body);
	var tmp = obj2str(req.body);
	var result = tmp.substring(39, tmp.length-1);
	var xmlDoc = libxmljs.parseXml(result);
	var TaskId = xmlDoc.get('//TaskId').text();
	var time = xmlDoc.get('//AlarmTime').text();
	var Content = xmlDoc.get('//Content').text();
	var Desc = xmlDoc.get('//Desc').text();
	var alarm = {
		TaskId:TaskId,
		Time:time,
		Content:Content,
		Desc:Desc
	}
	FileAlarmList.push(alarm);
	console.log(FileAlarmList);
	res.send("success");
}

exports.FileAlarmShow = function(req, res, next){
	var length = FileAlarmList.length;
	// var Alarm = FileAlarmList.splice(length-100);
	var Alarm = FileAlarmList.slice(length-100);
	Alarm.reverse();
	res.json(Alarm);
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

// Date.prototype.format = function (fmt) {
function format(fmt){
    var o = {
	"M+": this.getMonth() + 1, //月份 
	"d+": this.getDate(), //日 
	"h+": this.getHours(), //小时 
	"m+": this.getMinutes(), //分 
	"s+": this.getSeconds(), //秒 
	"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	"S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
	fmt = fmt.replace(RegExp.$1,
			  (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o) {
	    if (new RegExp("(" + k + ")").test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    }
	}
    }
    return fmt;
}

function makeTaskInfo(task){
	var TaskId = makeNode('TaskId', task.TaskId.toString());
	var TaskName = makeNode('TaskName', task.Name.toString());
	var fmt = "yyyy-MM-dd hh:mm:ss";
	var timeTmp = task.StartTime.format(fmt);
	var StartTime = makeNode('StartTime', timeTmp.substr(11, timeTmp.length-1));//调用Date转String函数，还要截取一下，只要时间不要日期
	var CheckCycle = makeNode('CheckCycle', task.Frequency.toString());
	var CheckType = makeNode('CheckType', task.Type.toString());
	var NormalSize = makeNode('NormalSize', task.NormalSize.toString());
	var SizeThr = makeNode('SizeThr', task.SizeThr.toString());
	var LostTime = makeNode('LostTime', task.LostTime.toString());
	var FileSavedTime = makeNode('FileSavedTime', task.FileSavedTime.toString());
	var ContentArr = new Array();
	for(var y=0; y < task.Content.length; y ++){
	  var ContentTmp = new Array();
	  var CheckId = makeNode('CheckId', task.Content[y].CheckId.toString());
	  var Content = makeNode('Content', task.Content[y].FileName.toString());
	  var LocalDir = makeNode('LocalDir', task.Content[y].Url.toString());
	  ContentTmp.push(CheckId);
	  ContentTmp.push(Content);
	  ContentTmp.push(LocalDir);
	  ContentArr.push(ContentTmp.join(''));
	}
	console.log(ContentArr);
	var CheckContent = makeNodeArray('CheckContent', ContentArr);
	console.log(CheckContent);
	var TaskInfo = TaskId + TaskName + StartTime + CheckCycle + CheckType + NormalSize + SizeThr + LostTime + FileSavedTime + CheckContent;
	return makeNode('TaskInfo', TaskInfo);
}

function makeHead(string){
	var MsgType = makeNode('MsgType', 'FileCheckRequestR');
	var SrcCode = makeNode('SrcCode', '172.18.2.222');
	var head = new Array();
	head.push(MsgType);
	head.push(SrcCode);
	var Comment = makeNode('Comment', string);
	var result = head.join('') + Comment;
	return result;
}

Date.prototype.format = function (fmt) { 
    var o = {
	"M+": this.getMonth() + 1, //月份 
	"d+": this.getDate(), //日 
	"h+": this.getHours(), //小时 
	"m+": this.getMinutes(), //分 
	"s+": this.getSeconds(), //秒 
	"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	"S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
	fmt = fmt.replace(RegExp.$1,
			  (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o) {
	    if (new RegExp("(" + k + ")").test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    }
	}
    }
    return fmt;
}

//李总给写的生成xml格式字符串的例子 start-------------------------------------------
function makeNode ( tag , content ) {
      return '<' + tag + '>' + content + '</' + tag +'>';
      };
 
function makeNodeArray ( tag, array ) {
  var r = "";
  for(var h=0; h < array.length; h ++){
    r = r + makeNode(tag, array[h].toString());
  }
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