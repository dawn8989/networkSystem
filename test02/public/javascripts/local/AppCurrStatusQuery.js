/*初始化页面*/
$(function(){
	//5秒钟刷新一次报警列表
	//每个子系统都有一个名字和子系统ID
});

//向后台发请求并显示报警列表
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
}

function queryApp(){
	var appname = $("#appname").val();
	var devicetype = $("#devicetype").val();
	var subsys = $("#subsys").val();
	var alarmstatus = $("#alarmstatus").val();
	$.post(
		"queryApp",
		{'appname':appname, 
		'devicetype':devicetype, 
		'subsys':subsys, 
		'alarmstatus':alarmstatus
		},
		function(data){
			$("#appList").empty();
			var html = '';
			$.each(data, function(idx, item){
				var index = item.index;
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.device.AppModules[index].Name + '</td><td>'
					 + item.device.DeviceInfo.DeviceType + '</td><td>'
					 + item.device.Ip.join('/') + '</td><td>'
					 + item.device.SubSys + '</td><td>'
					 + item.device.AppModules[index].AlarmStatus + '</td><td>'
					 + item.device.AlarmItem + '</td><td>'//报警指标
					 + item.device.Infact + '</td><td>'//报警指标的实测值
					 + item.device.Thr + '</td><td>'//报警指标的门限值
					 + item.device.Desc + '</td><td>'//报警指标的门限值
					 + item.device.Solution + '</td><td><td></td></tr>';
			});
			$("#appList").html(html);
		});
}