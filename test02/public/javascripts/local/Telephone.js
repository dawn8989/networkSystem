$(function(){
	//5秒钟刷新一次报警列表
	//每个子系统都有一个名字和子系统ID
	// queryTelephone();
});

function queryTelephone(){
	var provider = $("#provider").val();
	$.post(
		"queryTelephone",
		{'provider':provider
		},
		function(data){
			$("#telephoneList").empty();
			var html = '';
			$.each(data, function(idx, item){
				html += '<tr><td>'
					 + '<input type="checkbox" name="order[]" value="${' + idx +'}"/></td><td>'
					 + item.Provider + '</td><td>'
					 + item.Telephone + '</td><td></td></tr>';
			});
			$("#telephoneList").html(html);
		});
}