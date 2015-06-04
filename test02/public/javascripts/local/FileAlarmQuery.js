/*初始化页面*/
$(function(){

	$('.datetimepicker').datetimepicker();
});

function queryFileAlarm(){
	var taskname = $("#taskname").val();
	var content = $("#content").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	$.post(
		"queryFileAlarm",
		{'taskname':taskname, 
		'content':content, 
		'starttime':starttime,
		'endtime':endtime
		},
		function(data){
			$("#alarmList").empty();
			var html = '';
			$.each(data, function(idx, item){
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.Time + '</td><td>'
					 + item.Content + '</td><td>'
					 + item.Desc + '</td><td><td></td></tr>';
			});
			$("#alarmList").html(html);
		});
}