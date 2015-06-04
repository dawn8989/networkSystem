/*初始化页面*/
$(function(){
	//5秒钟刷新一次报警列表
	//每个子系统都有一个名字和子系统ID
});

function queryDeviceStatus(){
	var devicename = $("#devicename").val();
	var devicetype = $("#devicetype").val();
	var subsys = $("#subsys").val();
	var deviceIP = $("#deviceIP").val();
	$.post(
		"queryDeviceStatus",
		{'devicename':devicename, 
		'devicetype':devicetype, 
		'subsys':subsys, 
		'deviceIP':deviceIP
		},
		function(data){
			$("#deviceList").empty();
			var html = '';
			$.each(data, function(idx, item){
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.Name + '</td><td>'
					 + item.DeviceInfo.DeviceType + '</td><td>'
					 + item.DeviceInfo.DeviceHeight + '</td><td>'
					 + item.SubSys + '</td><td>'
					 + item.Ip.join('/') + '</td><td>'
					 + item.DeviceInfo.Room + '机房' + item.DeviceInfo.Box +'机柜 '+ item.DeviceInfo.BoxLocation 
					 + '~' + parseInt(item.DeviceInfo.BoxLocation-item.DeviceInfo.DeviceHeight+1) + 'U</td><td>'
					 + item.DeviceInfo.Provider + '</td><td>'
					 + '</td><td>'
					 + item.DeviceInfo.Remark + '</td><td></td></tr>';
			});
			$("#deviceList").html(html);
		});
}