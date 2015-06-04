/*初始化页面*/
$(function(){

	$('.datetimepicker').datetimepicker();
	initContentTable();
});


function initContentTable(){
	$.post(
		"initContentTable",
		function(data){
			$("#ContentList").empty();
			var html = '';
			var Program;
			var Tsfile;
			$.each(data, function(idx, item){
				if(item.Program == undefined){
					Program = "";
				}
				if(item.Tsfile == undefined){
					Tsfile = "";
				}
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.Satellite + item.Repeater + Program + Tsfile + '</td><td>'
					 + item.Url'</td><td></td></tr>';
			});
			$("#ContentList").html(html);
		});
}



