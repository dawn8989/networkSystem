/*初始化页面*/
var devices=new Array();
$(function(){
	//5秒钟刷新一次报警列表
	//每个子系统都有一个名字和子系统ID
	var subsysID = $("#subsysID").text();
	// Toprefresh();
	showCanvas(subsysID);
	// Toprefresh();
	function showCanvas(subsysid){
		var subsysidtmp = subsysid.substr(1);
	
		$("#subSystems").val(subsysidtmp);
		$.post(
			"ShowSubTopCanvas",
			{
				'subsysid':subsysidtmp
			},
			function(data) {
				// alert(data);
				devices=data;
				//draw();
				for(var i=currentDeviceNum;i<devices.length;i++)			
					addDevice(devices[i]);
		});
	}


	
	

//--------------------陈青云 start-------------------------------
	var o = document.getElementById("subdiv");
	var w = o.offsetWidth*0.95;
	var h = w/1480*680;
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", w);
	canvas.setAttribute("height",h);	
	canvas.setAttribute("id", "canvas");			
	document.getElementById("subdiv").appendChild(canvas);	
	var stage = new JTopo.Stage(canvas);						
	var scene = new JTopo.Scene(stage);	
	function connectNode(x, y){
		var node = new JTopo.Node();								
		node.setBound(x, y, 5, 5);
		node.fillCorlor="19,172,195";
		node.alpha=0.1;
		node.visible=false;								
		scene.add(node);			
		return node;
	}
	function setBackgroundPic(height,type)
	{
		if(height>10)
			return("10u");
		var pic=height+"u";
		if(type.indexOf("复用器")>=0||type.indexOf("频谱仪")>=0||type.indexOf("卫星接收机")>=0)
			pic+="_1";
		return pic;
	}
	function deviceNode(x,y,device){	
		var node = new JTopo.Node();								
		node.setLocation(x, y);				
		node.setSize(39,52);
		node.setImage('./img/sub/'+setBackgroundPic(device.DeviceInfo.DeviceHeight,device.DeviceInfo.DeviceType)+'.png');
		node.dragable=false;
		node.showSelected=false;	
		node.id=device.Id;
		node.mouseover(function(event){	
			currentDevice=this;
			mouseOnDevices=true;
			var a=event.x>canvas.width/2?0:1;
			$("#tip").css({
				top:55,
				left:canvas.width*a-a*120+270,
				width:120,						
				visibility:"visible",
			});
			$("#tip").empty();			
			var roomName=device.DeviceInfo.Room==1?"西侧":"南侧";					
			var devicetip='设备信息：<br/> 设备类型：'+ device.DeviceInfo.DeviceType
			+'<br/>所在机柜：'+roomName+device.DeviceInfo.Box+"号机柜"
			+'<br/>机柜位置：'+device.DeviceInfo.BoxLocation
			+'<br/>设备高度：'+device.DeviceInfo.DeviceHeight;
			if(device.DeviceInfo.CardLocation)
				devicetip+='<br/>卡位置：'+device.DeviceInfo.CardLocation;			
			devicetip+='<br/>供货商：'+device.DeviceInfo.Provider
				+'<br/>备注:'+device.DeviceInfo.Remark
				+'<br/><br/><br/>设备状态：';			
			if(device.Ip)
				devicetip+='<br/>IP地址：'+device.Ip.join(",")
					+'<br/>网络连通：'+device.NetStatus.join(",")
					+'<br/>网络使用率：'+device.NetUsage.join(",");
			//+'<br/>LOCK：'暂时没有LOCK数据			
			devicetip+='<br/>CPU：'+device.DeviceStatus.CpuUsage
				+'<br/>内存：'+device.DeviceStatus.MemUsage
				+'<br/>CPU温度：'+device.DeviceStatus.CpuTemp;
			if(device.AppModules)
			{
				devicetip+='<br/><br/><br/>软件状态：';
				for (var i=0;i<device.AppModules.length;i++)
				{
					devicetip+='<br/>'+device.AppModules[i].Name;
					devicetip+='<br/>线程数: '+device.AppModules[i].ThreadNum;
					devicetip+='<br/>句柄数: '+device.AppModules[i].HandleNum;
					devicetip+='<br/>IO读取: '+device.AppModules[i].IORead;
					devicetip+='<br/>IO写入: '+device.AppModules[i].IOWrite;					
				}
			}
			if(device.AlarmItem)
			{
				devicetip+='<br/><br/><br/>报警状态：'+'<br/>'+device.AlarmItem.join(",");
			}			
			$("#tip").append(devicetip);		
			$("#tip div").show(); 	
		});
		node.mouseout(function(event){						
			mouseOnDevices=false;	
			$("#tip").css({visibility:"hidden"});
			$("#tip div").hide();
		});
		node.dbclick(function(event){window.location.href= "http://localhost:3000/CheckBox:" + device.DeviceId;});							
		var closeAlarmNode=new JTopo.Node();
		closeAlarmNode.setBound(x+5,y+35);
		closeAlarmNode.setImage('./img/sub/cha.png',true);
		closeAlarmNode.showSelected=false;
		closeAlarmNode.dragable=false;
		closeAlarmNode.visible = false;
		closeAlarmNode.click(function(event){						
			node.endAlarm();
			node.alarmBorder.visible=false;
		});				
		node.closeAlarmButton=closeAlarmNode;		
		var redBorder=new JTopo.Node();
		redBorder.setLocation(x-12, y-2);
		redBorder.setSize(39*1.6,39*1.6);
		redBorder.setImage('./img/sub/hongkuang.png');
		redBorder.showSelected=false;
		redBorder.visible = false;			
		node.alarmBorder=redBorder;			
		scene.add(redBorder);	
		if(device.AlarmStatus=="ON")
		{
			closeAlarmNode.visible = true;
			node.alarmBorder.visible=true;
			// node.alarmStarted=setInterval(function(){
				// node.alarmBorder.visible =!node.alarmBorder.visible
			// },300);
		}
		node.endAlarm=function(){							
			// clearInterval(node.alarmStarted);
			node.alarmBorder.visible=false;
			closeAlarmNode.visible = false;
		}
		node.typeNode=addTextNode(typeNodePosArray[currentDeviceNum][0],typeNodePosArray[currentDeviceNum][1],device.Name);
		if(device.Ip)
		node.ipNode=addTextNode(ipNodePosArray[currentDeviceNum][0],ipNodePosArray[currentDeviceNum][1],device.Ip[0]);
		scene.add(node);
		scene.add(closeAlarmNode);					
		return node;
	} 			
	function addTextNode(x,y,text)
	{
		var textNode = new JTopo.TextNode(text);
		textNode.font = 'bold 10px 微软雅黑';
		textNode.fontColor="0,0,0";		
		textNode.setLocation(x,y);	
		textNode.showSelected=false;
		textNode.dragable=false;		
		scene.add(textNode);
		return textNode;
	}
	function link(nodeA, nodeZ){
		var link = new JTopo.Link(nodeA, nodeZ);                              
		link.showSelected=false;
		link.dragable=false;
		link.strokeColor="19,172,195";
		link.lineWidth=4;
		scene.add(link);
		return link;
	}
	function thinlink(nodeA, nodeZ){
		var link = new JTopo.Link(nodeA, nodeZ);                              
		link.showSelected=false;
		link.dragable=false;
		link.strokeColor="19,172,195";
		link.lineWidth=2;
		scene.add(link);
		return link;
	}

	var mouseOnDevices=false;
	var currentDevice;		
	var connectNodeArray = new Array();
	var cornerNodeArray= new Array();			
	var deviceNodeArray =new Array();			
	var currentDeviceNum=0;	
	var cornerPos=[[20,360],[510,45],[564,128],[23,484],[73,563],[864,45],[916,126],[273,551],[326,629],[1217,43],[1272,124],[623,552],[675,630],[1417,143],[1469,223],[971,552],[1021,629],[1429,364]];	
	for(var i=0;i<cornerPos.length;i++)
	{
		cornerPos[i][0]/=1486;
		cornerPos[i][1]/=678;
	}
	for(var i=0; i<cornerPos.length;i++)							
		cornerNodeArray.push(connectNode(canvas.width*cornerPos[i][0],canvas.height*cornerPos[i][1]));	
	var rowDeviceNum=[7,8,13,13,14,14,12,12,7,7];	
	var cornerArray=new Array();
	var sum=0;
	for (var i=0;i<rowDeviceNum.length/2;i++)
	{
		sum+=rowDeviceNum[2*i]+rowDeviceNum[2*i+1];
		cornerArray.push(sum);
	}	
	var deviceNodePosArray = new Array();
	var typeNodePosArray = new Array();
	var ipNodePosArray = new Array();	
	for(var i=0;i<5;i++){
		var intervals = rowDeviceNum[2*i+1]+1;
		var dx=(cornerPos[4*i+1][0]-cornerPos[4*i][0])/intervals;			
		var dy=(cornerPos[4*i+1][1]-cornerPos[4*i][1])/intervals;
		for(var j=1;j<rowDeviceNum[2*i]+1;j++)
		{
			connectNodeArray.push(connectNode(canvas.width*(cornerPos[i*4][0]+dx*j),canvas.height*(cornerPos[i*4][1]+dy*j)));
			deviceNodePosArray.push([canvas.width*(cornerPos[i*4][0]+dx*j)-46,canvas.height*(cornerPos[i*4][1]+dy*j)-69]);
			typeNodePosArray.push([canvas.width*(cornerPos[i*4][0]+dx*j)-5, canvas.height*(cornerPos[i*4][1]+dy*j)-42]);
			ipNodePosArray.push([canvas.width*(cornerPos[i*4][0]+dx*j), canvas.height*(cornerPos[i*4][1]+dy*j)-30]);					
		}
		for(var j=1;j<rowDeviceNum[2*i+1]+1;j++)
		{	
			connectNodeArray.push(connectNode(canvas.width*(cornerPos[i*4][0]+dx*j),canvas.height*(cornerPos[i*4][1]+dy*j)));
			deviceNodePosArray.push([canvas.width*(cornerPos[i*4][0]+dx*j)+11,canvas.height*(cornerPos[i*4][1]+dy*j)+19]);
			typeNodePosArray.push([canvas.width*(cornerPos[i*4][0]+dx*j)+55, canvas.height*(cornerPos[i*4][1]+dy*j)+40]);
			ipNodePosArray.push([canvas.width*(cornerPos[i*4][0]+dx*j)+60, canvas.height*(cornerPos[i*4][1]+dy*j)+52]);
		}
	}
	var cornerNum=1;			
	var linkArray = new Array();	
	function addDevice(device){
		if(currentDeviceNum>120){
			alert("没有空间！");
			return;
		}				
		deviceNodeArray.push(deviceNode(deviceNodePosArray[currentDeviceNum][0],deviceNodePosArray[currentDeviceNum][1],device));
		thinlink(deviceNodeArray[currentDeviceNum],connectNodeArray[currentDeviceNum]);				
		if(currentDeviceNum==0)
		{
			currentDeviceNum++;
			return;		
		}						
		if(currentDeviceNum==cornerArray[0]||currentDeviceNum==cornerArray[1]||currentDeviceNum==cornerArray[2]||currentDeviceNum==cornerArray[3]||currentDeviceNum==cornerArray[4]){
			
			linkArray.push(link(cornerNodeArray[cornerNum*4-3],connectNodeArray[currentDeviceNum-1]));
			linkArray.push(link(cornerNodeArray[cornerNum*4-3],cornerNodeArray[cornerNum*4-2]));
			linkArray.push(link(cornerNodeArray[cornerNum*4-2],cornerNodeArray[cornerNum*4-1]));
			linkArray.push(link(cornerNodeArray[cornerNum*4-1],cornerNodeArray[cornerNum*4]));
			linkArray.push(link(connectNodeArray[currentDeviceNum],cornerNodeArray[cornerNum*4]));
			cornerNum++;
			currentDeviceNum++;
			return;
		} 								
		linkArray.push(link(connectNodeArray[currentDeviceNum],connectNodeArray[currentDeviceNum-1]));
		currentDeviceNum++;
		return;
	}				
	$('#canvas').contextMenu('rightClickMenu', {
		menuStyle: {					
			width: '150px'
		},				
		bindings: 
		{
			'item_1': function() {											
				//alert('编辑设备信息');
				$('#addAndEditDeviceDialog h4').html("编辑设备信息");
				$('#addAndEditDeviceDialog').modal('show');
			}, 
			'item_2': function() {											
				//alert('删除设备');				
				scene.remove(currentDevice);
				scene.remove(currentDevice.closeAlarmButton);
				scene.remove(currentDevice.alarmBorder);
				scene.remove(currentDevice.typeNode);
				scene.remove(currentDevice.ipNode);
			}, 
			'item_3': function() {											
				$('#setThresholdDialog').modal('show');
			}, 
			'item_4': function() {											
				//alert('停止报警');
				currentDevice.endAlarm();
			}, 
			'item_5': function() {											
				//alert('显示业务信息');
				if(devices[currentDevice.id-1].DeviceInfo.DeviceType.indexOf("信道监测卡")>=0||devices[currentDevice.id-1].DeviceInfo.DeviceType.indexOf("频谱仪")>=0)
				{
					$('#showServiceDialog1 h4').html(devices[currentDevice.id-1].DeviceInfo.DeviceType);
					$('#showServiceDialog1 .showip').html("IP:"+devices[currentDevice.id-1].Ip[0]);
					$('#showServiceDialog1').modal('show');
				}				
				if(devices[currentDevice.id-1].DeviceInfo.DeviceType.indexOf("码流监测服务器")>=0||devices[currentDevice.id-1].DeviceInfo.DeviceType.indexOf("码流录制服务器")>=0||devices[currentDevice.id-1].DeviceInfo.DeviceType.indexOf("转码服务器")>=0)
				{
					$('#showServiceDialog2 h4').html(devices[currentDevice.id-1].DeviceInfo.DeviceType);
					$('#showServiceDialog2 .showip').html("IP:"+devices[currentDevice.id-1].Ip[0]);
					$('#showServiceDialog2').modal('show');
				}				
				if(devices[currentDevice.id-1].DeviceInfo.DeviceType.indexOf("卫星接收机")>=0)
				{
					$('#showServiceDialog3 h4').html(devices[currentDevice.id-1].DeviceInfo.DeviceType);
					$('#showServiceDialog3 .showip').html("IP:"+devices[currentDevice.id-1].Ip[0]);
					$('#showServiceDialog3').modal('show');
				}
			}, 
			'item_6': function() {											
				//alert('打开设备网管界面');
				window.location.href = "http://localhost:8888";
			}, 
			'item_7': function() {											
				//alert('远程登录设备');
				var oAppRunning = new ApplicationRunning();   
				oAppRunning.Run("C:\\Windows\\notepad.exe");
			}, 
			'item_8': function() {											
				alert('重启设备');
			}, 				
		}, 
		onContextMenu: function(e) {
			return	mouseOnDevices?true:false;
		}
	});
	function ApplicationRunning() {   
	    this.Run = function (sPath) {
	        if (navigator.userAgent.indexOf("MSIE") <= 0) {
	            alert("此功能需使用IE浏览器!");
	            return;
	        }
	        if (FileCheck(sPath, "程序[" + sPath + "]不存在,请检查!!")) {
	            var oWsShell = new ActiveXObject("WScript.Shell");
	            if (oWsShell)
	                oWsShell.Run(sPath);
	            oWsShell = null;
	        }
	    }
	    function FileCheck(sPath, sNothingMessage) {
	        try {
	            var oFSO = new ActiveXObject("Scripting.FileSystemObject");
	            if (!oFSO.FileExists(sPath)) {
	                oFSO = null;
	                if (sNothingMessage)
	                    alert(sNothingMessage);
	                return false;
	            }
	            return true;
	        } catch (e) {
	            var sErrorMessage = "命令已经被禁止!!请在IE[安全]中将此网站加入[受信任的站点]并在[自定义级别中]启用[对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本]选项后刷新页面";	                               
	            alert(sErrorMessage);
	            return false;
	        }
	    }
	}	
	$("#subSystems").change(function(){
		for(var i=0;i<deviceNodeArray.length;i++)
		{
			scene.remove(deviceNodeArray[i]);
			scene.remove(deviceNodeArray[i].closeAlarmButton);
			scene.remove(deviceNodeArray[i].alarmBorder);
			scene.remove(deviceNodeArray[i].typeNode);
			if(deviceNodeArray[i].ipNode)
			scene.remove(deviceNodeArray[i].ipNode);
		}
		for(var i=0;i<linkArray.length;i++)
			scene.remove(linkArray[i]);
		deviceNodeArray=new Array();		
		currentDeviceNum=0;
		cornerNum=1;
		var sId= $("#subSystems").val();
		$.post(
			"ShowSubTopCanvas",
			{
				'subsysid':sId
			},
			function(data) {
				devices=data;
				for(var i=currentDeviceNum;i<devices.length;i++)			
				addDevice(devices[i]);
		});
	});	 





//--------------------陈青云 end-------------------------------

	
});

			
//向后台发请求并显示报警列表
function Toprefresh(){
	$.post(
		"Alarm",
		function(data) {
			$("#alarmList").empty();
			var html = '';
			$.each(data, function(idx, item){//循环对象取值
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.DeviceName + '</td><td>'
					 + item.Source[1] + '</td><td>'
					 + item.SubSys + '</td><td>'
					 + item.Source[0] + '</td><td>'
					 + item.DeviceName + '</td><td>'
					 + item.StartTime + '</td><td>'
					 + item.EndTime + '</td><td></td></tr>';
			});
			$("#alarmList").html(html);
	});
	setTimeout(Toprefresh,5000);
}

