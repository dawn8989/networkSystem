//文档地址：http://mongodb.github.io/node-mongodb-native/1.4/
//mongodb已经更新到了2.0了,我勒个去;
var  mongodb = require('mongodb');
//数据库连接的配置
var MONGOURL = "mongodb://localhost:27017/";

var open = function(name, callback) {
    /*
    //1.2版本和1.4版本mongodb的连接方式;,2.0的mongodb连接有向前兼容;
    var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
    var  db = new mongodb.Db(name, server, {safe:true});
     db.open(function(err, db){
         if(!err){
             console.log('connect db');
             callback&&callback(db);
        };
     });
    */
    // 这样的连接方式还是比较好理解的;
    var MongoClient = require('mongodb').MongoClient;
    // name为数据库的名字;
    var url = MONGOURL+ name;
    MongoClient.connect(url, function(err, db) {
        console.log('connect db');
        callback&&callback(db);
    });
};

/*
*   @param dbName;
*       instance    @method create(colname, callback);
*       instance    @method remove(colname, callback);
*       instance    @method getDb();
*/
var Col = function(name,callback) {
    //连接数据库；
    open( name,function(_db) {
        this.db = _db;
        console.log("new db is done!")
        callback&&callback( _db );
    }.bind(this) );
};

Col.prototype = {
    constructor : Col,
    create : function( name, callback) {
        this.db.createCollection( name, {safe:true}, function(err, collection){
            if(err) {
                console.log(err);
            }else{
                callback&&callback(collection);
            };
        });
    },
    remove : function( name, callback) {
        this.db.dropCollection(name, {safe:true}, function(err,result) {
            if(err) {
                console.log(err);
                return;
            };
            callback&&callback(result);
        });
    },
    getDb : function() {
        return this.db;
    }
};

module.exports = Col;