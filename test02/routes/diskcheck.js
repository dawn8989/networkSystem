var express = require('express');
var router  = express.Router();
var libxmljs = require('libxmljs');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var DiskTaskList = require('../modules/DiskTaskList');
var DiskAlarmList = require('../modules/DiskAlarmList');

exports.DiskCheck = function(req, res, next){
	// var tmp = obj2str(req.body);
	// var result = tmp.substring(39, tmp.length-1);
	// var xmlDoc01 = libxmljs.parseXml(result);
	var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Msg>'+
	'<Head>'+
		'<MsgType>DiskCheckRequest</MsgType>'+
		'<SrcCode>172.18.2.222</SrcCode>'+
	'</Head>'+
        '<Comment>true</Comment>'+
        '<TaskInfo>'+
          '<TaskId>1</TaskId>'+
          '<LocalDir>\\\\10.15.129.27\\cifs101</LocalDir>'+
          '<SizeThr>0.5</SizeThr>'+
        '</TaskInfo>'+
'</Msg>';
  var xml;
  for(var i=0; i < DiskTaskList.length; i ++){
    if(DiskTaskList[i].Status != "true"){
      xml = makexml(DiskTaskList[i]);
    }
  }
  console.log(xml);
	res.send(xml);
}

function makexml(task){
  task.Status = "true";//发送出去后状态置为true
  var TaskId = makeNode("TaskId", task.TaskId);
  var LocalDir = makeNode('LocalDir', task.Url);
  var SizeThr = makeNode('SizeThr', task.AlarmThr/100);
  var TaskInfo = makeNode('TaskInfo', TaskId+LocalDir+SizeThr);
  var MsgType = makeNode('MsgType', "DiskCheckRequest");
  var SrcCode = makeNode('MsgType', "172.18.2.222");
  var Head = maekNode('Head', MsgType+SrcCode);
  var Comment = makeNode('Comment', 'true');
  return makenode('Msg', Head+Comment+TaskInfo);
}

exports.DiskAlarmReport = function(req, res, next){
  console.log(req.body);
  var tmp = obj2str(req.body);
  var result = tmp.substring(39, tmp.length-1);
  console.log(result);
  var xmlDoc01 = libxmljs.parseXml(result);
  // var Time = xmlDoc01.get("//Date").text() + ' ' + xmlDoc01.get("//Time").text();
  var Time = xmlDoc01.get("//AlarmTime");
  var LocalDir = xmlDoc01.get("//DiskDir").text();
  var Description = xmlDoc01.get("//Desc").text();
  var alarm = {
    Time:Time.toString(),
    DiskDir:LocalDir.toString(),
    Desc:Description.toString()
  };
  DiskAlarmList.push(alarm);
  res.send("success");
}

exports.DiskAlarmShow = function(req, res, next){
  var length = DiskAlarmList.length;
  // var Alarm = FileAlarmList.splice(length-100);
  var Alarm = DiskAlarmList.slice(length-100);
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

function makeNode ( tag , content ) {
  return '<' + tag + '>' + content + '</' + tag +'>';
};