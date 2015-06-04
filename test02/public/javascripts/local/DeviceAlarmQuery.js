/*初始化页面*/
$(function(){

	$('.datetimepicker').datetimepicker();
});

function queryDeviceAlarm(){
	var devicename = $("#devicename").val();
	var devicetype = $("#devicetype").val();
	var subsys = $("#subsys").val();
	var appname = $("#appname").val();
	var alarmtype = $("#alarmtype").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	$.post(
		"queryDeviceAlarm",
		{'devicename':devicename, 
		'devicetype':devicetype, 
		'subsys':subsys, 
		'appname':appname,
		'alarmtype':alarmtype,
		'starttime':starttime,
		'endtime':endtime
		},
		function(data){
			$("#deviceList").empty();
			var html = '';
			var app;
			$.each(data, function(idx, item){
				if(item.Source.length == 5){
					app = item.Source[2];
				}else{
					app = "";
				}
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.DeviceName + '</td><td>'
					 + item.DeviceType + '</td><td>'
					 + item.SubSys + '</td><td>'
					 + item.Room + '机房' + item.Box +'机柜 '+ item.BoxLocation 
					 + '~' + parseInt(item.BoxLocation-item.DeviceHeight+1) + 'U</td><td>'
					 + app + '</td><td>'
					 + item.Source[1] + '</td><td>'
					 + item.StartTime + '</td><td>'
					 + item.EndTime + '</td><td><td></td></tr>';
			});
			$("#deviceList").html(html);
		});
}