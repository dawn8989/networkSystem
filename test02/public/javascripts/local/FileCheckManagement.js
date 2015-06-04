/*初始化页面*/
$(function(){

	$('.datetimepicker').datetimepicker();
	Alarmrefresh();
});

function queryFileTask(){
	var taskname = $("#taskname").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	$.post(
		"queryFileTask",
		{'taskname':taskname, 
		'starttime':starttime,
		'endtime':endtime
		},
		function(data){
			$("#taskList").empty();
			var html = '';
			$.each(data, function(idx, item){
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.Name + '</td><td>'
					 + item.InitTime + '</td><td>'
					 + item.EndTime + '</td><td>'
					 + item.Frequency+ '</td><td>'
					 + '<button class="btn" type="button" onclick="showTaskContent(item.id)">详情</button>'
					 //这里传一个item.id的参数
					 + '</td><td></td></tr>';
			});
			$("#taskList").html(html);
		});
}

//向后台发请求并显示报警列表
function Alarmrefresh(){
	$.post(
		"FileAlarmShow",
		function(data) {
			$("#alarmList").empty();
			var html = '';
			$.each(data, function(idx, item){//循环对象取值
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.Time + '</td><td>'
					 + item.Content+ '</td><td>'
					 + item.Desc + '</td><td></td></tr>';
			});
			$("#alarmList").html(html);
	});
	setTimeout(Alarmrefresh,5000);
}

// function addTask(){
// 	$.post(
// 		"FileCheckAdd",
// 		);
// }



