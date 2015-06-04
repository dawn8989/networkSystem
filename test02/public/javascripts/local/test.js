/*初始化页面*/
$(function(){
	//3秒刷新一次在拓扑图上的正在报警的设备数
	//每个子系统都有一个名字和子系统ID
	// show();
});

function aaa(){
	alert("hello");
	setTimeout(aaa, 5000);
}
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

// function show(){
// 	$.post(
// 	"Top",
// 	function(data){
// 		$("#17").append(data.time);
// 		$("#18").append(data.name);
// 		// $("#19").text(data.Subys);
// 	}
// 		// setTimeout(Toprefresh,3000);
// 	// $.each(data, function(idex, item){
// 	// 	$("#17").text(item.alarmNum);
// 	// 	$("#18").text(item.number);
// 	// 	$("#19").text(item.Name);
// 	// });
// 	// function(data){
// 	// 	// $.each(data, function(idex, item){
// 	// 	$("#11").text(data.name);
// 	// 	$("#12").text(data.SubSys);
// 	// 	$("#13").text(data.Id);
// 	// 	$("#14").text(data.time);
// 	// 	$("#21").text(data.Ip[0]);
// 	// 	$("#22").text(data.Ip[1]);
// 	// 	$("#23").text(data.DeviceStatus.CpuTemp);
// 	// 	$("#24").text(data.AppModules[0].Name);
// 	// 	$("#25").text(data.AppModules[0].ThreadNum);
// 	// 	// });
// 	// }
// 	);
// 	// setTimeout(show,3000);
// }
function show(){
	$.ajax({
		type:"post",
		url:"addDevice",
		success:function(data){
			if(data == "o"){
				alert("fuck");
			}
		}
	});
}