//添加设备函数
// function addDevice(){
// 	// var devicename = $("#devicename");
// 	// var devicetype = $("#devicetype");
// 	// var deviceheight = $("#deviceheight");
// 	// var subsys = $("#subsys");
// 	// var deviceIP1 = $("#deviceIP1");
// 	// var deviceIP2 = $("#deviceIP2");
// 	// var deviceIP3 = $("#deviceIP3");
// 	// var deviceIP4 = $("#deviceIP4");
// 	// var deviceIP5 = $("#deviceIP5");
// 	// // var ipArr = new Array();

// 	// var devicebox = $("devicebox");
// 	// var boxlocation = $("#boxlocation");
// 	// var cardlocation = $("#cardlocation");
// 	// var provider = $("#provider");
// 	// $.post(
// 	// 	"addDevice",
// 	// 	// {'devicename':devicename, 
// 	// 	// 'devicetype':devicetype, 
// 	// 	// 'deviceheight':deviceheight, 
// 	// 	// 'subsys':subsys, 
// 	// 	// 'ipArr':deviceIP1, 
// 	// 	// 'devicebox':devicetype, 
// 	// 	// 'boxlocation':boxlocation, 
// 	// 	// 'cardlocation':cardlocation, 
// 	// 	// 'provider':provider, 
// 	// 	// 'remark':remark
// 	// 	// },
// 	// 	function(data){
// 	// 		if(data){
// 	// 			alert("success");
// 	// 		}
			
// 	// 	}
// 	// );
// 	$.ajax({
// 		type:"post",
// 		url:"addDevice",
// 	});
// }