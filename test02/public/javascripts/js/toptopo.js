$(document).ready(function(){	
			
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", screen.availWidth);
			canvas.setAttribute("height", screen.availHeight);
			canvas.setAttribute("id", "canvas");
			document.body.appendChild(canvas);	
						
			
			var stage = new JTopo.Stage(canvas);	
			
			var scene = new JTopo.Scene(stage);	
			var w=canvas.width;
			var h=canvas.height;
			scene.backgroundColor='129,192,192';
			scene.alpha=1;
			
			//scene.background = './img/573TuoPu.png';					
			
			function addPicNode(x, y, w, h, img){
				var node = new JTopo.Node();
				node.setLocation(x, y);
				node.setSize(w, h);	
				//node.setImage('./img/' + img,true);										
				//node.text = text; // 文字
				//node.textPosition = 'Top_Center';// 文字居中
				//node.textOffsetY = 20; // 文字向下偏移8个像素
				//node.font = '14px 微软雅黑'; // 字体							
				// node.borderRadius = 50;
				// node.borderWidth=5;
				// node.borderColor="255,0,0";										
				//node.dragable=false;
				node.showSelected=false;		
				scene.add(node);			
				return node;
			}			
			function addAlarmNode(x,y,color,number){
				var node = new JTopo.Node();
				node.text = ''+number; // 文字
				node.textPosition = 'Middle_Center';// 文字居中
				node.fontColor='0,0,0';            
				node.setLocation(x, y); // 位置
				node.setSize(20, 20);  // 尺寸
				node.fillColor=color;
				node.borderWidth = 2; // 边框的宽度
				node.borderColor = '0,0,0'; //边框颜色
				node.showSelected=false;
				scene.add(node);
				return node;
			}
			function addSubsystemNode(x,y,w,h,alarmNum,totalNum){
				var picNode = addPicNode(x,y,w,h);
				picNode.borderWidth = 0;
				picNode.borderColor = '255,0,0';
				picNode.startAlarm=function(){
					picNode.alarmStarted=setInterval(
					function(){
						if(picNode.borderWidth ==0)
						picNode.borderWidth =5;
						else
						picNode.borderWidth =0;
					},600);
				};
				picNode.endAlarm=function(){
					clearInterval(picNode.alarmStarted);
				}
				picNode.mouseover(function(event){this.scaleX=1.03;this.scaleY=1.03;stage.cursor="pointer";});
				picNode.mouseout(function(event){this.scaleX=1;this.scaleY=1;stage.cursor="default";});
				picNode.dbclick(function(event){window.location.href='subtopo.html';});
				addAlarmNode(x+2,y+2,'255,0,0',alarmNum);
				addAlarmNode(x+23,y+2,'255,255,255',totalNum);
				return picNode;
			}			
			function newFoldLink(nodeA, nodeZ, direction){
				//if(nodeA.x+nodeA.)
                var link = new JTopo.Link(nodeA, nodeZ);
                //link.direction = direction || 'horizontal';
                link.arrowsRadius = 15; //箭头大小
                link.lineWidth = 3; // 线宽
                //link.bundleOffset = 60; // 折线拐角处的长度
                //link.bundleGap = -37; // 线条之间的间隔               
                link.strokeColor = '255,0,0';               
                scene.add(link);
                return link;
            }
			var alarmData = [
							{"alarms":0,"devices":50},
							{"alarms":0,"devices":50},
							{"alarms":3,"devices":50},
							];
			var pics = [
						//子系统
						{ "x":w*0.279,"y":h*0.505,"width":w*0.13,"height":h*0.22},
						{ "x":w*0.5,"y":h*0.505,"width":w*0.13,"height":h*0.22},
						{ "x":w*0.8,"y":h*0.505,"width":w*0.13,"height":h*0.22},
						//图片
						{ "x":w*0.3,"y":h*0.4,"width":w*0.6,"height":h*0.02},						
					];
				
			
			var subSystemNode = new Array();
			
			for(var i=0;i<pics.length;i++){
				if(i<alarmData.length)
					subSystemNode[i]=addSubsystemNode(pics[i].x,pics[i].y,pics[i].width,pics[i].height,alarmData[i].alarms,alarmData[i].devices);
				else
					addPicNode(pics[i].x,pics[i].y,pics[i].width,pics[i].height);
			}
			for(var i=0;i<alarmData.length;i++)
				if(alarmData[i].alarms!=0)
					subSystemNode[i].startAlarm();
				else
					subSystemNode[i].endAlarm();

			// subSystemNode[1].endAlarm();
			// subSystemNode[2].startAlarm();
			// subSystemNode[1].startAlarm();
			// subSystemNode[1].startAlarm();
			//var n2 = addSubsystemNode(w*0.28,h*0.505,w*0.13,h*0.22,0,0);
		
			
			//var n3 = addPicNode(w*0.20,h*0.4,w*0.1,h*0.02);
			//alert(n3.getSize().width);
			// var l1= newFoldLink(n3,n1);
			// var l2= newFoldLink(n3,n2);
			// var l2= newFoldLink(n2,n3);
			// var link = new JTopo.Link(n2, n2);
			//scene.add(link);
			// newFoldLink(n3,n1);
			// newFoldLink(n3,n2);	
			
			//var intval=setInterval(n2.interval,600);
			/* var alarmStart=setInterval(function(){
                if(n2.borderWidth ==0){
                    n2.borderWidth =5;
                }else{
					n2.borderWidth = 0;
                }
            }, 600);  */
			//clearInterval(intval);
					
		});