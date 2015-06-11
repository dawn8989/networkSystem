var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var TopTopology = require('./routes/TopTopology');
var SubTopology = require('./routes/SubTopology');
var CheckBox = require('./routes/CheckBox');
var DeviceCurrStatusQuery = require('./routes/DeviceCurrStatusQuery');
var AppCurrStatusQuery = require('./routes/AppCurrStatusQuery');
var DeviceAlarmQuery = require('./routes/DeviceAlarmQuery');
var FileCheckManagement = require('./routes/FileCheckManagement');
var FileCheckResult = require('./routes/FileCheckResult');
var FileCheckAdd = require('./routes/FileCheckAdd');
var FileAlarmQuery = require('./routes/FileAlarmQuery');
var DiskCheckManagement = require('./routes/DiskCheckManagement');
var DiskAlarmQuery = require('./routes/DiskAlarmQuery');
var DeviceInfoQuery = require('./routes/DeviceInfoQuery');
var Telephone = require('./routes/Telephone');
var device = require('./routes/device');
var devicenew = require('./routes/devicenew');
var devicetest = require('./routes/device_test');
var filecheck = require('./routes/filecheck');
var filecheck_bak = require('./routes/filecheck_bak');
var diskcheck = require('./routes/diskcheck');
var AlarmSwitch = require('./routes/AlarmSwitch');
var users = require('./routes/users');
var test = require('./routes/test');
var libxmljs = require('libxmljs');
//以下是mongodb数据库用到的
var Col = require('./mongodb/Col');
var Crud = require('./mongodb/Crud');
var DeviceList = require('./modules/DeviceList');
/* 
数据库中查询的id要通过 new ObjectId(id) 进行实例化以后的id, 你单单传一个字符串id是一点用都没有的
*/
var ObjectID = require('mongodb').ObjectID;

//初始化crud
var crud;
//新建db并获取
var db = new Col("NetMonitor", function(db){
  //数据库连接完毕...
    //创建一个RESTFUL对象;
    crud = new Crud(db, function(){});
});

var SubSystemList = require('./modules/SubSystemList');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/users', users);
app.get('/TopTopology', TopTopology.index);
app.post('/SubNumShow', TopTopology.SubNumShow);

app.get('/SubTopology', SubTopology.index);
app.get('/SubTopology:ID', function(req, res){
  var subsysID = req.params.ID;
  res.render('SubTopology', {subsysID:subsysID.toString()});
});
app.get('/CheckBox:ID', function(req, res){
  var deviceID = req.params.ID;
  res.render('CheckBox', {deviceID:deviceID.toString()});
});
app.post('/addDevice', SubTopology.addDevice);
app.post('/ShowSubTopCanvas', SubTopology.ShowSubTopCanvas);

app.post('/ShowBoxCanvas', CheckBox.ShowBoxCanvas);
app.get('/CheckBox', CheckBox.index);
app.post('/ChooseBoxCanvas', CheckBox.ChooseBoxCanvas);

app.get('/DeviceCurrStatusQuery', DeviceCurrStatusQuery.index);
app.post('/queryDevice', DeviceCurrStatusQuery.queryDevice);
app.get('/AppCurrStatusQuery', AppCurrStatusQuery.index);
app.post('/queryApp', AppCurrStatusQuery.queryApp);
app.get('/DeviceAlarmQuery', DeviceAlarmQuery.index);
app.post('/queryDeviceAlarm', DeviceAlarmQuery.queryDeviceAlarm);
app.get('/FileCheckManagement', FileCheckManagement.index);
app.post('/queryFileTask', FileCheckManagement.queryFileTask);
app.get('/FileCheckResult', FileCheckResult.index);
//app.post('/queryFileTask', FileCheckManagement.queryFileTask);
app.get('/FileCheckAdd', FileCheckAdd.index);
app.post('/addContent', FileCheckAdd.addContent);
app.post('/initContentTable', FileCheckAdd.initContentTable);
app.post('/addFileTask', FileCheckAdd.addFileTask);

app.get('/FileAlarmQuery', FileAlarmQuery.index);
app.post('/queryFileAlarm', FileAlarmQuery.queryFileAlarm);
app.get('/DiskCheckManagement', DiskCheckManagement.index);

app.get('/DiskAlarmQuery', DiskAlarmQuery.index);
app.post('/queryDiskAlarm', DiskAlarmQuery.queryDiskAlarm);

app.get('/DeviceInfoQuery', DeviceInfoQuery.index);
app.post('/queryDeviceStatus', DeviceInfoQuery.queryDeviceStatus);
app.get('/AlarmSwitch', AlarmSwitch.index);
//app.post('/queryTelephone', Telephone.queryTelephone);
//app.post('/addTelephone', Telephone.addTelephone);

app.get('/Telephone', Telephone.index);
app.post('/queryTelephone', Telephone.queryTelephone);
app.post('/addTelephone', Telephone.addTelephone);

app.get('/test:name', test.index);
app.post('/xml', devicenew.saveDevice);
// app.post('/xml', filecheck.FileCheckAlarm);
// app.post('/xml', devicetest.xml);
app.post('/FileCheckRequest', filecheck.fileCheck);
app.post('/FileAlarmReport', filecheck.FileCheckAlarm);
app.post('/FileAlarmShow', filecheck.FileAlarmShow);
app.post('/DiskCheckRequest', diskcheck.DiskCheck);
app.post('/DiskAlarmReport', diskcheck.DiskAlarmReport);
app.post('/DiskAlarm', diskcheck.DiskAlarmShow);

app.post('/Top', devicenew.test);
app.post('/Alarm', devicenew.AlarmShow);
// app.post('/Top', filecheck.initTaskQueue);
// app.post('/SubTop', device.saveDevice);

//测试用例 start-----------------------------------
app.get('/xx', function(req, res, next){
  res.render('DeviceCurrStatusQuery');
  fs.readFile('hello.html', 'utf8', function(err, data){
    if(err) throw err;
    console.log(data);
    console.log('---------------');
    var xmlDoc = libxmljs.parseXmlString(data);
    console.log(xmlDoc);
    //xpath queries
    var gchild = xmlDoc.find('//td');
    for(var i=0; i < gchild.length; i++){
      console.log(gchild[i].text());
    };
    var xpath = '//tr[td = "apples"]';
    var tr    = xmlDoc.get(xpath);
    console.log('Up load is : ' + tr.text());
    console.log('Child nodes : ' + tr.childNodes());
    console.log('Next node is : ' + tr.childNodes()[1].text());
  });
});
//测试用例 end-----------------------------------


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
  setInterval(function(){
    crud.find("device", {}, function(docs){
      DeviceList = docs;
      // console.log(DeviceList);
    });
  }, 30*1000);
});
module.exports = app;
