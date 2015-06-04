﻿$(document).ready(function(){		
			
			$( "button" )
				.button()
				.click(function( event ) {
				$( "#dialog" ).dialog( "open" );	
				event.preventDefault();
			});	
			$( "#dialog" ).dialog({
				autoOpen: false,
				width: 400,
				buttons: [
				{
					text: "Ok",
					click: function() {
					$( this ).dialog( "close" );
					}
				},
				{
					text: "Cancel",
					click: function() {
					$( this ).dialog( "close" );
					}
				}
				]
			});
			$("div select").selectmenu({appendTo: "#dialog"});
			$("td select").selectmenu();
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", screen.availWidth);
			canvas.setAttribute("height", screen.availHeight);
			canvas.setAttribute("id", "canvas");
			document.body.appendChild(canvas);	

			var stage = new JTopo.Stage(canvas);
				
			var scene = new JTopo.Scene(stage);	
			scene.backgroundColor='129,192,192';
			scene.alpha=1;
			
			var w=canvas.width;
			var h=canvas.height;			
		
		
			function connectNode(x, y, w, h){
				var node = new JTopo.Node();								
				node.setBound(x, y, w, h);				
				node.dragable=false;
				//node.fillColor="255,0,0";
				//node.borderRadius = 5;
				//node.showSelected=false;												
				scene.add(node);			
				return node;
			}
			function deviceNode(x,y,w,h,text,tips,img){				
				var node = connectNode(x,y,w,h);				
				node.text = text; // 文字
				node.textPosition = 'Top_Center';// 文字居中
				node.textOffsetY = 20; // 文字向下偏移8个像素
				node.font = '14px 微软雅黑'; // 字体
				node.borderColor='255,0,0';
				node.startAlarm=function(){
					node.alarmStarted=setInterval(
					function(){
						if(node.borderWidth ==0)
							node.borderWidth =3;
						else
							node.borderWidth =0;
					},600);
				};
				node.endAlarm=function(){
					clearInterval(node.alarmStarted);
				}
				node.mouseover(function(event){			
					mouseOnDevices=true;
					$('#canvas').poshytip('update', tips);
					$('#canvas').poshytip('show'); 
				});
				node.mouseout(function(event){	
					mouseOnDevices=false;
					$('#canvas').poshytip('hide'); 
				});
				node.dbclick(function(event){alert('双击');});
				scene.add(node);
				return node;
			} 				
			function link(nodeA, nodeZ){
                var link = new JTopo.FoldLink(nodeA, nodeZ);
                link.lineWidth = 3; // 线宽
                //link.strokeColor = JTopo.util.randomColor();              
                scene.add(link);
                return link;
            }
			function addDevice(i){
				deviceNodeArray[i]=deviceNode(72.5+(i%25)*70,100+150*parseInt(i/25),60,60,devices[i].type+devices[i].ip,devices[i].tips);
				connectNodeArray[i]=connectNode(100+(i%25)*70,200+150*parseInt(i/25),5,5);				
				link(connectNodeArray[i],deviceNodeArray[i]);
				if(i%25==0)
				{
					startNodeArray[parseInt(i/25)]=connectNode(30+(i%25)*70,200+150*parseInt(i/25),5,5);
						link(connectNodeArray[i],startNodeArray[parseInt(i/25)]);
					if(parseInt(i/25)>0)
						link(startNodeArray[parseInt(i/25)],startNodeArray[parseInt(i/25)-1]);
				}
				else
					link(connectNodeArray[i],connectNodeArray[i-1]);
				
			}
			//function 
			var devices = [
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'SCM服务器',"ip":'192.168.0.1',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'信道监测卡',"ip":'192.168.0.2',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：1-2<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
								{"type":'解复用器',"ip":'192.168.0.3',"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
						];
			var connectNodeArray = new Array();
			var startNodeArray=new Array();
			var deviceNodeArray =new Array();
			var mouseOnDevices=false;
			for(var i=0;i<devices.length&&i<125;i++)
				addDevice(i);			
			
			
			$('#canvas').poshytip({ 	
				className:'tip-green',	
				
				showOn: 'none', 
				alignTo: 'target', 
				slide:false,
				alignX: 'inner-left', 
				alignY: 'inner-top', 
				offsetX: 1500,
				offsetY: 200,
				

			}); 
							
			$('#canvas').contextMenu('myMenu', {
				menuStyle: {					
					width: '150px'
				},				
				bindings: 
				{
					'item_1': function() {											
						alert('编辑设备信息');
					}, 
					'item_2': function() {											
						alert('删除设备');
					}, 
					'item_3': function() {											
						alert('门限设置');
					}, 
					'item_4': function() {											
						alert('停止报警');
					}, 
					'item_5': function() {											
						alert('显示业务信息');
					}, 
					'item_6': function() {											
						alert('打开设备网管界面');
					}, 
					'item_7': function() {											
						alert('远程登录设备');
					}, 
					'item_8': function() {											
						alert('重启设备');
					}, 				
				}, 
				onContextMenu: function(e) {
					return	mouseOnDevices?true:false;
				}
			});	
			
		});