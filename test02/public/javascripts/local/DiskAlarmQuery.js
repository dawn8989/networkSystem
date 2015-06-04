/*初始化页面*/
$(function(){

	$('.datetimepicker').datetimepicker();
});

function queryDiskAlarm(){
	var diskdir = $("#diskdir").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	$.post(
		"queryDiskAlarm",
		{'diskdir':diskdir, 
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
					 + item.LocalDir + '</td><td>'
					 + item.Desc + '</td><td><td></td></tr>';
			});
			$("#alarmList").html(html);
		});
}