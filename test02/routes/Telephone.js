var express = require('express');
var router  = express.Router();
var TelephoneList = require('../modules/TelephoneList');
var Col = require('../mongodb/Col');
var Crud = require('../mongodb/Crud');
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
	res.render('Telephone');
};

// exports.jump = function(req, res, next){
// 	var subsysid = req.body.subsysid;
// 	res.render('Sub')
// }

exports.addTelephone = function(req, res, next){
	
	var data=req.body;	
	console.log(data);
	if(data.provider!=""&&data.telephone!="")
		crud.insert("telephone",data);
	res.redirect(303, '/Telephone');
}

exports.queryTelephone = function(req, res, next){	
	var data = req.body;	
	var q={};
	if(data.provider != "")
		q.provider={$regex:eval("/"+data.provider+"/")};
	if(data.telephone !="")
		q.telephone={$regex:eval("/"+data.telephone+"/")};
	crud.find("telephone",q, function(docs){			
		res.json(docs);
	});	
}

exports.deleteTelephone = function(req, res, next){	
	var data = req.body;	
	crud.remove("telephone",{_id:new ObjectID(data._id)});		
	res.redirect(303, '/Telephone');
}

exports.editTelephone = function(req, res, next){	
	var data = req.body;
	console.log(data);
	crud.update("telephone",{_id:new ObjectID(data._id)},{provider:data.provider,telephone:data.telephone});		
	res.redirect(303, '/Telephone');
}
