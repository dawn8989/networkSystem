$(document).ready(function(){
	
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", screen.availWidth);
			canvas.setAttribute("height", screen.availHeight);
			canvas.setAttribute("id", "canvas");
			document.body.appendChild(canvas);


			var stage = new JTopo.Stage(canvas);				
			var scene = new JTopo.Scene(stage);	
			scene.backgroundColor='129,192,192';
			scene.alpha=1;
			

			function addRoom(x,y,w,h,rows,columns,text){
				var gridLayout = JTopo.layout.GridLayout(rows, columns);                           
				var container = new JTopo.Container();
				container.layout = gridLayout;
				container.text=text;
				container.fontColor = '0,0,0';
				container.textPosition="Top_Center";
				container.textOffsetY=30;
				container.fillColor = '234,234,234';
				container.setBound(x, y, w, h);
				container.borderWidth=3;
				container.showSelected=false;
				container.borderColor = '0,0,0';
				scene.add(container);
				return container;
            }
			function addBoxIcon(text){
				var node = new JTopo.Node(text);    
                node.textPosition = "Middle_Center";
				node.fillColor='160,160,160';				
				node.borderWidth=2;
				node.borderColor = '0,0,0'; 				
				node.click(function(event){
					lastBoxIcon.borderWidth=2;
					lastBoxIcon.borderColor = '0,0,0';
					for(var i=0;i<devices.length;i++)															
						scene.remove(devices[i]);								
					lastBoxIcon=this;
					node.borderWidth = 3;
					node.borderColor = '255,255,0';					
					box.visible=true;
					for(var i=0;i<deviceData[node.id].devices.length;i++)									
						devices[i]=addDevice(deviceData[node.id].devices[i].start,deviceData[node.id].devices[i].end,deviceData[node.id].devices[i].alarming,deviceData[node.id].devices[i].tips);						
				});
                scene.add(node);
                return node;
			}
			function addDevice(start,end,isAlarming,tips){
				var device =new JTopo.Node();				
				device.setBound(box.x+2,box.y+box.height*start/20+2,box.width-4,box.height*(end-start)/20-4);
				if(isAlarming)
				{
					device.fillColor='255,0,0';
					device.alpha=0.7;
				}
				device.click(function(event){
					$('#canvas').poshytip('update', tips);
					$('#canvas').poshytip('show'); 
				});
				device.mouseover(function(event){									
					mouseOnDevices = true;
					device.borderWidth=3;
					device.borderColor='102,255,102';
				});	
				device.mouseout(function(event){									
					mouseOnDevices = false;
					device.borderWidth=0;					
					$('#canvas').poshytip('hide'); 
				});	
				
				scene.add(device);
				return device;
			}
			var room1=addRoom(100,100,600,400,6,10,'西侧机房');
            for(var i=0; i<54; i++)
			{
				var boxIcon=addBoxIcon(''+i);
				boxIcon.id=i;
				room1.add(boxIcon); 
			}             			
			var room2=addRoom(100,600,600,200,2,10,'南侧机房');
			for(var i=0; i<20; i++)
                room2.add(addBoxIcon(''+i));              
			var lastBoxIcon=new JTopo.Node();
				
				
				
			
 			var box = new JTopo.Node();
			box.fillColor='0,0,0';
			box.setBound(1000,50,250,800);
			box.visible=false;
			scene.add(box);
			
			var devices = new Array();
			var mouseOnDevices = false;
			
			var deviceData=
				[	
					
					{
						"devices":[
							{"start":0,"end":3,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
							{"start":3,"end":6,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：3-6<br/>'},
							{"start":6,"end":8,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：6-8<br/>'},
							{"start":9,"end":10,"alarming":true,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：9-10<br/>'},
							{"start":10,"end":15,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：10-15<br/>'}
						]
					},
					{
						"devices":[
							{"start":0,"end":3,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：0-3<br/><br/><br/>设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：'},
							{"start":3,"end":7,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：3-6<br/>'},
							{"start":7,"end":8,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：6-8<br/>'},
							{"start":8,"end":10,"alarming":true,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：9-10<br/>'},
							{"start":10,"end":15,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：10-15<br/>'},
							{"start":15,"end":18,"alarming":false,"tips":'设备信息：<br/> 设备类型：<br/>所在机柜：<br/>机柜位置：<br/>设备高度：<br/>卡位置：10-15<br/>'}
							]
					}
				];
								

			$('#canvas').poshytip({ 	
				className:'tip-green',	
				showOn: 'none', 
				alignTo: 'target', 
				alignX: 'inner-left', 
				alignY: 'inner-top', 
				offsetX: 1500,
				offsetY: 200
			}); 
			
						
			$('#canvas').contextMenu('myMenu', {
				menuStyle: {					
					width: '150px'
				},				
				bindings: 
				{
					'item_1': function() {											
						alert('添加设备');
					}, 
					'item_2': function() {											
						alert('编辑设备信息');
					}, 
					'item_3': function() {											
						alert('删除设备');
					}, 
					'item_4': function() {											
						alert('门限设置');
					}, 
					'item_5': function() {											
						alert('停止报警');
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
			
           
});
