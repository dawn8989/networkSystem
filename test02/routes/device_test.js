var express = require('express');
var router  = express.Router();
var libxmljs = require('libxmljs');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

exports.xml = function(req, res, next){
	console.log(req.body);
    var tmp = obj2str(req.body);
    var result = tmp.substring(39, tmp.length-1);
    var xmlDoc01 = libxmljs.parseXml(result);
    console.log(result);
    var Type = xmlDoc01.get('//MsgType').text();
    if(Type == "SendSysInfo"){
    	res.send("success");
    }
	
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