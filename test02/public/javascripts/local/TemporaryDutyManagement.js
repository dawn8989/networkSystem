
	//add表单的提交
	function addTask() {
		
		$("#add_form").submit();
	}
	
	//query表单的提交
	function queryTask() {

		$("#query_form").submit();
	}
	
	/*初始化页面*/
	$(function(){
		//根据卫星、波段、极化确定可选择的临时任务信息
		$("#satelliteId").live("change", getAntenna);
		$("#satelliteBand").live("change", getAntenna);
		$("#satellitePolarize").live("change", getAntenna);
		$("#startFreq").live("change", getBandwidth);
		$("#endFreq").live("change", getBandwidth);
		for(var i=0; i<=23; i++){
			$("#hourStart").append("<option value="+i+">"+i+"</option>");
			$("#hourEnd").append("<option value="+i+">"+i+"</option>");
		}
		for(var i=0; i<=55; i+=5){
			$("#minuteStart").append("<option value="+i+">"+i+"</option>");
			$("#minuteEnd").append("<option value="+i+">"+i+"</option>");
		}
		$("#searchSatelliteId").val($("#searchSatelliteIdValue").attr("value"));
		$("#searchWaveband").val($("#searchWavebandValue").attr("value"));
		$("#searchPolarize").val($("#searchPolarizeValue").attr("value"));
	});
	
	/**添加任务时获取可供选择的天线
	 * 
	 */
	function getAntenna() {
		var satelliteId = $("#satelliteId").val();
		var satelliteBand = $("#satelliteBand").val();
		var satellitePolarize = $("#satellitePolarize").val();
		if(satelliteId != '' && satelliteBand != '' && satellitePolarize != '') {
			$.post(
					"temporaryDutyManagement-getAntenna",
					{'carrier.satellite.id':satelliteId, 'carrier.waveband':satelliteBand, 'carrier.polarize':satellitePolarize},
					function(data) {
						$("#antenna").empty().append("<option id=''>请选择</option>");
						$.each(data, function(idx, item){//循环对象取值
							$("#antenna").append("<option value="+item.id+">"+item.name+"</option>");
						});
					}
			);
		}
	}
	
	/**
	 * 添加任务时根据开始频率和结束频率得到带宽
	 */
	function getBandwidth() {
		var startFreq = $("#startFreq").val();
		var endFreq = $("#endFreq").val();
		if(startFreq != '' && endFreq != '') {
			var bandWidth = endFreq - startFreq;
			$("#bandWidth").val(bandWidth);
		}
	}
	

	//根据任务Id 中止临时任务
    function stopTask(){
        $("input[name='order[]']:checkbox:checked").each(function(){
            var taskId = $(this).val();
            $.ajax({
                type: "post", 
                url: "temporaryDutyManagement-stopTask",
                data: {'carrtask.id':taskId},
                success: function (data) {
                	alert("中止临时任务成功");
                    if(data != null){
                    	$("#taskList").empty();
                        $.each(data,function(idx,item){ //循环对象取值
                               var trObj = $('<tr></tr>');
                               trObj.append('<td><input type="checkbox" name="order[]" value="'+item.id+'"/></td>');
                               trObj.append('<td>'+item.name+'</td>');
                               trObj.append('<td>'+item.carrier.satellite.name+'</td>');
                               trObj.append('<td>'+item.carrier.waveband+'</td>');
                               trObj.append('<td>'+item.carrier.polarize+'</td>');
                               trObj.append('<td>'+item.startFreq+'</td>');
                               trObj.append('<td>'+item.endFreq+'</td>');
                               trObj.append('<td>'+item.startDate+'&nbsp;&nbsp;'+item.startTime+'</td>');
                               trObj.append('<td>'+item.endDate+'&nbsp;&nbsp;'+item.endTime+'</td>');
                               if(item.status == "1"){
                            	   trObj.append('<td>正常</td>');
                               }else if(item.status == "2"){
                            	   trObj.append('<td>停止</td>');
                               }else{
                            	   trObj.append('<td>状态未知</td>');
                               }
                               trObj.append('<td></td>');
                               $("#taskList").append(trObj);
                        });
                    }
                }, 
                error: function (XMLHttpRequest, textStatus, errorThrown) { 
                     alert("中止临时任务失败");
                } 
             });
        });
    }
	
	//将checkbox绑定删除button，若选中checkbox则调用删除方法
    function deleteTask(){
       $("input[name='order[]']:checkbox:checked").each(function(){
            var taskId = $(this).val();
            $.ajax({
                type: "post", 
                url: "temporaryDutyManagement-deleteTask",
                data: {'carrtask.id':taskId},
                success: function (data) {
                        alert("删除临时任务成功");
                        if(data != null){
                        	$("#taskList").empty();
                            $.each(data,function(idx,item){ //循环对象取值
                                   var trObj = $('<tr></tr>');
                                   trObj.append('<td><input type="checkbox" name="order[]" value="'+item.id+'"/></td>');
                                   trObj.append('<td>'+item.name+'</td>');
                                   trObj.append('<td>'+item.carrier.satellite.name+'</td>');
                                   trObj.append('<td>'+item.carrier.waveband+'</td>');
                                   trObj.append('<td>'+item.carrier.polarize+'</td>');
                                   trObj.append('<td>'+item.startFreq+'</td>');
                                   trObj.append('<td>'+item.endFreq+'</td>');
                                   trObj.append('<td>'+item.startDate+'&nbsp;&nbsp;'+item.startTime+'</td>');
                                   trObj.append('<td>'+item.endDate+'&nbsp;&nbsp;'+item.endTime+'</td>');
                                   if(item.status == "1"){
                                	   trObj.append('<td>正常</td>');
                                   }else if(item.status == "2"){
                                	   trObj.append('<td>停止</td>');
                                   }else{
                                	   trObj.append('<td>状态未知</td>');
                                   }
                                   trObj.append('<td></td>');
                                   $("#taskList").append(trObj);
                            });
                        }
                }, 
                error: function (XMLHttpRequest, textStatus, errorThrown) { 
                     alert("删除临时任务失败");
                } 
             });
        });
    }