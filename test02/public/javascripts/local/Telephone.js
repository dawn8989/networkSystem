
$(function(){
	//5秒钟刷新一次报警列表
	//每个子系统都有一个名字和子系统ID	
	queryTelephone();
});
function queryTelephone(){
	var provider = $("#providerInputBox").val();	
	var telephone = $("#telephoneInputBox").val();	
	$.post(
		"queryTelephone",
		{
			'provider':provider,
			'telephone': telephone
		},
		function(data){			
			$("#telephoneList").empty();
			var html = '';
			$.each(data, function(idx, item){
				html += '<tr><td>'
					 + '<input type="checkbox" name="order" value="'+item._id+'"/></td><td>'
					 + item.provider + '</td><td>'
					 + item.telephone + '</td><td><button class="btn btn-info" type="button" value="'+item._id+'" onclick="showEditTelephoneModal(this)">编辑</button></td></tr>';
			});
			$("#telephoneList").html(html);
		});
}
  function addTelephone(){
	  var provider=$("#addTelephoneModal input[name='provider']").val();
	  var telephone=$("#addTelephoneModal input[name='telephone']").val();
	  $.post(
		"addTelephone",
		{
			'provider':provider,
			'telephone':telephone
		},
		function(){
			queryTelephone();
		});
	   
  }
  function deleteTelephone(){
       $("input[name='order']:checkbox:checked").each(function(){
			$(this).parent().parent().remove();
			$.post("deleteTelephone",{"_id":$(this).val()});		
	   });
  }  
  function showEditTelephoneModal(btn){	   
	   $("#editTelephoneModal input[name='telephone']").val($(btn).parent().prev().html());
	   $("#editTelephoneModal input[name='provider']").val($(btn).parent().prev().prev().html());
	   $("#editTelephoneModal input[name='_id']").val($(btn).val());
	   $('#editTelephoneModal').modal('show');	   
  }
  function editTelephone(){	  
	  var provider=$("#editTelephoneModal input[name='provider']").val();
	  var telephone=$("#editTelephoneModal input[name='telephone']").val();	  
	  $.post(
		"editTelephone",
		{
			'provider':provider,
			'telephone':telephone,
			'_id':$("#editTelephoneModal input[name='_id']").val()
		},
		function(){
			queryTelephone();
		});
	   
  }
        