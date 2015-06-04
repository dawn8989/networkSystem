/*初始化页面*/
$(function(){
	//3秒刷新一次在拓扑图上的正在报警的设备数
	//每个子系统都有一个名字和子系统ID
	Toprefresh();
	SubNumShow();
//---------------------------------陈青云代码 start--------------------------------			

	function addAlarmNode(x,y,color,number){
		var node = new JTopo.Node();
		node.text = ''+number;
		node.textPosition = 'Middle_Center';
		node.fontColor='0,0,0';            
		node.setLocation(x, y);
		node.setSize(20, 20); 
		node.fillColor=color;
		node.borderWidth = 2; 
		node.borderColor = '0,0,0'; 
		node.showSelected=false;
		node.dragable=false;
		scene.add(node);
		return node;
	}						
	function getY(ax,ay,bx,by,x){return (ay-by)/(ax-bx)*(x-ax)+ay;}
	function addSubsystemNode(pic,alarmNum,totalNum){
		var picNode = new JTopo.Node();
		picNode.setBound(pic.x/1544*w,pic.y/728*h,pic.width/1544*w,pic.height/728*h);
		picNode.showSelected=false;
		picNode.dragable=false;
		picNode.setImage("./img/toptopo/"+ pic.img);			
		picNode.systemId=0;
		picNode.startAlarm=function(){
			picNode.alarmStarted=setInterval(
			function(){
				if(picNode.alpha==0)
					picNode.alpha=1;
				else
					picNode.alpha=0;
			},300);
		};
		picNode.endAlarm=function(){					
			clearInterval(picNode.alarmStarted);
			picNode.alpha=0;					
		}
		picNode.mousemove(function(event){
			if(event.y>getY((pic.w[0]+pic.x)/1544*w,(pic.w[1]+pic.y)/728*h,(pic.n[0]+pic.x)/1544*w,(pic.n[1]+pic.y)/728*h,event.x)&&event.y<getY((pic.e[0]+pic.x)/1544*w,(pic.e[1]+pic.y)/728*h,(pic.s[0]+pic.x)/1544*w,(pic.s[1]+pic.y)/728*h,event.x)
				&&event.y<getY((pic.w[0]+pic.x)/1544*w,(pic.w[1]+pic.y)/728*h,(pic.s[0]+pic.x)/1544*w,(pic.s[1]+pic.y)/728*h,event.x)&&event.y>getY((pic.e[0]+pic.x)/1544*w,(pic.e[1]+pic.y)/728*h,(pic.n[0]+pic.x)/1544*w,(pic.n[1]+pic.y)/728*h,event.x))
			{								
				stage.cursor="pointer";mouseOnSubsystem=true;
			}
			else{
				stage.cursor="default";mouseOnSubsystem=false;
			}
		}); 
		picNode.dbclick(function(event){					
			if(mouseOnSubsystem)					
			window.location.href='http://localhost:3000/SubTopology:'+picNode.systemId;//跳转
		});
		scene.add(picNode);
		picNode.alarmNumNode=addAlarmNode((pic.x+pic.e[0])/1544*w-40,(pic.y+pic.e[1])/728*h+2-20,'255,0,0',alarmNum);
		picNode.totalNumNode=addAlarmNode((pic.x+pic.e[0])/1544*w-20,(pic.y+pic.e[1])/728*h+2-20,'255,255,255',totalNum);				
		return picNode;
	}				
	
	var pics = [
				{ "x":975-13,"y":71-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":847-13,"y":157-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":702-13,"y":240-65,"width":282,"height":146,"img":"kuang03.png","w":[0,64],"n":[100,0],"e":[279,79],"s":[180,144]},
				{ "x":895-13,"y":322-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":1000-13,"y":367-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":1107-13,"y":412-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":1217-13,"y":457-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":280,"y":460-65-65,"width":378,"height":208,"img":"kuang04.png","w":[0,129],"n":[200,0],"e":[376,78],"s":[178,206]},
				{ "x":579-13,"y":475-65,"width":282,"height":146,"img":"kuang03.png","w":[0,64],"n":[100,0],"e":[279,79],"s":[180,144]},						
				{ "x":770-13,"y":554-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":873-13,"y":599-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":974-13,"y":642-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},
				{ "x":1076-13,"y":686-65,"width":192,"height":108,"img":"kuang01.png","w":[0,64],"n":[100,0],"e":[190,40],"s":[90,106]},																													
				{ "x":15,"y":582-65-65,"width":378,"height":208,"img":"kuang04.png","w":[0,129],"n":[200,0],"e":[376,78],"s":[178,206]},						
				{ "x":460-5,"y":609-65,"width":368,"height":184,"img":"kuang05.png","w":[0,64],"n":[100,0],"e":[367,116],"s":[267,181]},																	
			];	
	
	function creatCanvas(x,y,w,h){
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width",w);
		canvas.setAttribute("height",h);
		canvas.setAttribute("id", "canvas");		
		canvas.setAttribute("style", "position:absolute;left:"+x+"px;top:"+y+"px;");	
		document.body.appendChild(canvas);
		return canvas;
	}
	function creatScene(){
		
		scene.mode = 'select';
		scene.areaSelect = false;
		scene.background = './img/toptopo/toptopo.png';
		for(var i=0;i<pics.length;i++){								
			subSystemNodeArray[i]=addSubsystemNode(pics[i]);
			subSystemNodeArray[i].systemId=i+1;		
		}
		$.post(
		"SubNumShow",
		function(data){
			
			for(var i=0;i<subSystemNodeArray.length;i++)
			{
				subSystemNodeArray[i].alarmNumNode.text=data[i][0]+"";
				subSystemNodeArray[i].totalNumNode.text=data[i][1]+"";
				if(data[i][0]>0){
					subSystemNodeArray[i].endAlarm();
					subSystemNodeArray[i].startAlarm();
				}
					
				else
					subSystemNodeArray[i].endAlarm();
			}
		});
		
	}
	var subSystemNodeArray = new Array();
	var mouseOnSubsystem=false;
	var o = document.getElementById("topdiv");
	var h = o.offsetHeight*0.99;
	var w = o.offsetWidth*0.99;		
	var stage = new JTopo.Stage(creatCanvas(266,76,w,h));
	var scene = new JTopo.Scene(stage);
	creatScene();	
	$("#fullScreenButton").click(function(){		
		$(".sidebar").hide();		
		$("#listdiv").hide();	
		$("#canvas").remove();
		h=window.screen.height;
		w=window.screen.width;
		stage = new JTopo.Stage(creatCanvas(0,0,w,h));		
		$("#canvas").css({
			"background-color":"#000",
			"zIndex":100
		});		
		scene = new JTopo.Scene(stage);	
		creatScene();
		scene.click(function(event){					
			if(!mouseOnSubsystem)					
			{
				$(".sidebar").show();
				$("#listdiv").show();
				h = o.offsetHeight*0.99;
				w = o.offsetWidth*0.99;
				$("#canvas").remove();										
				stage = new JTopo.Stage(creatCanvas(266,76,w,h));				
				scene = new JTopo.Scene(stage);	
				creatScene();
			}
		});						
	});	
	$("#boxButton").click(function(){window.location.href="http://localhost:3000/CheckBox:10000";});
//---------------------------------陈青云代码 end--------------------------------	
	function SubNumShow(){
		$.post(
		"SubNumShow",
		// {
		// 'SubSysId':subsysid
		// },
		function(data){
			
			for(var i=0;i<subSystemNodeArray.length;i++)
			{
				subSystemNodeArray[i].alarmNumNode.text=data[i][0]+"";
				subSystemNodeArray[i].totalNumNode.text=data[i][1]+"";
				if(data[i][0]>0)
					{
					subSystemNodeArray[i].endAlarm();
					subSystemNodeArray[i].startAlarm();
				}
				else
					subSystemNodeArray[i].endAlarm();
			}
		});
		setTimeout(SubNumShow,5000);
	}
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
		setTimeout(Toprefresh,5000);
		});
	// setInterval(Toprefresh, 3000);	//3秒刷新一次
}

