/*初始化页面*/
$(function(){
	//3秒刷新一次在拓扑图上的正在报警的设备数
	//每个子系统都有一个名字和子系统ID
	// Toprefresh();
	var deviceID = $("#deviceID").text();
	showBoxCanvas(deviceID);
	var devices;
	function showBoxCanvas(deviceid){
		var deviceidtmp = deviceid.substr(1);
		$.post(
			"ShowBoxCanvas",
			{
				'deviceid':deviceidtmp
			},
			function(data) {				
				devices=data;
				var roomName=devices[0].DeviceInfo.Room==1?"西侧":"南侧";
				showBoxId.text=roomName+devices[0].DeviceInfo.Box+"号机柜";
				if(devices[0].DeviceInfo.Room!=2||devices[0].DeviceInfo.Box<21)
				{
					boxIconArray[(devices[0].DeviceInfo.Room-1)*51+devices[0].DeviceInfo.Box-1].alpha=1;
					lastBoxIcon=boxIconArray[(devices[0].DeviceInfo.Room-1)*51+devices[0].DeviceInfo.Box-1];
				}								
				for(var i=0;i<devices.length;i++)
				{						
					if(devices[i].DeviceInfo.CardLocation)
						{
							var row=1,totalSlotsInRow=5;
							if(devices[i].DeviceInfo.DeviceHeight==7)totalSlotsInRow=12;
							if(devices[i].DeviceInfo.DeviceHeight==10){row=2;totalSlotsInRow=8;}
							deviceArray[i]=addDevice(box.x+2+((devices[i].DeviceInfo.CardLocation-1)%totalSlotsInRow)*(box.width-4)/totalSlotsInRow,box.y+box.height*(42-devices[i].DeviceInfo.BoxLocation-devices[i].DeviceInfo.DeviceHeight/parseInt((devices[i].DeviceInfo.CardLocation-1)/totalSlotsInRow+1))/42+2,(box.width-4)/totalSlotsInRow-3,box.height*devices[i].DeviceInfo.DeviceHeight/row/42-4,devices[i]);
						}
					else
						deviceArray[i]=addDevice(box.x+2,box.y+box.height*(42-devices[i].DeviceInfo.BoxLocation-devices[i].DeviceInfo.DeviceHeight)/42+2,box.width-4,box.height*devices[i].DeviceInfo.DeviceHeight/42-4,devices[i]);	
					if(devices[i].DeviceId==deviceidtmp)
					{
						
						deviceArray[i].endAlarm();
						deviceArray[i].borderWidth=2;
						deviceArray[i].borderColor='102,255,102';
					}
						
				}			
		});
		// setTimeout(Toprefresh,5000);
	}
//-----------------------------陈青云  start--------------------------
	var o = document.getElementById("checkboxdiv");			 
	var w = o.offsetWidth*0.95;
	var h = o.offsetHeight*0.95;
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", w);
	canvas.setAttribute("height",h);
	canvas.setAttribute("id", "canvas");
	document.getElementById("checkboxdiv").appendChild(canvas);	
	var stage = new JTopo.Stage(canvas);				
	var scene = new JTopo.Scene(stage);	
	scene.mode = 'select';
	scene.areaSelect = false;			
	
	function addBoxIcon(x,y){
		var node = new JTopo.Node();    
		node.setLocation(x,y);				
		node.alpha=0;
		node.setImage("./img/checkbox/checked.png",true);
		node.showSelected=false;
		node.dragable=false;
		node.click(function(event){
			lastBoxIcon.alpha=0;
			lastBoxIcon=this;					
			for(var i=0;i<deviceArray.length;i++)															
				scene.remove(deviceArray[i]);																	
			node.alpha=1;
			var roomName=node.id<52?"西侧":"南侧";
			showBoxId.text=roomName+(node.id%52+parseInt(node.id/52))+"号机柜";		
			//从后台读取数据
			$.post(
				"ChooseBoxCanvas",
				{
					'room':parseInt(node.id/52)+1,"box":node.id%52+parseInt(node.id/52)
				},
				function(data){									
					devices=data;			
					for(var i=0;i<devices.length;i++)
						{						
							if(devices[i].DeviceInfo.CardLocation)
							{
								var row=1,totalSlotsInRow=5;
								if(devices[i].DeviceInfo.DeviceHeight==7)totalSlotsInRow=12;
								if(devices[i].DeviceInfo.DeviceHeight==10){row=2;totalSlotsInRow=8;}
								deviceArray[i]=addDevice(box.x+2+((devices[i].DeviceInfo.CardLocation-1)%totalSlotsInRow)*(box.width-4)/totalSlotsInRow,box.y+box.height*(42-devices[i].DeviceInfo.BoxLocation-devices[i].DeviceInfo.DeviceHeight/parseInt((devices[i].DeviceInfo.CardLocation-1)/totalSlotsInRow+1))/42+2,(box.width-4)/totalSlotsInRow-3,box.height*devices[i].DeviceInfo.DeviceHeight/row/42-4,devices[i]);
							}
							else
							deviceArray[i]=addDevice(box.x+2,box.y+box.height*(42-devices[i].DeviceInfo.BoxLocation-devices[i].DeviceInfo.DeviceHeight)/42+2,box.width-4,box.height*devices[i].DeviceInfo.DeviceHeight/42-4,devices[i]);														
						}

				});
		});
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
	function addDevice(x,y,w,h,device){
		var node = new JTopo.Node();
		node.setBound(x,y,w,h);
		node.setImage('./img/checkbox/'+setBackgroundPic(device.DeviceInfo.DeviceHeight,device.DeviceInfo.DeviceType)+'.png');
		node.showSelected=false;
		node.dragable=false;
		node.startAlarm=function(){				
			// node.alarmStarted=
			// setInterval(function(){
				// node.borderColor='255,0,0';
				// if(node.borderWidth ==0)
					// node.borderWidth =3;
				// else
					// node.borderWidth =0;
			// },100);
			node.borderColor='255,0,0';
			node.borderWidth =2;
			node.alarmStarted=true;
		};
		node.endAlarm=function(){							
			//clearInterval(node.alarmStarted);
			node.borderWidth =0;
			node.alarmStarted=false;
		}
		if(device.AlarmStatus=="ON")				
			node.startAlarm();
		node.mouseover(function(event){	
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
					devicetip+='<br/>线程数'+device.AppModules[i].ThreadNum;
					devicetip+='<br/>句柄数'+device.AppModules[i].HandleNum;
					devicetip+='<br/>IO读取'+device.AppModules[i].IORead;
					devicetip+='<br/>IO写入'+device.AppModules[i].IOWrite;					
				}
			}
			if(device.AlarmItem)
			{
				devicetip+='<br/><br/><br/>报警状态：'+'<br/>'+device.AlarmItem.join(",");
			}			
			$('#canvas').poshytip('update', devicetip);
			$('#canvas').poshytip('show'); 
			mouseOnDevices = true;
			currentDevice=this;
			// if(device.AlarmStatus=="ON")
				// node.endAlarm();
			node.borderWidth=2;
			node.borderColor='102,255,102';
		});	
		node.mouseout(function(event){									
			mouseOnDevices = false;
			
			node.borderWidth=0;
			if(node.alarmStarted)
				node.startAlarm();
			$('#canvas').poshytip('hide'); 
		});									
		scene.add(node);
		return node;
	}	
	function addPics(x,y,img){
		var picNode = new JTopo.Node();				
		picNode.setLocation(x,y);
		picNode.setImage("./img/checkbox/"+img,true);
		picNode.showSelected=false;
		picNode.dragable=false;
		scene.add(picNode);
	}
	pics=[[850,canvas.height*0.1],[850+135,canvas.height*0.1-78],[850+135+228,canvas.height*0.1],[850+135+228+135,canvas.height*0.1]];
	addPics(pics[0][0],pics[0][1],"box_background.png");
	addPics(pics[2][0],pics[3][1],"box_background.png");
	addPics(pics[3][0],pics[3][1],"box_background.png");
	addPics(pics[1][0],pics[1][1],"box.png");
	addPics(80,canvas.height*0.05,"westroom.png");
	addPics(205,canvas.height*0.05+333,"southroom.png");

	var boxIconArray = new Array();
	var boxId=1;
	for(var r=0,k=0;r<6;r++){
		if(r==5)k=3;
		for(var i=k;i<9;i++){						
		boxIconArray.push(addBoxIcon(360-r*25.5+i*28.4,canvas.height*0.05+385-r*42-i*17.5));				
		boxIconArray[boxId-1].id=boxId;
		boxId++;				
		}
	}			
	for(var r=0;r<2;r++)
	for(var i=0;i<10;i++){				
		boxIconArray.push(addBoxIcon(358+r*25.5+i*28.4,canvas.height*0.05+541+r*42-i*17,"box_alarming.png"));
		boxIconArray[boxId-1].id=boxId;
		boxId++;
	}
	
	var box = new JTopo.Node();			
	box.setBound(850+145,canvas.height*0.1-66,135,612);
	box.alpha=0;
	box.showSelected=false;	
	box.dragable=false;
	scene.add(box);
	
	var showBoxId=new JTopo.Node();
	showBoxId.fillColor="204,204,204";
	showBoxId.text="";
	showBoxId.textPosition = 'Middle_Center';						
	showBoxId.font = '20px 微软雅黑';
	showBoxId.fontColor='0,0,0';
	showBoxId.setBound(995,canvas.height*0.1+600,135,45);
	showBoxId.showSelected=false;
	showBoxId.dragable=false;	
	scene.add(showBoxId);
	
	var lastBoxIcon=new JTopo.Node();
	var deviceArray = new Array();			
	var mouseOnDevices = false;
	var currentDevice;
				
	$('#canvas').poshytip({ 	
		className:'tip-green',	
		showOn: 'none', 
		alignTo: 'target', 
		alignX: 'inner-left', 
		alignY: 'inner-top', 
		offsetX: 1240,
		offsetY: canvas.height*0.1+50
	}); 
					
	$('#canvas').contextMenu('myMenu', {
		menuStyle: {					
			width: '150px'
		},	
		 itemStyle: {
			font : 'bold 12px/14px arial,helvetica,sans-serif',										
			border: 'none',
			padding: '3px'

		},
		bindings: 
		{
			'item_1': function() {											
				$( "#addDeviceDialog" ).dialog( "open" );
			}, 
			'item_2': function() {											
				alert('编辑设备信息');
			}, 
			'item_3': function() {															
				scene.remove(currentDevice);
			}, 
			'item_4': function() {											
				$( "#setThresholdDialog" ).dialog( "open" );
			}, 
			'item_5': function() {											
				currentDevice.endAlarm();				
			}, 
			'item_6': function() {											
				alert('显示业务信息');
			}, 
			'item_7': function() {											
				alert('打开设备网管界面');
			}, 
			'item_8': function() {											
				alert('远程登录设备');
			}, 
			'item_9': function() {											
				alert('重启设备');
			}, 				
		}, 
		onShowMenu: function(e,menu) {
			if(mouseOnDevices)
			$('#item_1', menu).remove();
			if(box.selected)
			$('#item_2,#item_3,#item_4,#item_5,#item_6,#item_7,#item_8,#item_9', menu).remove();
			return menu;
		},
		onContextMenu: function(e) {
			if (box.selected==false && mouseOnDevices == false) 
				return false;
			else 
				return true;		
		}
	});			
//-----------------------------陈青云  end--------------------------
});

function Toprefresh(){
		$.post(
		"Alarm",
		function(data) {
			$("#taskList").empty();
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
			$("#taskList").html(html);
		});
		setTimeout(Toprefresh,5000);
	// setInterval(Toprefresh, 3000);	//3秒刷新一次
}

