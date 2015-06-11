//文档地址：http://mongodb.github.io/node-mongodb-native/1.4/
//mongodb已经更新到了2.0了,我勒个去;

var Crud = function(db) {
    this.db = db;
};
Crud.prototype  = {
    constructor : Crud,
    noop : function(){},
    //增加
    insert : function(col, val, cb) {
        cb = cb || this.noop;
        return this.db.collection(col).insert(val, cb);
    },
    //插入，加一个值（可以是数组）到数组内，只有这个值不在数组内才增加
    insertIntoArr : function(col, search, val, cb) {
        cb = cb || this.noop;
        return this.db.collection(col).update(search, {$addToSet : val}, cb);
    },
    //更新
    update : function(col, search, val, cb) {
        cb = cb || this.noop;
        return this.db.collection(col).update(search, {$set : val}, cb);
    },
    //删除：删除某个数组字段中的一个值
    removeDeleteArrItem : function(col, search, val, cb) {
        cb = cb || this.noop;
        return this.db.collection(col).update(search, {$pull : val}, cb);
    },
    //删除
    remove : function(col,key,cb) {
        cb = cb || this.noop;
        //console.log(this.db.collection(col).remove);
        return this.db.collection(col).remove(key,cb);
    },
    
    find : function(col,keyword,cb) {
        cb = cb || this.noop;
        this.db.collection(col).find(keyword).toArray(function(err, docs) {
            cb(docs);
        });
    },
    //查询devicealarm，按时间逆序查询，匹配条件Ip和alarmtype两个条件用
    findSort : function(col, keyword1, keyword2, sort, limit, cb){
        cb = cb || this.noop;
        this.db.collection(col).find(keyword1, keyword2).sort(sort).limit(limit).toArray(function(err, docs){
            cb(docs);
        });
    },//查询devicealarm中App导致的报警时，按时间逆序查询，匹配条件Ip和alarmtype, AppName三个条件用
    findSortThree : function(col, keyword1, keyword2, keyword3, sort, limit, cb){
        cb = cb || this.noop;
        this.db.collection(col).find(keyword1, keyword2, keyword3).sort(sort).limit(limit).toArray(function(err, docs){
            cb(docs);
        });
    },

    findBy_id : function(col,id, cb) {
        this.db.collection(col).find({},{_id : id}, function(err, docs){
            docs.toArray(function(err,doc){
                cb(doc)
            })
        })
    },
    findOne : function(col,keyword,cb) {
        cb = cb || this.noop;
        this.db.collection(col).findOne(keyword,function(err, docs) {
            cb(docs);
        })
    }
};

/*
 需要把题目的数据库实例放进来;
 var crud = new Crud(db);
 var result = crud.insert("nono" [{xx:xx}] , callback);
 var result = crud.update("nono", {hehe1 : 1} , { lala : "lala" },function(){console.log("update Done")});
 var result = crud.remove("nono", {hehe : 0} ,function() {console.log("remove Done")});
 var result = crud.find("nono", {hehe1 : 1} ,function(doc) {}
 */
module.exports =  function(db) {
    return new Crud(db);
};
